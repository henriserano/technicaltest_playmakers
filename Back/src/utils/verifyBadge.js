// Import necessary modules
const sharp = require('sharp');
const { spawn } = require('child_process');
const fs = require('fs');

// Check if the RGB values fall within the happy color range
function isInHappyColorRange(r, g, b) {
    return (r > 200 && g > 150 && b < 100) || // Yellow/Orange range
           (r > 200 && g < 180 && b > 180);   // Pink range
}

// Save the image locally using the sharp library
async function saveImageLocally(imagePath, outputFilePath) {
    const image = sharp(imagePath);
    await image.toFile(outputFilePath);
}

// Retrieve the image format (e.g., 'jpeg', 'png')
async function getImageFormat(imagePath) {
    const image = sharp(imagePath);
    const metadata = await image.metadata();
    return metadata.format;
}

// Run the Python script and process its output
function runPythonScript(imageFilePath) {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', ['src/utils/faceanalyse.py', imageFilePath]);

        let pythonData = "";
        pythonProcess.stdout.on('data', (data) => {
            pythonData += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Python Error: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Python process exited with code ${code}`));
            } else {
                resolve(pythonData);
            }
        });
    });
}

// Main function to verify the badge
async function verifyBadge(imagePath) {
    const imageSize = 512;
    const image = sharp(imagePath);
    const metadata = await image.metadata();
    const invalidationReasons = [];
    let happyColorCount = 0;
    
    const imageFormat = await getImageFormat(imagePath);
    if (imageFormat !== 'png') {
        invalidationReasons.push("Image is not in PNG format");
    }

    const localImagePath = `image.${imageFormat}`;
    await saveImageLocally(imagePath, localImagePath);
    const pythonResult = await runPythonScript(localImagePath);
    console.log(`Python Output: ${pythonResult}`);
    const isHappyFace = JSON.parse(pythonResult);

    if (!isHappyFace) {
        invalidationReasons.push("Image does not contain a happy face");
    }

    // Validate image size
    if (metadata.width !== imageSize || metadata.height !== imageSize) {
        invalidationReasons.push("Image size is not 512x512 pixels");
    }

    // Process image data
    const data = await image.raw().toBuffer();
    for (let y = 0; y < imageSize; y++) {
        for (let x = 0; x < imageSize; x++) {
            const offset = (imageSize * y + x) * 4; // RGBA channels
            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];

            if (isInHappyColorRange(r, g, b)) {
                happyColorCount++;
            }
        }
    }
    
    const happyColorPercentage = (happyColorCount / (imageSize * imageSize)) * 100;
    console.log("Happy Color Percentage:", happyColorPercentage);
    if (happyColorPercentage < 5) {
        invalidationReasons.push("Insufficient happy color percentage");
    }

    // Clean up local image
    fs.unlinkSync(localImagePath);

    return {
        isVerified: invalidationReasons.length === 0,
        reasons: invalidationReasons
    };
}

module.exports = verifyBadge;
