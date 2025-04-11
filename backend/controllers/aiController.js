const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv'); 

dotenv.config();

const getAIRecommendations = async(req,res) => {
    const {user, workouts, nutrition} = req.body;

    if(!user){
        return res.status(400).json({ error: 'User data Required' });
    }
    try{

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        
        const prompt = `
    You are an enthusiastic fitness and nutrition coach who specializes in personalized motivation. Based on this user's profile:

User:
- Name: ${user.firstName} ${user.lastName}
- Age: ${user.age}
- Height: ${user.height} cm
- Weight: ${user.weight} kg

Workout Summary:
- Total Workouts: ${workouts.length}
- Total Calories Burned: ${workouts.reduce((sum, w) => sum + (w.calories || 0), 0)}

Nutrition Summary:
- Meals Logged: ${nutrition.length}
- Calories Consumed: ${nutrition.reduce((sum, m) => sum + (m.calories || 0), 0)}

Goals:
- Goal: ${user.goal || "general fitness improvement"}

Provide the following:
1. A short, energetic greeting that acknowledges their recent efforts
2. ONE specific workout suggestion that aligns with their goal
3. ONE specific nutrition tip they can implement immediately
4. A brief motivational closing that connects to their personal goal

Keep your message under 200 words. Use a supportive, positive tone that creates excitement about their next steps, not guilt about past choices.
    `;

        const result = await model.generateContent(prompt);
        const aiResponse = result.response.text();

        res.status(200).json({message: aiResponse });
    }catch(err){
        console.error("Gemini Error", err);
        res.status(500).json({ error: "Failed to generate recommendations" });
    }
};

module.exports = { getAIRecommendations };