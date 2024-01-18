// Import required modules
const express = require('express');
const fileUpload = require('express-fileupload');
const verifyBadge = require('./src/utils/verifyBadge');
const cors = require('cors');

const app = express();
const port = 3000;

// Enable all CORS requests
app.use(cors({ origin: '*' }));

// Middleware for handling file uploads
app.use(fileUpload());

// Route for uploading and verifying badges
app.post('/api/upload', async (req, res) => {
    if (!req.files || !req.files.file) {
        console.error("No file found in the request");
        return res.status(400).send('No file uploaded');
    }

    try {
        const badge = req.files.file;
        const verificationResult = await verifyBadge(badge.data);

        if (!verificationResult.isVerified) {
            return res.status(400).json({ 
                message: 'Invalid badge', 
                reasons: verificationResult.reasons 
            });
        }

        res.json({ message: 'Badge verified successfully' });
    } catch (err) {
        console.error("Error in /api/upload:", err);
        res.status(500).send('Server error occurred');
    }
});

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to the Badge Verification API');
});

// 404 Error handling
app.use((req, res) => {
    res.status(404).send("Page not found");
});

// General error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal server error');
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;
