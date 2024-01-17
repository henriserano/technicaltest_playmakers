import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { FaUpload } from 'react-icons/fa';
import './ImageUpload.css';

const CourseUploadPage = () => {
    const [file, setFile] = useState(null);
    const [errorImage, setErrorImage] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const drawErrorPixel = (ctx, x, y, reason) => {
        // Customize the rendering of error pixels based on the reason
        switch (reason) {
            case 'Size':
                ctx.fillStyle = 'red'; // Red for size error
                break;
            case 'Radius':
                ctx.fillStyle = 'blue'; // Blue for radius error
                break;
            case 'ColorMatch':
                ctx.fillStyle = 'yellow'; // Yellow for color match error
                break;
            default:
                ctx.fillStyle = 'red'; // Default to red
                break;
        }

        ctx.fillRect(x, y, 20, 20); // Highlight a pixel at (x, y) for demonstration
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            alert("Veuillez sélectionner un fichier");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:3000/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                console.log(data.message);
                if (data.message === 'Badge verified and converted successfully') {
                    alert('Image téléchargée avec succès!');
                } else {
                    alert('L\'image a été refusée pour les raisons suivantes: ' + [...new Set(data.reasons)].join(', '));
                    setErrorImage(file);
                }
            } else {
                alert('Erreur lors du téléchargement de l\'image');
            }
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    useEffect(() => {
        if (errorImage) {
            // Draw the error image on a canvas with color-coded errors
            const canvas = document.getElementById('errorCanvas');
            const ctx = canvas.getContext('2d');

            const img = new Image();
            img.src = URL.createObjectURL(errorImage);

            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;

                ctx.drawImage(img, 0, 0);

                const reasons = ['Size', 'Radius', 'ColorMatch']; // Replace with your actual reasons
                for (const reason of reasons) {
                    // Simulate highlighting specific pixels, you should modify this based on your actual logic
                    // For example, you could iterate through a list of problematic pixel coordinates and highlight them.
                    drawErrorPixel(ctx, 10, 10, reason); // Highlight a pixel at (10, 10) with the specific reason
                }
            };
        }
    }, [errorImage]);

    return (
        <div className="course-upload-container">
            {errorImage && (
                <div className="error-image-container">
                    <h3 className="error-image-title">Image Invalide</h3>
                    <canvas id="errorCanvas" className="error-canvas"></canvas>
                </div>
            )}
            <h1 className="course-upload-title">Télécharger une image</h1>
            <Form onSubmit={handleSubmit} className="course-upload-form">
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label className="course-upload-label">Sélectionnez le fichier de l'image (PNG)</Form.Label>
                    <Form.Control
                        type="file"
                        onChange={handleFileChange}
                        accept=".png"
                        className="course-upload-input"
                    />
                </Form.Group>
                <Button variant="success" type="submit" className="course-upload-button">
                    <FaUpload className="fa-upload" /> Télécharger
                </Button>
            </Form>
            
        </div>
    );
};

export default CourseUploadPage;
