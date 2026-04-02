const express = require('express');
const mqtt = require('mqtt');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = socketIO(server);

// MQTT Broker Configuration
const mqttConfig = {
    host: '392a06ac94f4469b99b40c9070fbf37d.s1.eu.hivemq.cloud',
    port: 8883,
    protocol: 'mqtts',
    username: 'rahul.in',
    password: 'Rahul123'
};

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// MQTT Client
const mqttClient = mqtt.connect(mqttConfig);

mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
    mqttClient.subscribe('test/topic');
});

mqttClient.on('error', (err) => {
    console.error('MQTT Error:', err);
});

mqttClient.on('message', (topic, message) => {
    console.log(`Message received on ${topic}: ${message.toString()}`);
    try {
        // Parse the message and extract temperature and humidity
        const msg = message.toString();
        const matches = msg.match(/Temp: ([\d.]+) °C, Hum: ([\d.]+) %/);
        if (matches) {
            const data = {
                temperature: parseFloat(matches[1]),
                humidity: parseFloat(matches[2]),
                timestamp: new Date().toISOString()
            };
            // Emit to all connected clients
            io.emit('sensorData', data);
        }
    } catch (error) {
        console.error('Error parsing message:', error);
    }
});

// Socket.IO Connection
io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Routes
app.get('/status', (req, res) => {
    res.json({
        mqtt: mqttClient.connected ? 'Connected' : 'Disconnected',
        server: 'Online'
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
