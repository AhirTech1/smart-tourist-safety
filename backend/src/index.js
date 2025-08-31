const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for simplicity, restrict in production
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json

// --- In-memory data store (replace with a real database) ---
const activeAlerts = new Map();
// -----------------------------------------------------------

// API Routes
app.get('/', (req, res) => {
    res.send('Smart Tourist Safety Backend is running!');
});

// Endpoint for the mobile app to send a panic signal
app.post('/api/panic', (req, res) => {
    const { touristId, name, location } = req.body;

    if (!touristId || !name || !location) {
        return res.status(400).json({ message: 'Missing required panic data.' });
    }

    const alert = {
        id: Date.now(),
        touristId,
        touristName: name,
        location,
        time: new Date().toISOString(),
        status: 'Active'
    };
    
    activeAlerts.set(alert.id, alert);
    console.log('New Panic Alert Received:', alert);

    // Broadcast the new alert to all connected dashboard clients
    io.emit('new-alert', alert);

    res.status(200).json({ message: 'Alert received. Help is on the way.', alertId: alert.id });
});

// Endpoint for the dashboard to get current alerts
app.get('/api/alerts', (req, res) => {
    res.json(Array.from(activeAlerts.values()));
});

// Endpoint for the dashboard to resolve an alert
app.post('/api/resolve/:alertId', (req, res) => {
    const alertId = parseInt(req.params.alertId, 10);
    if (activeAlerts.has(alertId)) {
        activeAlerts.delete(alertId);
        console.log(`Alert ${alertId} resolved.`);
        
        // Broadcast the resolved alert ID to all clients
        io.emit('resolve-alert', alertId);

        res.status(200).json({ message: 'Alert resolved successfully.' });
    } else {
        res.status(404).json({ message: 'Alert not found.' });
    }
});


// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A dashboard client connected:', socket.id);
    
    // Send the current list of alerts to the newly connected client
    socket.emit('initial-alerts', Array.from(activeAlerts.values()));

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));