const mongoose = require('mongoose');

const nutriSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    mealName: {
        type: String,
        required: true
    },
    
    date: {
        type: String,
        required: true
    },
    nutrition: {
        type: String,
        required: true,
        enum: ['Breakfast', 'Lunch', 'Dinner', 'Evening', 'Other']
    },
    
    calories: {
        type: Number,
        required: true,
        min: 1      //To Ensure Calories Is Positive
    },
});

const Nutrition = mongoose.model('Nutrition', nutriSchema);

module.exports = Nutrition;