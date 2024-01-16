const sharp = require('sharp');

async function convertToBadge(inputPath, outputPath) {
    const size = 512;
    const mask = Buffer.from(
        `<svg><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}"/></svg>`
    );

    try {
        // Resize the input image to 512x512 pixels
        await sharp(inputPath)
            .resize(size, size)
            // Apply the circular mask
            .composite([{ input: mask, blend: 'dest-in' }])
            // Save the output in PNG format
            .toFile(outputPath);

        return outputPath;
    } catch (error) {
        console.error('Error in convertToBadge:', error);
        throw error;
    }
}

module.exports = convertToBadge;
