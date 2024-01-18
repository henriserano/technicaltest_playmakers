// Importing necessary React components and hooks
import React, { useState, useEffect } from 'react';
// Importing React Bootstrap components for styling and structure
import { Form, Button } from 'react-bootstrap';
// Importing an icon from react-icons for a visually appealing upload button
import { FaUpload } from 'react-icons/fa';
// Importing the CSS file for custom styles
import './ImageUpload.css';

// CourseUploadPage component definition
const CourseUploadPage = () => {
    // useState hook to manage the state of the file to be uploaded
    const [file, setFile] = useState(null);
    // useState hook to manage the state of an error image, if any
    const [errorImage, setErrorImage] = useState(null);

    // Function to handle file selection, updating the file state
    const handleFileChange = (e) => {
        // Setting the first file from the file input
        setFile(e.target.files[0]);
    };

    // Async function to handle the form submission
    const handleSubmit = async (e) => {
        // Preventing the default form submit action
        e.preventDefault();
        // Alert if no file is selected
        if (!file) {
            alert("Please select a file");
            return;
        }

        // Creating FormData object for sending file data
        const formData = new FormData();
        formData.append('file', file);

        try {
            // Making a POST request to the server with the file data
            const response = await fetch('http://localhost:3000/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();

            // Handling the response from the server
            if (data.message === 'Badge verified successfully') {
                alert('Image uploaded successfully!');
            } else {
                // Alert with reasons if image is rejected
                alert('The image was rejected for the following reasons: ' + [...new Set(data.reasons)].join(', '));
                // Setting the error image to display it later
                setErrorImage(file);
            }
        } catch (error) {
            // Logging and alerting if there's an error during the fetch request
            console.error('Error:', error);
            alert('An error occurred while uploading the image.');
        }
    };

    // useEffect hook to execute code when the errorImage state changes
    useEffect(() => {
        // Only proceed if there is an errorImage
        if (errorImage) {
            // Get the canvas element and its context
            const canvas = document.getElementById('errorCanvas');
            const ctx = canvas.getContext('2d');

            // Create a new image object and set its source
            const img = new Image();
            img.src = URL.createObjectURL(errorImage);

            // Draw the image onto the canvas once it's loaded
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
            };
        }
    }, [errorImage]);

    // Rendering the component
    return (
        <div className="course-upload-container">
            {/* Displaying the canvas if there's an error image */}
            {errorImage && (
                <div className="error-image-container">
                    <canvas id="errorCanvas" className="error-canvas"></canvas>
                </div>
            )}
            {/* Title for the upload form */}
            <h1 className="course-upload-title">Upload an Image</h1>
            {/* Form for uploading images */}
            <Form onSubmit={handleSubmit} className="course-upload-form">
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label className="course-upload-label">Select Image File (PNG)</Form.Label>
                    <Form.Control
                        type="file"
                        onChange={handleFileChange}
                        accept=".png"
                        className="course-upload-input"
                    />
                </Form.Group>
                {/* Submit button for the form */}
                <Button variant="success" type="submit" className="course-upload-button">
                    <FaUpload className="fa-upload-icon" /> Upload
                </Button>
            </Form>
        </div>
    );
};

// Exporting CourseUploadPage component
export default CourseUploadPage;
