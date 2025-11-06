import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Header() {
  return (
    <Navbar
      bg=""
      variant="dark"
      expand="lg"
      sticky="top"
      className="shadow-sm navbar-glass"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-uppercase">
          TaskMaster
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" className="mx-2">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/add-todo" className="mx-2">
              Add Task
            </Nav.Link>
            <Nav.Link as={Link} to="/about" className="mx-2">
              About
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
