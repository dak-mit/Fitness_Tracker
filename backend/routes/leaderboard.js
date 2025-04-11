const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/authMiddleware');
const {GetLeaderboard} = require('../controllers/leaderboardController');

router.use(requireAuth);

router.get('/',GetLeaderboard);

module.exports = router;