const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    name : {type : String, required : true},
    typeOfGoal: {type: String, required: true, enum:['numWorkouts', 'duration', 'calories']},
    targetOfGoal: { type: Number, required: true},
    goalStart: {type: String, required: true},   //This Week / Next Week
    progress: {type: Number, default: 0},
    completed: {type: Boolean, default: false},
    createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Goal', goalSchema);