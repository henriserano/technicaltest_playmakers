const express = require('express');
const router = express.Router();
const verifyBadge = require('../utils/verifyBadge');
const convertToBadge = require('../utils/convertToBadge');

// Route for uploading and verifying badge
router.post('/upload', async (req, res) => {
    if (!req.files) {
        return res.status(400).send('No file uploaded');
    }

    try {
        const badge = req.files.badge;

        // Verify the badge
        const isVerified = await verifyBadge(badge.data);
        if (!isVerified) {
            return res.status(400).send('Invalid badge');
        }

        // Convert to specified format (if necessary)
        const outputPath = './output/badge.png';
        await convertToBadge(badge.data, outputPath);

        res.send('Badge verified and converted successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
