import React, { useState, useEffect } from 'react';
import { Form, Button, Col, Row, Card, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { FaPaperPlane, FaTimesCircle } from 'react-icons/fa';

export default function AjouterStructure() {
  const navigate = useNavigate();
  const { registerStructure } = useAuth();

  const [formData, setFormData] = useState({
    description: '',
    nom: '',
    id_utilisateur: '',
    definition: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Récupération de l'utilisateur connecté
  useEffect(() => {
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    if (user && user.id_utilisateur) {
      setFormData(prev => ({
        ...prev,
        id_utilisateur: user.id_utilisateur,
      }));
    }
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccessMessage('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (!formData.id_utilisateur) {
        throw new Error("Utilisateur non identifié !");
      }

      let payload = {
        id_utilisateur: formData.id_utilisateur,
        nom: formData.nom,
        description: formData.description,
        definition: formData.definition,
      };

      const response = await registerStructure(payload);
      console.log("Structure enregistré avec succès :", response);

      setSuccessMessage("✅ Structure enregistré avec succès !");
      setTimeout(() => navigate('/liste-structure'), 2500);
    } catch (err) {
      console.error(err);
      setError("❌ Erreur lors de l'enregistrement du Structure.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid py-3">
      <Card className="shadow-lg border-0 rounded-3 mx-auto" style={{ maxWidth: '900px' }}>
        <Card.Header as="h4" className="bg-success text-white fw-bold text-center py-2">
          Enregistrer un Structure
        </Card.Header>
        <Card.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            {/* Première ligne */}
              <Form.Group className='mx-3 mb-3' controlId="nom">
                <Form.Label>Nom </Form.Label>
                <Form.Control
                  name="nom"
                  placeholder="Ex: DAF, DRH, DSI"
                  type="text"
                  value={formData.nom}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </Form.Group>
              <Form.Group className='mx-3 mb-3' controlId="definition">
                <Form.Label>Definition</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ex: Direction des Affaires Financières"
                  name="definition"
                  value={formData.definition}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </Form.Group>

            <Form.Group className="mx-3 mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={isLoading}
                as="textarea"
                rows={3}
                placeholder="Brève description de la structure"
                type='textarea'
                required
              />
            </Form.Group>

            {/* Messages */}
            {error && <Alert variant="danger">{error}</Alert>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}

            {/* Boutons */}
            <div className="d-flex justify-content-end gap-3 mt-4">
              <Button variant="secondary" onClick={() => navigate('/liste-structure')} disabled={isLoading}>
                <FaTimesCircle className="me-2" />
                Annuler
              </Button>
              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" /> Chargement...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="me-2" /> Enregistrer
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

