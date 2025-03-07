const express = require('express');
let messages = [];

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Allows API to read JSON data

// GET: Retrieve the latest stored message
app.get('/latest', (req, res) => {
    if (messages.length === 0) {
        return res.json({ message: "No memory yet." });
    }
    res.json(messages[messages.length - 1]); // Returns the last stored message
});

// POST: Save a new message
app.post('/messages', (req, res) => {
    const newMessage = {
        id: messages.length + 1,
        text: req.body.text,
        timestamp: new Date().toISOString()
    };
    messages.push(newMessage); // Add new message to in-memory storage
    res.json({ message: "Saved!", data: newMessage });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
