const fs = require('fs');

const DATA_FILE = 'data.json';

// Load stored data (persistent storage)
function loadData() {
    try {
        const data = fs.readFileSync(DATA_FILE);
        return JSON.parse(data);
    } catch (error) {
        return []; // If file is missing or empty, return an empty array
    }
}

// Save data to JSON file
function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Load messages from file
let messages = loadData();


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Allows API to read JSON data

// GET: Retrieve the latest or a specific stored message
app.get('/latest', (req, res) => {
    if (messages.length === 0) {
        return res.json({ message: "No memory yet." });
    }

    // If a query parameter "id" is provided, return that message
    if (req.query.id) {
        const requestedMessage = messages.find(msg => msg.id == req.query.id);
        return res.json(requestedMessage || { message: "Not found." });
    }

    // Default: return the most recent message
    res.json(messages[messages.length - 1]);
});


// POST: Store a new message (Persistent storage)
app.post('/messages', (req, res) => {
    const newMessage = {
        id: messages.length + 1,
        text: req.body.text,
        timestamp: new Date().toISOString()
    };
    messages.push(newMessage); // Add new message to list
    saveData(messages); // Save messages to file
    res.json({ message: "Saved!", data: newMessage });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
