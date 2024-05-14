import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';

import './App.css';

import Home from './components/Home';

import BandList from './components/BandList';
import Band from './components/Band';

import AlbumList from './components/AlbumList';
import Album from './components/Album';

function App() {
  return (
    <div>
      <header>
        <Navbar expand="lg" bg="dark" data-bs-theme="dark">
          <Container fluid>
            <Navbar.Brand>Record Collection</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={NavLink} to={"/"}>Home</Nav.Link>
                <Nav.Link as={NavLink} to={"/bands"}>Bands</Nav.Link>
                <Nav.Link as={NavLink} to={"/albums"}>Albums</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>

      <main className="container mt-3">
        <Routes>
          <Route exact path="/" element={<Home />} />

          <Route path="/bands" element={<BandList />} />
          <Route path="/bands/create" element={<Band />} />
          <Route path="/bands/update/:id" element={<Band />} />

          <Route path="/albums" element={<AlbumList />} />
          <Route path="/albums/create" element={<Album />} />
          <Route path="/albums/update/:id" element={<Album />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
