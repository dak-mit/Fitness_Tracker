const express = require('express');
const router = express.Router();

require("dotenv").config();
const{getGoals,createGoal} = require('../controllers/GoalController');
const requireAuth = require('../middleware/authMiddleware');

//Protect Routes Below This Using Authentication 
router.use(requireAuth);

//GET -> api/goals
router.get('/', getGoals);

//POST -> api/goals
router.post('/',createGoal);

// //UPDATE -> api/goals/:id
// router.put('/:id',updateGoal);

module.exports = router;