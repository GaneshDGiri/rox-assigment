const storeModel = require('../models/storeModel');
const ratingModel = require('../models/ratingModel');

const addStore = async (req, res) => {
    try {
        const { owner_id, name, email, address } = req.body;
        await storeModel.createStore({ owner_id, name, email, address });
        res.status(201).json({ message: "Store created successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getStores = async (req, res) => {
    try {
        const search = req.query.search || '';
        const userId = req.user?.id || null;
        const stores = await storeModel.getStores(search, userId);
        res.json(stores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAdminDashboard = async (req, res) => {
    try {
        const stats = await ratingModel.getDashboardStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateStoreAddress = async (req, res) => {
    try {
        const { address } = req.body;
        if (!address || address.length > 400) {
            return res.status(400).json({ message: "Address is required and must not exceed 400 characters" });
        }
        const store = await storeModel.getStoreByOwnerId(req.user.id);
        if (!store) {
            return res.status(404).json({ message: "Store not found" });
        }
        await storeModel.updateStoreAddress(store.id, address);
        res.json({ message: "Store address updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { addStore, getStores, getAdminDashboard, updateStoreAddress };