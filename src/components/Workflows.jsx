
// src/components/Workflow.jsx
import React, { useState } from "react";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Modal,
  ButtonGroup,
} from "react-bootstrap";
import { useNavigate } from "react-router";
import { Mail, Users, Workflow } from "lucide-react"; // Icônes modernes

export default function Workflows() {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [targetRoute, setTargetRoute] = useState("");

  const handleNavigate = (route) => {
    setTargetRoute(route);
    setShowConfirm(true);
  };

  const confirmNavigate = () => {
    navigate(targetRoute);
    setShowConfirm(false);
  };

  return (
    <Container className="my-4">
      <h2 className="text-center fw-bold mb-4">Gestion des Workflows</h2>

      <Row xs={1} md={2} lg={3} className="g-4">
        {/* Courrier */}
        <Col>
          <Card className="shadow-sm border-0 rounded-4 h-100">
            <Card.Header className="bg-primary text-white fw-bold d-flex align-items-center">
              <Mail size={20} className="me-2" /> Courrier
            </Card.Header>
            <Card.Body>
              <Card.Title>Workflow des Courriers</Card.Title>
              <ButtonGroup className="d-flex flex-wrap gap-2">
                <Button
                  variant="outline-primary"
                  onClick={() => handleNavigate("/courrier-entrant")}
                >
                  Entrant
                </Button>
                <Button
                  variant="outline-success"
                  onClick={() => handleNavigate("/courrier-sortant")}
                >
                  Sortant
                </Button>
                <Button
                  variant="outline-warning"
                  onClick={() => handleNavigate("/courrier-autres")}
                >
                  Interne
                </Button>
              </ButtonGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* Utilisateurs */}
        <Col>
          <Card className="shadow-sm border-0 rounded-4 h-100">
            <Card.Header className="bg-success text-white fw-bold d-flex align-items-center">
              <Users size={20} className="me-2" /> Utilisateurs
            </Card.Header>
            <Card.Body>
              <Card.Title>Workflow des Utilisateurs</Card.Title>
              <ButtonGroup className="d-flex flex-wrap gap-2">
                <Button variant="outline-success">Création</Button>
                <Button variant="outline-danger">Suppression</Button>
              </ButtonGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* Autre module */}
        <Col>
          <Card className="shadow-sm border-0 rounded-4 h-100">
            <Card.Header className="bg-warning text-dark fw-bold d-flex align-items-center">
              <Workflow size={20} className="me-2" /> Processus
            </Card.Header>
            <Card.Body>
              <Card.Title>Workflow des Processus</Card.Title>
              <ButtonGroup className="d-flex flex-wrap gap-2">
                <Button variant="outline-warning">Étape 1</Button>
                <Button variant="outline-secondary">Étape 2</Button>
              </ButtonGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de confirmation */}
      <Modal
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir consulter ce workflow ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={confirmNavigate}>
            Oui, continuer
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

