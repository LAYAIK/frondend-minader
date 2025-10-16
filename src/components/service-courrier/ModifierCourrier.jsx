// src/components/ModifierCourrier.jsx
import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, Col, Row, Spinner,Modal,ListGroup, Container } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router';
import { getByIdCourrier, miseAJourCourrier,getByIdDocument,deleteDocument,createCourrierArchive,suppressionCourrier } from '../../actions/Courrier';
import { useDataObjet, useDataPriorite, useDataStatus } from '../../data/serviceAutreData';
import { useDataTypeCourrier, useDataDocument  } from '../../data/serviceCourrierData';
import { FaPaperPlane, FaTimes, FaUpload, FaTrash } from "react-icons/fa"; // 

export default function ModifierCourrier() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    reference_courrier: '',
    id_courrier: '',
    id_utilisateur: '',
    id_objet: '',
    objet: '',
    id_type_courrier: '',
    id_status: '',
    id_priorite: '',
    note: ''
  });
  const [files, setFiles] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [previewDoc, setPreviewDoc] = useState(null); // Pour la visualisation
  const [documents, setDocuments] = useState([]);

  const { DataObjet } = useDataObjet();
  const { DataPriorite } = useDataPriorite();
  const { DataStatus } = useDataStatus();
  const { DataDocument } = useDataDocument();
  const { DataTypeCourrier } = useDataTypeCourrier();

  // Récupération des données du courrier
  // Charger les infos du courrier
  useEffect(() => {
    const fetchCourrier = async () => {
      try {
        setDocuments(DataDocument.filter(doc => doc.id_courrier === id));
        const response = await getByIdCourrier(id);
        setFormData((prev) => ({ ...prev, ...response }));
      } catch (err) {
        setError("Erreur lors de la récupération des données du courrier.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourrier();
  }, [id, DataDocument]);

  // Récupération de l'utilisateur connecté
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    setError('');
    setSuccessMessage('');
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };
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
  // Suppression d'une pièce jointe
    const handleDelete = async (doc) => {
      if (!window.confirm(`Voulez-vous vraiment supprimer "${doc.libelle}" ?`)) return;
  
      try {
        await deleteDocument(doc.id_document); // appel backend
        setDocuments((prevDocs) =>
          prevDocs.filter((d) => d.id_document !== doc.id_document)
        );
        setSuccessMessage("Pièce jointe supprimée ✅");
      } catch (err) {
        setError("Erreur lors de la suppression de la pièce jointe ❌");
        console.error(err);
      }
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      console.log('formData', formData);
      console.log(id)
      if (!id || ! user.id_utilisateur) {
        throw new Error("Veuillez sélectionner le courrier et l'utilisateur.");
      }

      let payload = {
        id_structure: formData.id_structure,
        id_status: formData.id_status,
        id_utilisateur: user.id_utilisateur,
        id_type_courrier: formData.id_type_courrier,
        note: formData.note,
        id_objet: formData.id_objet,
        id_priorite: formData.id_priorite,
        id_courrier: formData.id_courrier,
        reference_courrier: formData.reference_courrier
      };

      console.log('data a modifier', payload)

      // Gestion des fichiers
      const formDataPayload = new FormData();
      Object.keys(payload).forEach(key => {
        formDataPayload.append(key, payload[key]);
      });
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          formDataPayload.append('fichiers', files[i]);
        }
      }
      console.log('id status ', payload.id_status);
      console.log('id', id);
      if (payload.id_status === 'cb9d439d-f848-49bc-8e88-30d9f60671e2') {
        await createCourrierArchive(formDataPayload);
        await suppressionCourrier(id, formDataPayload);
        setSuccessMessage("✅ Courrier archivé avec succès !");
        setTimeout(() => navigate('/liste-courrier'), 2500);
      }else {

        await miseAJourCourrier(id, formDataPayload);
        setSuccessMessage("✅ Courrier mis à jour avec succès !");
        setTimeout(() => navigate('/liste-courrier'), 2500);
      }
    } catch (err) {
      setError("❌ Erreur lors de la mise à jour du courrier.", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnnuler = () => navigate('/liste-courrier');

  return (
    <Container fluid style={{maxWidth:'900px'}} className='mt-4'>

    <div className="">
      <Card className="shadow-sm rounded-3">
        <Card.Header as="h4" className="bg-success text-white text-center py-3">
          ✏️ Modifier le Courrier
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit} className='d-flex flex-column mx-4 mt-2'>

          {/* Feedback */}
            {error && <Alert variant="danger">{error}</Alert>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            
            {/* Référence */}
            <Form.Group className="mb-2">
              <Form.Label style={{ fontWeight: 'bold' }}>Référence Courrier</Form.Label>
              <Form.Control
                type="text"
                name="reference_courrier"
                value={formData.reference_courrier}
                onChange={handleChange}
                readOnly
                placeholder="Entrez la référence du courrier"
              />
            </Form.Group>

            {/* Ligne 1 */}
            <Row className="mb-2">
              <Form.Group as={Col}>
                <Form.Label style={{ fontWeight: 'bold' }}>Objet</Form.Label>
                <Form.Select name="id_objet" value={formData.id_objet} onChange={handleChange}>
                  <option value="">Sélectionner...</option>
                  {DataObjet.map(item => (
                    <option key={item.id_objet} value={item.id_objet}>{item.libelle}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label style={{ fontWeight: 'bold' }}>Status</Form.Label>
                <Form.Select name="id_status" value={formData.id_status} onChange={handleChange}>
                  <option value="">Sélectionner...</option>
                  {DataStatus.map(item => (
                    <option key={item.id_status} value={item.id_status}>{item.libelle}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Row>

            {/* Ligne 2 */}
            <Row className="mb-2">
              <Form.Group as={Col}>
                <Form.Label style={{ fontWeight: 'bold' }}>Priorité</Form.Label>
                <Form.Select name="id_priorite" value={formData.id_priorite} onChange={handleChange}>
                  <option value="">Sélectionner...</option>
                  {DataPriorite.map(item => (
                    <option key={item.id_priorite} value={item.id_priorite}>{item.niveau}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label style={{ fontWeight: 'bold' }}>Type de Courrier</Form.Label>
                <Form.Select name="id_type_courrier" value={formData.id_type_courrier} onChange={handleChange}>
                  <option value="">Sélectionner...</option>
                  {DataTypeCourrier.map(item => (
                    <option key={item.id_type_courrier} value={item.id_type_courrier}>{item.type}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Row>

            {/* Note */}
            <Form.Group className="mb-2">
              <Form.Label style={{ fontWeight: 'bold' }}>Note</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="note"
                value={formData.note || ''}
                onChange={handleChange}
                placeholder="Ajoutez une note si nécessaire"
              />
            </Form.Group>
              {
               documents.length > 0 && (
                <div className=" mb-2">
                  <h5 className="mb-1 strong">📎 Pièces Jointes</h5>
                  <ListGroup>
                    {documents.map((doc) => (
                      <ListGroup.Item
                      key={doc.id_document}
                      className="d-flex justify-content-between align-items-center"
                      style={{ backgroundColor: '#f8f9fa' }}
                      disabled={isLoading}
                      accept=".pdf, .doc, .docx, .jpg, .jpeg, .png"
                      type="file"
                      >
                        {doc.libelle}
                        <div className='mb-1'>
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
                            className="me-2"
                            onClick={() => handleDownload(doc)}
                            >
                            Télécharger
                          </Button>
                          <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDelete(doc)}
                              >
                                <FaTrash className="me-1" /> Supprimer
                              </Button>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
               )
              }

            {/* Upload */}
            <Form.Group className="mb-2">
              <Form.Label style={{ fontWeight: 'bold' }}>Documents joints</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={handleFileChange}
                accept=".pdf, .doc, .docx, .jpg, .jpeg, .png"
                disabled={isLoading}
              />
            </Form.Group>

            {/* Boutons */}
            <div className="d-flex justify-content-end gap-3 mt-1">
              <Button variant="secondary" onClick={handleAnnuler}>Annuler</Button>
              <Button variant="primary" type="submit" disabled={isLoading}>
                {isLoading ? <><Spinner size="sm" animation="border" /> Mise à jour...</> : '💾 Mettre à jour'}
              </Button>
            </div>
          </Form>
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
    </div>
  </Container>
  );
}
