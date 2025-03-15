const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
    throw new Error('Please add your Mongo URI to .env');
}

if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export default async function handler(req, res) {
    try {
        const client = await clientPromise;
        const db = client.db('ai_memory');
        const collection = db.collection('messages');

        if (req.method === 'POST') {
            const newMessage = {
                text: req.body.text,
                timestamp: new Date().toISOString(),
            };
            await collection.insertOne(newMessage);
            res.status(201).json({ message: 'Message saved!', data: newMessage });
        } else if (req.method === 'GET') {
            const messages = await collection.find().toArray();
            res.status(200).json({ messages });
        } else {
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}
 
