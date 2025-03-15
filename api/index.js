const express = require('express');
const fs = require('fs');
const { MongoClient } = require('mongodb');

// Pull from Environment Variables
const uri = process.env.MONGODB_URI;

// MongoDB Client
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
const port = process.env.PORT || 3000;  // Default to 3000

app.use(express.json());

// Connect to MongoDB and then start server
client.connect()
    .then(() => {
        console.log("MongoDB connected!");
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB", err);
    });

app.get('/latest', async (req, res) => {
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

app.post('/messages', async (req, res) => {
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
