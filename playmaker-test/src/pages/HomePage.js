import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import './HomePage.css'; // Ensure this CSS file is created and imported here

function HomePage() {
  return (
    // Container component from React Bootstrap for responsive layout
    <Container className="home-page">
      {/* Row for organizing content in a grid format */}
      <Row className="justify-content-md-center text-center">
        {/* Column with large (lg) size set to 8, centers the content in the middle */}
        <Col lg={8}>
          {/* Header welcoming users to the technical test of Henri Serano */}
          <h1 className="mt-5">Welcome to Henri Serano's Technical Test!</h1>
          {/* Paragraph explaining the main feature of the app */}
          <p className="lead mt-3">You can find the main feature which is to push an image.</p>
          {/* Horizontal rule for visual separation */}
          <hr className="my-4" />
          {/* Additional information about the technology stack used */}
          <p>The front end was made with React and the back end with Node, as per Playwright's technical stack</p>
          
          {/* Button for image upload, redirects to '/upload' on click */}
          <button className="btn btn-primary btn-lg" onClick={() => window.location.href = '/upload'}>Upload an image</button> 
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;
