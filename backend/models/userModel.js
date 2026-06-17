const db = require('../config/db');

const createUser = async (userData) => {
    const { name, email, password, address, role } = userData;
    const [result] = await db.query(
        `INSERT INTO Users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)`,
        [name, email, password, address, role || 'Normal User']
    );
    return result.insertId;
};

const getUserByEmail = async (email) => {
    const [rows] = await db.query(`SELECT * FROM Users WHERE email = ?`, [email]);
    return rows[0];
};

const getAllUsers = async (filters = {}) => {
    let query = `SELECT id, name, email, address, role FROM Users WHERE 1=1`;
    const params = [];
    
    if (filters.name) { query += ` AND name LIKE ?`; params.push(`%${filters.name}%`); }
    if (filters.email) { query += ` AND email LIKE ?`; params.push(`%${filters.email}%`); }
    if (filters.address) { query += ` AND address LIKE ?`; params.push(`%${filters.address}%`); }
    if (filters.role) { query += ` AND role = ?`; params.push(filters.role); }

    const validSort = ['name', 'email', 'address', 'role'];
    if (filters.sortBy && validSort.includes(filters.sortBy)) {
        const order = filters.order === 'desc' ? 'DESC' : 'ASC';
        query += ` ORDER BY ${filters.sortBy} ${order}`;
    } else {
        query += ` ORDER BY name ASC`;
    }
    
    const [rows] = await db.query(query, params);
    return rows;
};

const getUserById = async (userId) => {
    const [rows] = await db.query(`SELECT id, name, email, address, role FROM Users WHERE id = ?`, [userId]);
    return rows[0];
};

const updatePassword = async (userId, hashedPassword) => {
    await db.query(`UPDATE Users SET password = ? WHERE id = ?`, [hashedPassword, userId]);
};

const updateAddress = async (userId, address) => {
    await db.query(`UPDATE Users SET address = ? WHERE id = ?`, [address, userId]);
};

module.exports = { createUser, getUserByEmail, getAllUsers, getUserById, updatePassword, updateAddress };