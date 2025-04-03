const express = require('express');
const router = express.Router();

const{getGoals,createGoal,updateGoal} = require('../controllers/GoalController');

//GET -> api/goals
router.get('/', getGoals);

//POST -> api/goals
router.post('/',createGoal);

//UPDATE -> api/goals/:id
router.put('/:id',updateGoal);

module.exports = router;