const express = require('express');
const connectToMongo = require('./db');
connectToMongo()
const cors = require('cors');
const { createServer } = require('node:http');
const socketManager = require('./socketManager')


const app = express();

// Connect to MongoDB

// Middleware
app.use(cors());
app.use(express.json());

const server = createServer(app);
socketManager.io.attach(server);
// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/connection', require('./routes/connection'))

// Root route
app.get('/', (req, res) => {
    res.send("Hello");
});

// Start the server
server.listen(8000, () => {
    console.log("Server is live on port 8000");
});
