const express = require('express');
let messages = [];


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Allows API to read JSON data

// Load stored data (temporary memory)
function loadData() {
    return messages; // Returns the in-memory array
}

// Save data (temporary memory)
function saveData(data) {
    messages = data; // Updates the in-memory array
}

// GET: Retrieve the latest stored message (for AI recall)
app.get('/latest', (req, res) => {
    const messages = loadData();
    const latestMessage = messages.length > 0 ? messages[messages.length - 1] : { message: "No memory yet." };
    res.json(latestMessage);
});

// POST: AI sends data to be stored
app.post('/store', (req, res) => {
    const messages = loadData();
    const newMemory = {
        id: messages.length + 1,
        text: req.body.text,
        timestamp: new Date().toISOString()
    };
    messages.push(newMemory);
    saveData(messages);
    res.json({ message: "Memory stored!", data: newMemory });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
