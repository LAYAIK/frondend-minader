import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Button,
  Alert,
  Row,
  Col,
  Spinner,
  Modal,
  ListGroup,
  Container,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router";
import { FaPaperPlane, FaTimes, FaTrash } from "react-icons/fa";

import { useAuth } from "../../contexts/AuthContext";
import { useDataCourrier, useDataDocument } from "../../data/serviceCourrierData";
import { useDataUtilisateur } from "../../data/serviceAuthen";
import { useDataPriorite, useDataObjet } from "../../data/serviceAutreData";
import { useDataStructure } from "../../data/serviceStructurePerso";

import { getByIdCourrier, getByIdDocument, deleteDocument } from "../../actions/Courrier";
import { notifyUser } from "../../actions/Notification";

export default function TransfertCourrier() {
  const navigate = useNavigate();
  const { id } = useParams();

  /** ==============================
   * STATES
   * ============================== */
  const [formData, setFormData] = useState({
    id_courrier: "",
    id_priorite: "",
    note: "",
    delais_traitement: "",
    reference_courrier: "",
    id_type_courrier: "",
  });

  const [selectedStructures, setSelectedStructures] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [files, setFiles] = useState([]);
  const [previewDoc, setPreviewDoc] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  /** ==============================
   * HOOKS DATA CONTEXTS
   * ============================== */
  const { transfertCourier } = useAuth();
  const { DataCourrier } = useDataCourrier();
  const { DataDocument } = useDataDocument();
  const { DataStructure } = useDataStructure();
  const { DataPriorite } = useDataPriorite();
  const { DataObjet } = useDataObjet();
  const { DataUtilisateur } = useDataUtilisateur();

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  console.log('liste structure :', DataStructure);

  /** ==============================
   * LOAD COURIER + DOCUMENTS
   * ============================== */
  useEffect(() => {
    const fetchCourrier = async () => {
      try {
        const courrier = await getByIdCourrier(id);
        const docs = DataDocument.filter((d) => d.id_courrier === id);
        setDocuments(docs);

        setFormData((prev) => ({
          ...prev,
          ...courrier,
          id_type_courrier: courrier?.id_type_courrier || "",
        }));
      } catch (err) {
        console.error(err);
        setError("Erreur lors de la récupération du courrier.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourrier();
  }, [id, DataDocument]);

  /** ==============================
   * HANDLERS
   * ============================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === "delais_traitement" ? Number(value) || "" : value, }));
    setError("");
  };

  const handleFileChange = (e) => setFiles(Array.from(e.target.files));

  const handleCheck = (id_structure) => {
    setSelectedStructures((prev) =>
      prev.includes(id_structure)
        ? prev.filter((id) => id !== id_structure)
        : [...prev, id_structure]
    );
  };

  const handleAnnuler = () => navigate("/liste-courrier");

  /** ==============================
   * TRANSFERT LOGIC
   * ============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (selectedStructures.length === 0) {
      setError("Veuillez sélectionner au moins une structure destinataire !");
      setIsLoading(false);
      return;
    }

    try {
      for (const structure of selectedStructures) {
        const payload = {
          id_structure_nouveau: structure,
          note: formData.note,
          id_status: "a342bc27-db38-4b6a-b4fd-dd29f258cf89",
          id_utilisateur_transfert: currentUser.id_utilisateur,
          id_type_courrier: formData.id_type_courrier,
          id_priorite: formData.id_priorite,
          delais_traitement: formData.delais_traitement,
          reference_courrier: formData.reference_courrier,
          date_envoi: new Date(),
        };

        console.log("id user sender", payload);
        
        const formDataWithFiles = new FormData();
        Object.entries(payload).forEach(([key, value]) =>
          formDataWithFiles.append(key, value)
        );
        files.forEach((file) => formDataWithFiles.append("fichiers", file));

        const resultat = await transfertCourier(formData.id_courrier, formDataWithFiles);
        console.log('resultat', resultat)
        // 🔔 Notification de transfert
        console.log('users', DataUtilisateur)

        const destinataire = DataUtilisateur?.find(
          (u) => u.id_structure === resultat.data.id_structure
        );
        console.log('destinataire', destinataire);

        const objet = DataObjet.find((o) => o.id_objet === resultat.id_objet)?.libelle;
        
        await notifyUser({
          toUserId: destinataire?.id_utilisateur || "",
          titre: objet || "Nouveau courrier transféré",
          message: `Le courrier ${resultat.reference_courrier} a été transféré vers votre service.`,
          url: `/detail-courrier/${resultat.id_courrier}`,
        });
      }

      setSuccess("✅ Courrier transféré avec succès à tous les destinataires.");
      setTimeout(() => navigate("/liste-courrier"), 2500);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Une erreur est survenue lors du transfert du courrier."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /** ==============================
   * DOCUMENTS HANDLERS
   * ============================== */
  const handlePreview = (doc) => setPreviewDoc(doc);

  const handleDownload = async (doc) => {
    try {
      const response = await getByIdDocument(doc.id_document);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.libelle || "document";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.log("Erreur lors du téléchargement du fichier.", err)
      setError("Erreur lors du téléchargement du fichier.");
    }
  };

  const handleDelete = async (doc) => {
    if (!window.confirm(`Supprimer "${doc.libelle}" ?`)) return;
    try {
      await deleteDocument(doc.id_document);
      setDocuments((prev) => prev.filter((d) => d.id_document !== doc.id_document));
      setSuccess("📄 Document supprimé avec succès.");
    } catch {
      setError("Erreur lors de la suppression du document.");
    }
  };

  /** ==============================
   * RENDER
   * ============================== */
  if (isLoading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;

  return (
    <Container fluid className="p-3">
      <Card className="shadow-lg mx-auto" style={{ maxWidth: "1000px" }}>
        <Card.Header className="bg-success text-white">
          <h4 className="mb-0">✉️ Transférer un Courrier</h4>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Référence</Form.Label>
                  <Form.Control value={formData.reference_courrier} readOnly />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Priorité</Form.Label>
                  <Form.Select
                    name="id_priorite"
                    value={formData.id_priorite}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Sélectionner...</option>
                    {DataPriorite?.map((p) => (
                      <option key={p.id_priorite} value={p.id_priorite}>
                        {p.niveau}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Délais (jours)</Form.Label>
                  <Form.Control
                    type="number"
                    name="delais_traitement"
                    value={formData.delais_traitement ?? ""}
                    onChange={handleChange}
                    placeholder="Ex: 3"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* STRUCTURES DESTINATAIRES */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Structures destinataires :</Form.Label>
              <div className="border rounded p-3" style={{ maxHeight: "250px", overflowY: "auto" }}>
                <Row>
                  {DataStructure?.map((s) => (
                    <Col xs={12} sm={6} md={4} lg={3} key={s.id_structure}>
                      <Form.Check
                        type="checkbox"
                        label={s.nom}
                        checked={selectedStructures.includes(s.id_structure)}
                        onChange={() => handleCheck(s.id_structure)}
                      />
                    </Col>
                  ))}
                </Row>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Note</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="note"
                value={formData.note}
                onChange={handleChange}
                placeholder="Ajouter une note (optionnel)"
              />
            </Form.Group>

            {/* DOCUMENTS */}
            {documents.length > 0 && (
              <div className="mb-4">
                <h5 className="fw-bold">📎 Pièces jointes</h5>
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
                          <FaTrash /> Supprimer
                        </Button>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            )}

            <Form.Group className="mb-4">
              <Form.Label>📎 Ajouter un document</Form.Label>
              <Form.Control type="file" multiple onChange={handleFileChange} />
            </Form.Group>

            <div className="d-flex justify-content-end gap-3">
              <Button type="submit" variant="success" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" /> Transfert...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="me-2" /> Transférer
                  </>
                )}
              </Button>
              <Button variant="outline-danger" onClick={handleAnnuler}>
                <FaTimes className="me-2" /> Annuler
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* MODAL VISUALISATION */}
      <Modal show={!!previewDoc} onHide={() => setPreviewDoc(null)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{previewDoc?.libelle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {previewDoc && (
            <iframe
              src={`http://localhost:3002/api/documents/${previewDoc.id_document}/view`}
              width="100%"
              height="500px"
              style={{ border: "none" }}
              title={previewDoc.libelle}
            />
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}
