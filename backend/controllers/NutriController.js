const Nutrition = require('../models/nutrition');

const createNutrition = async (req, res) => {
    try {
        const { mealName, date, nutrition, calories } = req.body;
        const NutritionData = new Nutrition({
            mealName,
            date,
            nutrition,
            calories
        });
        await NutritionData.save();
        res.status(201).json({ message: 'Nutrition added successfully' , NutritionData});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getNutritions = async(req,res) => {
    try {
        const nutritions = await Nutrition.find();
        res.json(nutritions);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteNutrition = async(req,res) => {
    try{
        const { id } = req.params;
        const nutrition = await Nutrition.findByIdAndDelete(id);
        if(!nutrition) {
            return res.status(404).json({ message: 'Nutrition not found' });
        }
        res.status(200).json({ message: 'Nutrition deleted successfully' });
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createNutrition, getNutritions, deleteNutrition };
