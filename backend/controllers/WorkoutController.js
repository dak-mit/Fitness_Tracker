const Workout = require('../models/workout');

const createWorkout =   async (req, res) => {
    try {
        const { workoutName, startTime, date, activity, duration, calories } = req.body;

        const WorkoutData = new Workout({
            workoutName,
            startTime,
            date,
            activity,
            duration,
            calories,
            user: req.user,
        });
        await WorkoutData.save();
        res.status(201).json({ message: 'Workout added successfully' , WorkoutData});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getWorkouts = async(req,res) => {
    try {
        const workouts = await Workout.find({ user: req.user }).sort({ createdAt: -1 });
        res.json(workouts);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Delete a workout
const deleteWorkout = async(req,res) => {
    try{
        const { id } = req.params;
        const workout = await Workout.findByIdAndDelete({ _id: id, user: req.user });
        if(!workout) {
            return res.status(404).json({ message: 'Workout not found' });
        }
        res.status(200).json({ message: 'Workout deleted successfully' });
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createWorkout, getWorkouts, deleteWorkout };