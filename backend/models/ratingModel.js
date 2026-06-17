const db = require('../config/db');

const submitRating = async (userId, storeId, rating) => {
    const [result] = await db.query(
        `INSERT INTO Ratings (user_id, store_id, rating) VALUES (?, ?, ?) 
         ON DUPLICATE KEY UPDATE rating = ?`,
        [userId, storeId, rating, rating]
    );
    return result;
};

const getStoreRatingsByOwner = async (ownerId) => {
    const query = `
        SELECT u.name, u.email, r.rating, r.created_at
        FROM Ratings r
        JOIN Users u ON r.user_id = u.id
        JOIN Stores s ON r.store_id = s.id
        WHERE s.owner_id = ?
    `;
    const [rows] = await db.query(query, [ownerId]);
    return rows;
};

const getDashboardStats = async () => {
    const [[{ total_users }]] = await db.query(`SELECT COUNT(*) as total_users FROM Users`);
    const [[{ total_stores }]] = await db.query(`SELECT COUNT(*) as total_stores FROM Stores`);
    const [[{ total_ratings }]] = await db.query(`SELECT COUNT(*) as total_ratings FROM Ratings`);
    return { total_users, total_stores, total_ratings };
};

module.exports = { submitRating, getStoreRatingsByOwner, getDashboardStats };