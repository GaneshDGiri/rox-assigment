const ratingModel = require('../models/ratingModel');

const addOrUpdateRating = async (req, res) => {
    try {
        const { store_id, rating } = req.body;
        if (rating < 1 || rating > 5) return res.status(400).json({ message: "Rating must be between 1 and 5" });

        await ratingModel.submitRating(req.user.id, store_id, rating);
        res.json({ message: "Rating submitted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getStoreOwnerDashboard = async (req, res) => {
    try {
        const ratings = await ratingModel.getStoreRatingsByOwner(req.user.id);
        const avgRating = ratings.length > 0 
            ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length 
            : 0;
            
        res.json({ average_rating: avgRating.toFixed(1), ratings });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { addOrUpdateRating, getStoreOwnerDashboard };