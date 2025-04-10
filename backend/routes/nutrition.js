const express = require('express');
const router = express.Router();
const Nutrition = require('../models/nutrition');
const { createNutrition, getNutritions, deleteNutrition } = require('../controllers/NutriController');
const requireAuth = require('../middleware/authMiddleware');

//Protect Routes Below This Using Authentication 
router.use(requireAuth);

router.post('/', createNutrition);
router.get('/', getNutritions);
router.delete('/:id', deleteNutrition);
module.exports = router;