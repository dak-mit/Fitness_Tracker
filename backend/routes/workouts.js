const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/authMiddleware');

const Workout = require('../models/workout');
const { createWorkout, getWorkouts, deleteWorkout } = require('../controllers/WorkoutController');

//Protect Routes Below This Using Authentication 
router.use(requireAuth);

//POST /api/workouts => To Add A New Workout
router.post('/', createWorkout);

//GET /api/workouts => To Get All The Workouts:
router.get('/', getWorkouts);

//DELETE /api/workouts/:id => To Delete A Workout By ID:
router.delete('/:id', deleteWorkout);

module.exports = router;