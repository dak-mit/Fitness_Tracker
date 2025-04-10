const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },

    workoutName: {
        type: String,
        required: true
    },
    
    startTime: {
        type: String,
        required: true
    },
    
    date: {
        type: String,
        required: true  
    },
    
    activity: {
        type: String,
        required: true,
        enum: ['run', 'cycle', 'swim', 'weightlifting', 'yoga']
    },
    
    duration: {
        type: Number,
        required: true,
        min: 1      //To Ensure Duration Is Positive
    },
    
    calories: {
        type: Number,
        required: true,
        min: 1      //To Ensure Calories Is Positive
    },
});

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;
