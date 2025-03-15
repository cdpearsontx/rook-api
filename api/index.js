const express = require('express');
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

// MongoDB Client
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(express.json());

// Connect to MongoDB once at startup
client.connect()
    .then(() => {
        console.log("MongoDB connected!");
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB", err);
    });

// GET route for retrieving the latest message
app.get('/api/latest', async (req, res) => {
    try {
        const db = client.db('ai_memory');
        const collection = db.collection('messages');

        const latestMessage = await collection.find().sort({ timestamp: -1 }).limit(1).toArray();
        if (latestMessage.length === 0) {
            return res.json({ message: "No memory yet." });
        }
        res.json(latestMessage[0]);
    } catch (err) {
        console.error('Error fetching message:', err);
        res.status(500).json({ message: "Error fetching message." });
    }
});

// POST route for storing a message
app.post('/api/messages', async (req, res) => {
    try {
        const db = client.db('ai_memory');
        const collection = db.collection('messages');

        const newMessage = {
            text: req.body.text,
            timestamp: new Date().toISOString(),
        };

        await collection.insertOne(newMessage);

        res.json({ message: "Message saved successfully!", data: newMessage });
    } catch (err) {
        console.error('Error saving message:', err);
        res.status(500).json({ message: "Error saving message." });
    }
});

// Export the app for Vercel
module.exports = app;
