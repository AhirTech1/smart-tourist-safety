const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const touristRoutes = require('./routes/touristRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const authRoutes = require('./routes/auth_routes'); // Import auth routes

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));


// API Routes
app.use('/api/tourist', touristRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/auth', authRoutes); // Use auth routes

// Root route
app.get('/', (req, res) => {
  res.send('Smart Tourist Safety Monitoring API is running!');
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
