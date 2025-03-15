const express = require('express');
const fs = require('fs');
const { MongoClient } = require('mongodb');

// Connection URI
const uri = "mongodb+srv://pearsoncd:VoOdhfvlGRVd3JzV@cluster0.mongodb.net/ai_memory?retryWrites=true&w=majority";

const app = express();
const port = process.env.PORT || 7676;

app.use(express.json());

// Function to connect to MongoDB
async function connectToDatabase() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    return client;
}

//  GET route for retrieving the latest message
app.get('/latest', async (req, res) => {
    try {
        const client = await connectToDatabase();
        const db = client.db('ai_memory');
        const collection = db.collection('messages');

        const latestMessage = await collection.find().sort({ timestamp: -1 }).limit(1).toArray();
        client.close(); //  Close the connection after the request

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
app.post('/messages', async (req, res) => {
    try {
        const client = await connectToDatabase();
        const db = client.db('ai_memory');
        const collection = db.collection('messages');

        const newMessage = {
            text: req.body.text,
            timestamp: new Date().toISOString(),
        };

        await collection.insertOne(newMessage);
        client.close(); //  Close the connection after the request

        res.json({ message: "Message saved successfully!", data: newMessage });
    } catch (err) {
        console.error('Error saving message:', err);
        res.status(500).json({ message: "Error saving message." });
    }
});

// Start the server (only in local development)
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}
