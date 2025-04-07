
const express = require('express'); 
const mongoose = require('mongoose'); 
const cors = require('cors');
const dotenv = require('dotenv'); 
const workoutRoutes = require('./routes/workouts');
const goalsRoutes = require('./routes/Goals');
const nutritionRoutes = require('./routes/nutrition');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());


const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT ;

// Connect to MongoDB using Mongoose
mongoose.connect(MONGODB_URI)
  .then(() => {
    // If connection is successful, log a message
    console.log('Connected to MongoDB Atlas successfully!');
  })
  .catch((error) => {
    // If there’s an error, log the error message
    console.log('Error connecting to MongoDB:', error.message);
  });


app.use('/api/workouts', workoutRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/nutrition', nutritionRoutes);

app.get('/api/samplecall', (req, res) => {
    // Send a JSON response with a message
    res.json({ message: 'Hello World from the backend!' });
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});