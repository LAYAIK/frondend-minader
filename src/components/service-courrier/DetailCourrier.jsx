import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Container, Card, ListGroup, Spinner, Alert, Button, Row, Col, Modal } from 'react-bootstrap';
import { getByIdCourrier, getByIdDocument } from '../../actions/Courrier';
import { useDataObjet, useDataPriorite, useDataStatus } from '../../data/serviceAutreData';
import { useDataTypeCourrier, useDataDocument } from '../../data/serviceCourrierData';
import { useDataUtilisateur } from '../../data/serviceAuthen';
import { useDataStructure } from '../../data/serviceStructurePerso';

const DetailCourrier = () => {
  const { id } = useParams();
  const [courrier, setCourrier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { DataObjet } = useDataObjet();
  const { DataPriorite } = useDataPriorite();
  const { DataStatus } = useDataStatus();
  const { DataTypeCourrier } = useDataTypeCourrier();
  const { DataUtilisateur } = useDataUtilisateur();
  const { DataStructure } = useDataStructure();
  const { DataDocument } = useDataDocument();
  const [documents, setDocuments] = useState([]);
  const [user, setUser] = useState([]);
  const [previewDoc, setPreviewDoc] = useState(null); // Pour la visualisation
  const navigate = useNavigate();

  // Charger les infos du courrier
  useEffect(() => {
    const fetchDetailCourrier = async () => {
      try {
        const response = await getByIdCourrier(id);
        if (!response) throw new Error("Erreur lors du chargement des détails du courrier.");
        setCourrier(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDetailCourrier();
  }, [id]);

  // Charger les documents associés
  useEffect(() => {
    if (courrier) {
      setDocuments(DataDocument.filter(doc => doc.id_courrier === courrier.id_courrier));
      setUser(DataUtilisateur.data.filter(u => u.id_utilisateur === courrier.id_utilisateur));
    } else {
      setDocuments([]);
    }
  }, [courrier, DataDocument, DataUtilisateur]);

  // Fonction téléchargement
  const handleDownload = async (doc) => {
    try {
      console.log(doc);
      const response = await getByIdDocument(doc.id_document);
      if (!response) throw new Error("Erreur lors du téléchargement du fichier.");

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.libelle || "document";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message);
    }
  };

  // Fonction prévisualisation
  const handlePreview = (doc) => {
    console.log(doc);
    setPreviewDoc(doc);
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="m-4">
      <Card className="shadow-sm">
        <Card.Header as="h3" className="bg-success text-white d-flex justify-content-between">
          <span>Détails du Courrier #{courrier.reference_courrier}</span>
          <Button variant="light" size="sm" onClick={() => navigate("/liste-courrier")}>
            Retour
          </Button>
        </Card.Header>
        <Card.Body>
          <Row className='d-flex justify-content-center align-items-center'>
            <Col md={4}>
              <ListGroup variant="flush">
                <ListGroup.Item><strong>Objet :</strong> {DataObjet.find(o => o.id_objet === courrier.id_objet)?.libelle || 'N/A'}</ListGroup.Item>
                <ListGroup.Item><strong>Priorité :</strong> {DataPriorite.find(p => p.id_priorite === courrier.id_priorite)?.niveau || 'N/A'}</ListGroup.Item>
                <ListGroup.Item><strong>Statut :</strong> {DataStatus.find(s => s.id_status === courrier.id_status)?.libelle || 'N/A'}</ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={4}>
              <ListGroup variant="flush">
                <ListGroup.Item><strong>Date :</strong> {courrier.date_reception ? new Date(courrier.date_reception).toLocaleDateString() : 'N/A'}</ListGroup.Item>
                <ListGroup.Item><strong>Structure :</strong> {DataStructure.find(s => s.id_structure === courrier.id_structure)?.nom || 'N/A'}</ListGroup.Item>
                <ListGroup.Item><strong>Utilisateur :</strong> {user.find(u => u.id_utilisateur === courrier.id_utilisateur)?.noms || 'N/A'}</ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={4}>
              <ListGroup variant='flush'>
                <ListGroup.Item><strong>Type :</strong> {DataTypeCourrier.find(t => t.id_type_courrier === courrier.id_type_courrier)?.type || 'N/A'}</ListGroup.Item>
                <ListGroup.Item><strong>Contenu :</strong> {courrier.contenu}</ListGroup.Item>
                <ListGroup.Item><strong>Delais de traitement :</strong> {courrier.delais_traitement}</ListGroup.Item>
                
              </ListGroup>
            </Col>
          </Row>

          {documents.length > 0 && (
            <div className="mt-4">
              <h5 className="mb-3">📎 Pièces Jointes</h5>
              <ListGroup>
                {documents.map((doc) => (
                  <ListGroup.Item
                    key={doc.id_document}
                    className="d-flex justify-content-between align-items-center"
                  >
                    {doc.libelle}
                    <div>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handlePreview(doc)}
                      >
                        Visualiser
                      </Button>
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => handleDownload(doc)}
                      >
                        Télécharger
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modal de prévisualisation */}
      <Modal show={!!previewDoc} onHide={() => setPreviewDoc(null)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Visualisation : {previewDoc?.libelle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {previewDoc && (
            <iframe
              src={`http://localhost:3002/api/documents/${previewDoc.id_document}/view`}
              title={previewDoc.libelle}
              width="100%"
              height="500px"
              style={{ border: "none" }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setPreviewDoc(null)}>Fermer</Button>
          <Button variant="success" onClick={() => handleDownload(previewDoc)}>Télécharger</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DetailCourrier;
