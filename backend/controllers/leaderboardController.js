const User = require("../models/User.js")
const Workout = require("../models/workout.js")

const GetLeaderboard = async(req,res) => {
    try{
        const users = await User.find();

        const Leaderboard = await Promise.all(
            users.map(async(user) => {
                const workouts = await Workout.find({user:user._id});
                const totalCaloriesBurned = workouts.reduce((sum, w) => sum + (w.calories || 0), 0);
                
                return{
                    userId: user._id,
                    name : `${user.firstName} ${user.lastName}`,
                    totalCaloriesBurned,
                }
            })
        )

        //Sort LeaderBoard By Highest Calories Burned On Top
        Leaderboard.sort((a,b) => b.totalCaloriesBurned - a.totalCaloriesBurned);
        res.status(200).json(Leaderboard);
    }
    catch(error){
        console.log("LeaderBoard Error",error);
        res.status(500).json({message:"Failed To Fetch LeaderBoard"});
    }
};

module.exports = {GetLeaderboard};