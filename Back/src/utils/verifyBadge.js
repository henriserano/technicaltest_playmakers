const sharp = require('sharp');

async function verifyBadge(imagePath) {
    const size = 512;
    const radius = size / 2;
    const centerX = radius;
    const centerY = radius;

    const image = sharp(imagePath);
    const metadata = await image.metadata();

    const invalidationReasons = [];

    // Check image size
    if (metadata.width !== size || metadata.height !== size) {
        invalidationReasons.push("Size is not 512x512");
    }

    // Extract image data
    const data = await image.raw().toBuffer();

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const offset = (size * y + x) * 4; // 4 channels (RGBA)
            const alpha = data[offset + 3];
            if (alpha > 0) {
                const dx = centerX - x;
                const dy = centerY - y;
                if (dx * dx + dy * dy > radius * radius) {
                    invalidationReasons.push("Pixel is outside the circular region");
                }

                // Extract RGB color values
                const r = data[offset];
                const g = data[offset + 1];
                const b = data[offset + 2];

                // Define a color palette (you should adjust this to your specific colors)
                const acceptableColors = [
                    [255, 0, 0],   // Red
                    [0, 255, 0],   // Green
                    [0, 0, 255]    // Blue
                ];

                // Check if the pixel color is in the acceptable colors palette
                let colorMatch = false;
                for (const acceptableColor of acceptableColors) {
                    if (r === acceptableColor[0] && g === acceptableColor[1] && b === acceptableColor[2]) {
                        colorMatch = true;
                        break;
                    }
                }

                if (!colorMatch) {
                    invalidationReasons.push("Pixel color is not in the acceptable colors");
                }
            }
        }
    }
    
    return {
        isVerified: invalidationReasons.length === 0,
        reasons: invalidationReasons
    };
}

module.exports = verifyBadge;
