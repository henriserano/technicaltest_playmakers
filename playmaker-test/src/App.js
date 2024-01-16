import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Navbar, Nav } from 'react-bootstrap'; // Importez NavbarText
import HomePage from './pages/HomePage.js';
import ImageUpload from './pages/ImageUpload.js';

import './App.css';


function App() {
  return (

      <Router>
        <div>
          <Navbar bg="dark" variant="dark">
            <Container>
              <Navbar.Brand href="/">Description</Navbar.Brand>
              <Nav className="me-auto">
                <Nav.Link href="/upload">Upload image</Nav.Link>
  
              </Nav>

            </Container>
          </Navbar>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/upload" element={<ImageUpload />} />
          </Routes>
        </div>
      </Router>

  );
}

export default App;