const Goal = require('../models/Goal');

//Get Al Goals
const getGoals = async(req,res) => {
    try{
        const goals = await Goal.find({ user: req.user }).sort({ createdAt: -1 });
        res.status(200).json(goals);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Create A New Goal
const createGoal = async(req,res) => {
    const {name, goalType, goalTarget, goalStart} = req.body;
    try{
        const goal = await Goal.create({ name, goalType, goalTarget, goalStart,user: req.user});
        res.status(201).json({ message: 'Goal created successfully', goal });
    }catch(error){
        res.status(400).json({message: error.message})
    }
};

// //Update A Goal by ID
// const updateGoal = async(req,res) => {
//     try{
//         const{ id } = req.params;
//         const goal = Goal.findByIdAndUpdate(id,req.body,{new: true});
//         if(!goal){
//             return res.status(400).json({message:error.message});
//         }
//         res.status(200).json({message:'Goal updated successfully',goal});
//     }catch(error){
//         res.status(400).json({ message: error.message });
//     }
// };

module.exports = {
    createGoal,
    //updateGoal,
    getGoals
};