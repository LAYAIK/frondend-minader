import React, { useState, useEffect } from 'react';
import { Form, Button, Col, Row, Card, Alert, Spinner, Container, Modal } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { useDataTypeCourrier } from '../../data/serviceCourrierData';
import { useDataObjet, useDataPriorite, useDataStatus } from '../../data/serviceAutreData';
import { useNavigate } from 'react-router';
import { FaPaperPlane, FaTimesCircle } from 'react-icons/fa';
import {createObjet} from '../../actions/Autres'

export default function RegisterCourrier() {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [targetRoute, setTargetRoute] = useState("");
  const { registerCourrier } = useAuth();
  const { DataTypeCourrier } = useDataTypeCourrier();
  const { DataObjet } = useDataObjet();
  const { DataPriorite } = useDataPriorite();
  const { DataStatus } = useDataStatus();

  const [formData, setFormData] = useState({
    reference_courrier: '',
    id_courrier: '',
    id_utilisateur: '',
    id_objet: '',
    objet: '',
    id_type_courrier: '',
    contenu: '',
    id_priorite: '',
    id_status: '',
    id_structure: '',
    note: '',
  });

  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reference, setReference] = useState('');

  // Récupération de l'utilisateur connecté
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  useEffect(() => {
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    if (user && user.id_utilisateur) {
      setFormData(prev => ({
        ...prev,
        id_utilisateur: user.id_utilisateur,
        id_structure: user.id_structure,
      }));
    }
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccessMessage('');
  };

  const handleFileChange = e => {
    setFiles(e.target.files);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    setIsLoading(true);
    if (!formData.id_utilisateur) {
      throw new Error("Utilisateur non identifié !");
    }

    let idObjetFinal = formData.id_objet;

    // 🆕 Étape 1 : Création de l'objet si c’est un nouvel objet
    if (formData.id_objet === "new" && formData.objet.trim() !== "" ) {

    const newObjetResponse = await createObjet({ libelle: formData.objet });

      if (!newObjetResponse) {
        throw new Error("Erreur lors de la création du nouvel objet");
      }

      idObjetFinal = newObjetResponse.objet.id_objet; // récupère l’UUID généré
    }

    // 📨 Étape 2 : Préparation du payload du courrier
    let payload = {
      id_structure: formData.id_structure,
      note: formData.note,
      id_status: formData.id_status,
      id_utilisateur: user.id_utilisateur,
      id_type_courrier: formData.id_type_courrier || '4cd78808-7d9b-4853-ac54-caefbf8da671',
      reference_courrier: formData.reference_courrier,
      id_objet: idObjetFinal, // <-- utilise le bon ID
      id_priorite: formData.id_priorite,
      contenu: formData.contenu,
    };

    const formDataWithFiles = new FormData();
    Object.keys(payload).forEach(key => formDataWithFiles.append(key, payload[key]));

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        formDataWithFiles.append('fichiers', files[i]);
      }
    }

    // 📬 Étape 3 : Enregistrement du courrier
    const response = await registerCourrier(formDataWithFiles);
    console.log("Réponse API courrier :", response);
    const ref = response.courrier.reference_courrier
    setReference(ref);
    handleNavigate("/liste-courrier");
  } catch (err) {
    console.error(err);
    setError("❌ Erreur lors de l'enregistrement du courrier.");
  } finally {
    setIsLoading(false);
  }
};

  const handleNavigate = (route) => {
    setTargetRoute(route);
    setShowConfirm(true);
  };

  const confirmNavigate = () => {
    navigate(targetRoute);
    setShowConfirm(false);
  };


  return (
    <Container> 

    <div className="container-fluid py-3 ">
      <Card className="shadow-lg border-0 rounded-3 mx-auto" style={{ maxWidth: '900px' }}>
        <Card.Header as="h4" className="bg-success text-white fw-bold text-center py-2">
          Enregistrer un Courrier
        </Card.Header>
        <Card.Body className="p-4 mx-3">
          <Form onSubmit={handleSubmit}>
            
            {/* Messages */}
            {error && <Alert variant="danger">{error}</Alert>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            
            {/* Première ligne */}
            <Row className="mb-3">
              <Form.Group as={Col} controlId="typeCourrier">
                <Form.Label style={{ fontWeight: 'bold' }}>Type du Courrier</Form.Label>
                <Form.Select
                name="id_type_courrier"
                value={formData.id_type_courrier}
                onChange={handleChange}
                disabled={isLoading}
                required
              >
                <option value="">Sélectionner...</option>
                {DataTypeCourrier.length > 0 ? (
                  DataTypeCourrier.map(item => (
                    <option key={item.id_type_courrier} value={item.id_type_courrier}>
                      {item.type}
                    </option>
                  ))
                ) : (
                  <option disabled>Aucune donnée disponible</option>
                )}
              </Form.Select>
              </Form.Group>

              <Form.Group as={Col} controlId="reference">
                <Form.Label style={{ fontWeight: 'bold' }}>Référence Courrier</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Entrer la reference, si existante ou a laissser vide"
                  name="reference_courrier"
                  value={formData.reference_courrier}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </Form.Group>
            </Row>

            {/* Objet */}
            <Form.Group className="mb-3" controlId="objet">
  <Form.Label style={{ fontWeight: "bold" }}>Objet</Form.Label>
  <Form.Select
    name="id_objet"
    value={formData.id_objet}
    onChange={handleChange}
    disabled={isLoading}
    required
  >
    <option value="">Sélectionner...</option>
    {DataObjet.length > 0 ? (
      DataObjet.map(item => (
        <option key={item.id_objet} value={item.id_objet}>
          {item.libelle}
        </option>
      ))
    ) : (
      <option disabled>Aucune donnée disponible</option>
    )}
    <option value="new">➕ Ajouter un nouvel objet</option>
  </Form.Select>

  {/* Champ dynamique pour saisir un nouvel objet */}
  {formData.id_objet === "new" && (
    <Form.Control
      type="text"
      placeholder="Saisir le nouvel objet..."
      name="objet"
      value={formData.objet}
      onChange={handleChange}
      className="mt-2"
      required
      />
  )}
</Form.Group>

            {/* Deuxième ligne */}
            <Row className="mb-3">
              <Form.Group as={Col} controlId="status">
                <Form.Label style={{ fontWeight: 'bold' }}>Statut Courrier</Form.Label>
                <Form.Select
                  name="id_status"
                  value={formData.id_status}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                >
                  <option value="">Sélectionner...</option>
                  {DataStatus.length > 0 ? (
                    DataStatus.map(item => (
                      <option key={item.id_status} value={item.id_status}>
                        {item.libelle}
                      </option>
                    ))
                  ) : (
                    <option disabled>Aucune donnée disponible</option>
                  )}
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col} controlId="priorite">
                <Form.Label style={{ fontWeight: 'bold' }}>Priorité</Form.Label>
                <Form.Select
                  name="id_priorite"
                  value={formData.id_priorite}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                >
                  <option value="">Sélectionner...</option>
                  {DataPriorite.length > 0 ? (
                    DataPriorite.map(item => (
                      <option key={item.id_priorite} value={item.id_priorite}>
                        {item.niveau}
                      </option>
                    ))
                  ) : (
                    <option disabled>Aucune donnée disponible</option>
                  )}
                </Form.Select>
              </Form.Group>
            </Row>
            <Form.Group className='mb-3' controlId="note">
                <Form.Label style={{ fontWeight: 'bold' }}>Note</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ex: Note sur le courrier"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </Form.Group>

            {/* Contenu */}
            <Form.Group className="mb-3" controlId="contenu">
              <Form.Label style={{ fontWeight: 'bold' }}>Contenu</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Rédiger le contenu du courrier..."
                name="contenu"
                value={formData.contenu}
                onChange={handleChange}
                disabled={isLoading}
              />
            </Form.Group>

            {/* Fichiers */}
            <Form.Group controlId="fichiers" className="mb-3">
              <Form.Label style={{ fontWeight: 'bold' }}>Documents joints</Form.Label>
              <Form.Control
                type="file"
                multiple
                accept=".pdf, .doc, .docx, .jpg, .jpeg, .png, .xls, .xlsx"
                onChange={handleFileChange}
                disabled={isLoading}
              />
            </Form.Group>

            {/* Boutons */}
            <div className="d-flex justify-content-end gap-3 mt-4">
              <Button variant="secondary" onClick={() => navigate('/liste-courrier')} disabled={isLoading}>
                <FaTimesCircle className="me-2" />
                Annuler
              </Button>
              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" /> Enregistrement....
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
    {/* Modal de confirmation */}
          <Modal
            show={showConfirm}
            onHide={() => setShowConfirm(false)}
            centered
            backdrop="static"
          >
            <Modal.Header closeButton>
              <Modal.Title>✅ Courrier enregistré avec succès !</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h6> Reference du courrier: {reference} </h6>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={confirmNavigate}>
                continuer
              </Button>
            </Modal.Footer>
          </Modal>
               
   </Container>
  );
}

