import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import './HomePage.css'; // Assurez-vous de créer ce fichier CSS et de l'importer ici

function HomePage() {
  return (
    <Container className="home-page">
      <Row className="justify-content-md-center text-center">
        <Col lg={8}>
          <h1 className="mt-5">Bienvenue sur le test technique de Henri Serano !</h1>
          <p className="lead mt-3">Vous pouvez retrouver la feature principale qui consiste à pouvoir push une image.</p>
          <hr className="my-4" />
          <p>La partie front a été faites avec React et la partie Back avec Node comme la stack technique de Playwright</p>

          <button className="btn btn-primary btn-lg" onClick={() => window.location.href = '/upload'}>Uploader une image</button> 
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;