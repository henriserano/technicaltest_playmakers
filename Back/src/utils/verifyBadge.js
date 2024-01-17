const sharp = require('sharp');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

function isInHappyColorRange(r, g, b) {
    // Exemple de gamme de couleurs heureuses (à ajuster selon vos besoins)
    return (r > 200 && g > 150 && b < 100) || // Gamme de jaune/orange
           (r > 200 && g < 180 && b > 180); // Gamme de rose
}

async function saveImageLocally(imagePath, outputFilePath) {
    const image = sharp(imagePath);
    await image.toFile(outputFilePath);
}

async function getImageFormat(imagePath) {
    const image = sharp(imagePath);
    const metadata = await image.metadata();
    return metadata.format;  // 'jpeg', 'png', etc.
}

function runPythonScript(imageFilePath) {
    return new Promise((resolve, reject) => {
        // Remarquez comment les arguments sont passés ici
        const pythonProcess = spawn('python', ['src/utils/faceanalyse.py', imageFilePath]);

        let pythonData = "";
        pythonProcess.stdout.on('data', (data) => {
            pythonData += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Erreur Python: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Processus Python terminé avec le code ${code}`));
            } else {
                resolve(pythonData);
            }
        });
    });
}



async function verifyBadge(imagePath) {
    const size = 512;
    const radius = size / 2;
    const centerX = radius;
    const centerY = radius;

    const image = sharp(imagePath);
    const metadata = await image.metadata();

    const invalidationReasons = [];
    let happyColorCount = 0;
    
    console.log(imagePath);
    const typee = await getImageFormat(imagePath);
    console.log(typee); 

    const localImagePath = 'image.'+typee; // Chemin où l'image sera sauvegardée
    await saveImageLocally(imagePath, localImagePath);
    console.log(localImagePath);
    const pythonResult = await runPythonScript(localImagePath);
    console.log(`Sortie Python: ${pythonResult}`);
    const isHappyFace = JSON.parse(pythonResult);

    if (!isHappyFace) {
        invalidationReasons.push("Non happy face");
    }


    
    

    // Check image size
    if (metadata.width !== size || metadata.height !== size) {
        invalidationReasons.push("Size is not 512x512");
    }

    // Extract image data
    const data = await image.raw().toBuffer();

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const offset = (size * y + x) * 4; // 4 channels (RGBA)
            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];

            if (isInHappyColorRange(r, g, b)) {
                happyColorCount++;
            }
            const alpha = data[offset + 3];
            if (alpha > 0) {
                const dx = centerX - x;
                const dy = centerY - y;
                if (dx * dx + dy * dy > radius * radius) {
                    invalidationReasons.push("Pixel is outside the circular region");
                }

                
            }
        }
    }
    
    
    const happyColorPercentage = (happyColorCount / (size * size)) * 100;
    console.log(size * size);
    console.log("happyColorPercentage:", happyColorPercentage  );
    console.log("happyColorCount:", happyColorCount  );
    if (happyColorPercentage < 5) { // Exemple de seuil de pourcentage
        invalidationReasons.push("Insufficient happy colors percentage");
    }
    fs.unlinkSync(localImagePath);
    return {
        isVerified: invalidationReasons.length === 0,
        reasons: invalidationReasons
    };
}

module.exports = verifyBadge;
