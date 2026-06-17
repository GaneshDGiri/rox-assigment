const db = require('../config/db');

const createStore = async (storeData) => {
    const { owner_id, name, email, address } = storeData;
    const [result] = await db.query(
        `INSERT INTO Stores (owner_id, name, email, address) VALUES (?, ?, ?, ?)`,
        [owner_id, name, email, address]
    );
    return result.insertId;
};

const getStores = async (search = '', userId = null) => {
    const query = `
        SELECT s.id, s.name, s.email, s.address,
        IFNULL(AVG(r.rating), 0) as overall_rating,
        IFNULL(MAX(CASE WHEN ur.user_id = ? THEN ur.rating END), 0) as user_rating
        FROM Stores s
        LEFT JOIN Ratings r ON s.id = r.store_id
        LEFT JOIN Ratings ur ON s.id = ur.store_id
        WHERE s.name LIKE ? OR s.email LIKE ? OR s.address REGEXP ?
        GROUP BY s.id, s.name, s.email, s.address
        ORDER BY s.name ASC
    `;
    const searchPattern = `\\b${search}`;
    const [rows] = await db.query(query, [userId, `%${search}%`, `%${search}%`, searchPattern]);
    return rows;
};

const getStoreByOwnerId = async (ownerId) => {
    const [rows] = await db.query(`SELECT * FROM Stores WHERE owner_id = ?`, [ownerId]);
    return rows[0];
};

const getStoreByEmail = async (email) => {
    const [rows] = await db.query(`SELECT * FROM Stores WHERE email = ?`, [email]);
    return rows[0];
};

const createUpdateRequest = async (requestData) => {
    const { store_id, owner_id, requested_name, requested_email, requested_address } = requestData;
    const [result] = await db.query(
        `INSERT INTO StoreUpdateRequests (store_id, owner_id, requested_name, requested_email, requested_address) VALUES (?, ?, ?, ?, ?)`,
        [store_id, owner_id, requested_name, requested_email, requested_address]
    );
    return result.insertId;
};

const getUpdateRequests = async () => {
    const [rows] = await db.query(
        `SELECT r.id, r.store_id, r.owner_id, r.requested_name, r.requested_email, r.requested_address,
                r.status, r.review_comment, r.reviewed_by, r.reviewed_at, r.created_at,
                s.name AS current_name, s.email AS current_email, s.address AS current_address,
                u.name AS owner_name, u.email AS owner_email
         FROM StoreUpdateRequests r
         JOIN Stores s ON r.store_id = s.id
         JOIN Users u ON r.owner_id = u.id
         ORDER BY r.created_at DESC`
    );
    return rows;
};

const getUpdateRequestsByOwnerId = async (ownerId) => {
    const [rows] = await db.query(
        `SELECT r.id, r.store_id, r.requested_name, r.requested_email, r.requested_address,
                r.status, r.review_comment, r.reviewed_by, r.reviewed_at, r.created_at,
                s.name AS current_name, s.email AS current_email, s.address AS current_address
         FROM StoreUpdateRequests r
         JOIN Stores s ON r.store_id = s.id
         WHERE r.owner_id = ?
         ORDER BY r.created_at DESC`,
        [ownerId]
    );
    return rows;
};

const getUpdateRequestById = async (requestId) => {
    const [rows] = await db.query(`SELECT * FROM StoreUpdateRequests WHERE id = ?`, [requestId]);
    return rows[0];
};

const updateStoreAddress = async (storeId, address) => {
    await db.query(`UPDATE Stores SET address = ? WHERE id = ?`, [address, storeId]);
};

const updateStoreById = async (storeId, name, email, address) => {
    await db.query(`UPDATE Stores SET name = ?, email = ?, address = ? WHERE id = ?`, [name, email, address, storeId]);
};

const approveUpdateRequest = async (requestId, reviewerId) => {
    await db.query(
        `UPDATE StoreUpdateRequests SET status = 'Approved', reviewed_by = ?, reviewed_at = NOW() WHERE id = ? AND status = 'Pending'`,
        [reviewerId, requestId]
    );
};

const rejectUpdateRequest = async (requestId, reviewerId, reviewComment) => {
    await db.query(
        `UPDATE StoreUpdateRequests SET status = 'Rejected', reviewed_by = ?, reviewed_at = NOW(), review_comment = ? WHERE id = ? AND status = 'Pending'`,
        [reviewerId, reviewComment, requestId]
    );
};

module.exports = {
    createStore,
    getStores,
    getStoreByOwnerId,
    updateStoreAddress,
    getStoreByEmail,
    createUpdateRequest,
    getUpdateRequests,
    getUpdateRequestsByOwnerId,
    getUpdateRequestById,
    updateStoreById,
    approveUpdateRequest,
    rejectUpdateRequest
};
