const express = require("express");
const router = express.Router();
const { getAIRecommendations } = require("../controllers/aiController");
const requireAuth = require("../middleware/authMiddleware");

router.use(requireAuth);
router.post("/recommendations", getAIRecommendations);

module.exports = router;