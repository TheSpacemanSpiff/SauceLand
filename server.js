const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname)));

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/saucesDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

// Define a schema and model
const sauceSchema = new mongoose.Schema({
    sauce: { type: String, required: true },
    country: { type: String, required: false },
});

const Sauce = mongoose.model('Sauce', sauceSchema);

// API endpoint to save the sauce
app.post('/api/sauces', async (req, res) => {
    const { sauce } = req.body;
    if (!sauce) {
        return res.status(400).json({ error: 'Sauce is required' });
    }

    try {
        const newSauce = new Sauce({ sauce });
        await newSauce.save();
        res.status(201).json({ message: 'Sauce saved successfully' });
    } catch (error) {
        console.error('Error saving to database:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API endpoint to retrieve all answers
app.get('/api/sauces', async (req, res) => {
    try {
        const sauces = await Sauce.find();
        res.json(sauces);
    } catch (error) {
        console.error('Error retrieving from database:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add a new API endpoint to fetch sauces with counts
app.get('/api/sauces-with-counts', async (req, res) => {
    try {
        const sauces = await Sauce.aggregate([
            { $group: { _id: "$sauce", count: { $sum: 1 } } },
            { $sort: { count: -1 } } // Sort by count in descending order
        ]);
        res.json(sauces);
    } catch (error) {
        console.error('Error retrieving sauces with counts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});