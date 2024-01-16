const express = require('express');
const fileUpload = require('express-fileupload');
const verifyBadge = require('./src/utils/verifyBadge');
const convertToBadge = require('./src/utils/convertToBadge');
const cors = require('cors');
const app = express();


const port = 3000;
app.use(cors({
    origin: '*' // Allow requests from any domain
}));
// Middleware for handling file uploads
app.use(fileUpload());



// Use badge routes
app.use('/api/upload', async (req, res) => {
    console.log("Received request on /api/upload");

    if (!req.files) {
        console.error("No files in the request");
        return res.status(400).send('No file uploaded');
    }

    try {
        const badge = req.files.file;
        console.log("File received:", badge.name);
        // Verify the badge
        const isVerified = await verifyBadge(badge.data);
        if (!isVerified.isVerified) {
            return res.json({ message: 'Invalid badge', reasons: isVerified.reasons });
        }

        res.json({ message: 'Badge verified and converted successfully' });
    } 
        catch (err) {
            console.error("Error in /api/upload:", err);
            res.status(500).send(err.message);
        }
    
});

// Default route
app.get('/', (req, res) => {
    res.send('Welcome on badge API');
});

// Error handling
app.use((req, res, next) => {
    res.status(404).send("Page doesn't exist !");
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something goes wrong!');
});



// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;
