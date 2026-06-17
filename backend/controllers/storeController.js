const storeModel = require('../models/storeModel');
const storeUpdateRequestModel = require('../models/storeUpdateRequestModel');
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

const requestStoreUpdate = async (req, res) => {
    try {
        const { name, email, address } = req.body;
        const store = await storeModel.getStoreByOwnerId(req.user.id);
        if (!store) {
            return res.status(404).json({ message: "Store not found" });
        }

        if (!name || !email || !address) {
            return res.status(400).json({ message: "Name, email, and address are required" });
        }

        if (name.length < 3 || name.length > 255) {
            return res.status(400).json({ message: "Store name must be between 3 and 255 characters" });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        if (address.length > 400) {
            return res.status(400).json({ message: "Address must not exceed 400 characters" });
        }

        const existingStore = await storeModel.getStoreByEmail(email);
        if (existingStore && existingStore.id !== store.id) {
            return res.status(400).json({ message: "Email already in use by another store" });
        }

        await storeUpdateRequestModel.createUpdateRequest({
            store_id: store.id,
            owner_id: req.user.id,
            requested_name: name,
            requested_email: email,
            requested_address: address
        });

        res.status(201).json({ message: "Store update request submitted for approval" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getStoreUpdateRequests = async (req, res) => {
    try {
        const requests = await storeUpdateRequestModel.getUpdateRequests();
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const approveStoreUpdateRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const request = await storeUpdateRequestModel.getUpdateRequestById(requestId);
        if (!request) return res.status(404).json({ message: "Update request not found" });
        if (request.status !== 'Pending') return res.status(400).json({ message: "Request is not pending" });

        await storeModel.updateStoreById(request.store_id, request.requested_name, request.requested_email, request.requested_address);
        await storeUpdateRequestModel.approveUpdateRequest(requestId, req.user.id);

        res.json({ message: "Store update request approved" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const rejectStoreUpdateRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { comment } = req.body;
        const request = await storeUpdateRequestModel.getUpdateRequestById(requestId);
        if (!request) return res.status(404).json({ message: "Update request not found" });
        if (request.status !== 'Pending') return res.status(400).json({ message: "Request is not pending" });

        await storeUpdateRequestModel.rejectUpdateRequest(requestId, req.user.id, comment || 'Rejected by administrator');
        res.json({ message: "Store update request rejected" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addStore,
    getStores,
    getAdminDashboard,
    updateStoreAddress,
    requestStoreUpdate,
    getStoreUpdateRequests,
    approveStoreUpdateRequest,
    rejectStoreUpdateRequest
};