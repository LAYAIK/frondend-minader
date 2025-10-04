// src/components/TransfertCourrier.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Button,
  Alert,
  Row,
  Col,
  Spinner,
  Modal, ListGroup,
  Container,
} from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { useDataCourrier, useDataDocument } from "../../data/serviceCourrierData";
import { useDataUtilisateur } from "../../data/serviceAuthen";
import { useDataPriorite, useDataObjet } from "../../data/serviceAutreData";
import { useDataStructure } from "../../data/serviceStructurePerso";
import { getByIdCourrier, getByIdDocument,deleteDocument } from "../../actions/Courrier";
import { notifyUser } from "../../actions/Notification";
import { useParams, useNavigate } from "react-router";
import { FaPaperPlane, FaTimes, FaUpload, FaTrash } from "react-icons/fa"; // 

export default function TransfertCourrier() {
  const navigate = useNavigate();
  const { id } = useParams();

  // State management
  const [formData, setFormData] = useState({
    id_courrier: "",
    id_structure: "",
    note: "",
    id_status: "a342bc27-db38-4b6a-b4fd-dd29f258cf89",
    id_type_courrier: "",
    id_priorite: "",
    delais_traitement: "",
  });
  const [files, setFiles] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null); // Pour la visualisation
  const [documents, setDocuments] = useState([]);

  // Custom Hooks
  const { transfertCourier } = useAuth();
  const { DataStructure } = useDataStructure();
  const { DataCourrier } = useDataCourrier();
  const { DataDocument } = useDataDocument();
  const { DataPriorite } = useDataPriorite();
  const { DataObjet } = useDataObjet();
  const { DataUtilisateur } = useDataUtilisateur();

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

  // Récupérer l'utilisateur connecté
  const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;
  useEffect(() => {
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;
    console.log('user connected', user)
    const id_type_courrier = DataCourrier.find((dat) => dat.id_courrier === id)?.id_type_courrier || "";
    if (user && user.id_utilisateur) {
      setFormData((prevData) => ({
        ...prevData,
        id_utilisateur_transfert: user.id_utilisateur,
        id_type_courrier: id_type_courrier,
      }));
    }
  }, [DataCourrier, id]);

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setError("");
    setSuccessMessage("");
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleAnnuler = () => {
    navigate("/liste-courrier");
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
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      if (!formData.id_courrier || !formData.id_structure) {
        throw new Error(
          "Veuillez sélectionner le courrier et la structure de destination."
        );
      }

      let payload = {
        id_structure_nouveau: formData.id_structure,
        note: formData.note,
        id_status: "a342bc27-db38-4b6a-b4fd-dd29f258cf89",
        id_utilisateur_transfert: user.id_utilisateur,
        id_type_courrier: formData.id_type_courrier,
        id_priorite: formData.id_priorite,
        delais_traitement: formData.delais_traitement,
      };

      const formDataWithFiles = new FormData();
      Object.keys(payload).forEach((key) => {
        formDataWithFiles.append(key, payload[key]);
      });
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          formDataWithFiles.append("fichiers", files[i]);
        }
      }
        console.log('formDataWithFiles', formDataWithFiles);
        console.log('payload', payload);


      const id_courrier = formData.id_courrier;

      const resultat = await transfertCourier(id_courrier, formDataWithFiles);

      console.log('resultat du transfert', resultat);

      let data = {
          "toUserId": DataUtilisateur.data?.find((u) => u.id_structure === resultat.id_structure)?.id_utilisateur || '',
          "titre": DataObjet?.find((d) => d.id_objet === resultat.id_objet)?.libelle || 'Courrier transféré',
          "message": `Le courrier ${resultat.reference_courrier} a été transféré vers votre service.`,
          "url": `/detail-courrier/${resultat.id_courrier}`,
          //meta: { id_courrier: resultat.id_courrier },
      };

      console.log('notification data', data);

      // pour envoyer la nofication a l'utilisateur 
     const resul = await notifyUser(data);

      console.log('resultat notification', resul);

      setSuccessMessage("Le courrier a été transféré avec succès ✅ et la notification envoyée.");
      setTimeout(() => {
        navigate("/liste-courrier");
      }, 3000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.statusText ||
        "Une erreur inconnue est survenue.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fluid>
    <div className="d-flex justify-content-center">
      <Card className="shadow-lg">
        <Card.Header className="bg-success text-white">
          <h4 className="mb-0">✉️ Transférer un Courrier</h4>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit} className="m-4 mt-1">
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="courrier-select">
                  <Form.Label style={{ fontWeight: "bold" }}> Référence du Courrier </Form.Label>
                  <Form.Select
                    value={formData.id_courrier}
                    onChange={handleChange}
                    name="id_courrier"
                    readOnly
                    required
                    disabled={isLoading}
                  >
                    <option value="">Sélectionner...</option>
                    {DataCourrier?.map((item) => (
                      <option key={item.id_courrier} value={item.id_courrier}>
                        {item.reference_courrier} - { DataObjet?.find((obj) => obj.id_objet === item.id_objet)?.libelle || 'Objet inconnu' }
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="structure-select">
                  <Form.Label style={{ fontWeight: "bold" }}>Structure destinataire</Form.Label>
                  <Form.Select
                    value={formData.id_structure}
                    onChange={handleChange}
                    name="id_structure"
                    required
                    disabled={isLoading}
                  >
                    <option value="">Sélectionner...</option>
                    {DataStructure?.map((item) => (
                      <option key={item.id_structure} value={item.id_structure}>
                        {item.nom}-------{item.definition}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row> 
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="courrier-select">
                  <Form.Label style={{ fontWeight: "bold" }}>Priorite</Form.Label>
                  <Form.Select
                    value={formData.id_priorite}
                    onChange={handleChange}
                    name="id_priorite"
                    required
                    disabled={isLoading}
                  >
                    <option value="">Sélectionner...</option>
                    {DataPriorite?.map((item) => (
                      <option key={item.id_priorite} value={item.id_priorite}>
                        {item.niveau}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="courrier-select">
                  <Form.Label style={{ fontWeight: "bold" }}>Delais de traitement(Jours)</Form.Label>
                  <Form.Control
                    value={formData.delais_traitement}
                    onChange={handleChange}
                    name="delais_traitement"
                    placeholder="Ex: 4"
                    type= "number"
                    disabled={isLoading}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: "bold" }}>Note</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="note"
                value={formData.note}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Ajouter une note (optionnel)"
              />
            </Form.Group>

          {
           documents.length > 0 && (
            <div className="mt-4 mb-3">
              <h5 className="mb-3 strong">📎 Pièces Jointes</h5>
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
          )}

            <Form.Group controlId="formFileMultiple" className="mb-3">
              <Form.Label style={{ fontWeight: "bold" }}>📎 Ajouter un document</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={handleFileChange}
                accept=".pdf, .doc, .docx, .jpg, .jpeg, .png"
                disabled={isLoading}
              />
            </Form.Group>
            <div className="d-flex gap-3">
              <Button variant="success" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      className="me-2"
                    />
                    Transfert en cours...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="me-2" />
                    Transférer
                  </>
                )}
              </Button>
              <Button
                variant="outline-danger"
                type="button"
                onClick={handleAnnuler}
                >
                <FaTimes className="me-2" />
                Annuler
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
