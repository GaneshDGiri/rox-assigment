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

const updateStoreAddress = async (storeId, address) => {
    await db.query(`UPDATE Stores SET address = ? WHERE id = ?`, [address, storeId]);
};

module.exports = { createStore, getStores, getStoreByOwnerId, updateStoreAddress };