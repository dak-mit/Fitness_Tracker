const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const{getGoals,createGoal,updateGoal} = require('../controllers/GoalController');

// const verifyToken = (req, res, next) => {
//     const token = req.headers["authorization"]?.split(" ")[1];
//     if (!token) return res.status(401).json({ error: "Access denied" });
  
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.userId = decoded.id;
//       next();
//     } catch (error) {
//       res.status(401).json({ error: "Invalid token" });
//     }
//   };

//GET -> api/goals
router.get('/', getGoals);

//POST -> api/goals
router.post('/',createGoal);

//UPDATE -> api/goals/:id
router.put('/:id',updateGoal);

module.exports = router;