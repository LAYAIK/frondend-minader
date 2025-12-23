import React, { useState, useEffect } from "react";
import {
  Card, Form, Button, Alert, Row, Col, Spinner,
  Container, ListGroup, Modal
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import { FaPaperPlane, FaTimes, FaTrash } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { useDataStructure } from "../../data/serviceStructurePerso";
import { useDataUtilisateur } from "../../data/serviceAuthen";
import { useDataCourrier, useDataDocument } from "../../data/serviceCourrierData";
import { useDataPriorite } from "../../data/serviceAutreData";
import { notifyUser } from "../../actions/Notification";
import { getByIdCourrier, getByIdDocument, deleteDocument } from "../../actions/Courrier";
import "../../css/TransfertCourrier.css";

export default function TransfertCourrier() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, transfertCourier } = useAuth();

  // 🔹 Hooks data
  const { DataStructure } = useDataStructure();
  const { DataUtilisateur } = useDataUtilisateur();
  const { DataCourrier } = useDataCourrier();
  const { DataPriorite } = useDataPriorite();
  const { DataDocument } = useDataDocument();

  // 🔹 States
  const [selectedStructures, setSelectedStructures] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState({});
  const [formData, setFormData] = useState({
    id_priorite: "",
    note: "",
    delais_traitement: "",
    reference_courrier: "",
  });
  const [documents, setDocuments] = useState([]);
  const [files, setFiles] = useState([]);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // 🔹 Charger le courrier
  useEffect(() => {
    const fetchCourrier = async () => {
      try {
        const courrier = await getByIdCourrier(id);
        setFormData((prev) => ({ ...prev, ...courrier }));
        setDocuments(DataDocument.filter((d) => d.id_courrier === id));
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement du courrier.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourrier();
  }, [id, DataDocument]);

  // 🟢 Sélection des structures
  const handleStructureSelect = (structureId) => {
    setSelectedStructures((prev) =>
      prev.includes(structureId)
        ? prev.filter((id) => id !== structureId)
        : [...prev, structureId]
    );
  };

  // 🟢 Sélection des utilisateurs d’une structure
  const handleUserSelect = (structureId, userId) => {
    setSelectedUsers((prev) => {
      const prevUsers = prev[structureId] || [];
      const updatedUsers = prevUsers.includes(userId)
        ? prevUsers.filter((id) => id !== userId)
        : [...prevUsers, userId];
      return { ...prev, [structureId]: updatedUsers };
    });
  };

  // 🟢 Gestion formulaire
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFiles(Array.from(e.target.files));

  // 🔸 Téléchargement & Visualisation
  const handleDownload = async (doc) => {
    try {
      const response = await getByIdDocument(doc.id_document);
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = doc.libelle || "document";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      setError("Erreur lors du téléchargement.");
    }
  };
  const handlePreview = (doc) => setPreviewDoc(doc);

  // 🔸 Suppression document
  const handleDelete = async (doc) => {
    if (!window.confirm(`Supprimer "${doc.libelle}" ?`)) return;
    try {
      await deleteDocument(doc.id_document);
      setDocuments((prev) => prev.filter((d) => d.id_document !== doc.id_document));
    } catch {
      setError("Erreur lors de la suppression.");
    }
  };

  // 🧭 Soumission : Transfert multiple
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedStructures.length === 0) {
      setError("Veuillez sélectionner au moins une structure !");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      for (const id_structure_nouveau of selectedStructures) {
        const usersToNotify =
          selectedUsers[id_structure_nouveau] ||
          DataUtilisateur.filter((u) => u.id_structure === id_structure_nouveau).map(
            (u) => u.id_utilisateur
          );

        const payload = {
          id_structure_nouveau,
          id_status: "a342bc27-db38-4b6a-b4fd-dd29f258cf89",
          id_utilisateur_transfert: user.id_utilisateur,
          id_type_courrier: DataCourrier.find((c) => c.id_courrier === id)?.id_type_courrier,
          id_priorite: formData.id_priorite,
          delais_traitement: formData.delais_traitement,
          note: formData.note,
          date_envoi: new Date(),
        };

        const formDataWithFiles = new FormData();
        Object.entries(payload).forEach(([k, v]) => formDataWithFiles.append(k, v));
        files.forEach((file) => formDataWithFiles.append("fichiers", file));

        const response = await transfertCourier( id, formDataWithFiles);

        // 🔔 Notif automatique
        for (const userId of usersToNotify) {
          await notifyUser({
            toUserId: userId,
            titre: "Nouveau courrier transféré",
            message: `Le courrier ${response.data.reference_courrier} vous a été transféré.`,
            url: `/detail-courrier/${response.data.id_courrier}`,
          });
        }
      }

      setSuccess("✅ Courrier transféré avec succès !");
      setTimeout(() => navigate("/liste-courrier"), 2000);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du transfert du courrier.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading)
    return <Spinner animation="border" className="d-block mx-auto mt-5 text-success" />;

  return (
    <Container className="py-4">
      <Card className="shadow-lg border-0">
        <Card.Header className="bg-success text-white fw-bold">
          <FaPaperPlane className="me-2" /> Transfert Courrier
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            {/* INFO COURRIER */}
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Référence</Form.Label>
                  <Form.Control
                    value={formData.reference_courrier || ""}
                    readOnly
                    className="bg-light"
                  />
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
                    {DataPriorite.map((p) => (
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
                    value={formData.delais_traitement || ""}
                    onChange={handleChange}
                    placeholder="Ex: 3"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* STRUCTURES + UTILISATEURS */}
            <div className="p-3 bg-light rounded-3 shadow-sm mb-3">
              <h6 className="fw-bold text-dark mb-3">
                Sélectionner les structures destinataires
              </h6>
              <Row className="g-3">
                {DataStructure.map((structure) => (
                  <Col key={structure.id_structure} xs={12} sm={6} md={4} lg={3}>
                    <Card className="border-0 shadow-sm h-100 hover-card">
                      <Card.Body className="d-flex flex-column">
                        <Form.Check
                          type="checkbox"
                          id={`s-${structure.id_structure}`}
                          label={<strong>{structure.nom}</strong>}
                          checked={selectedStructures.includes(structure.id_structure)}
                          onChange={() => handleStructureSelect(structure.id_structure)}
                        />
                        {selectedStructures.includes(structure.id_structure) && (
                          <div className="mt-2 pt-2 border-top small">
                            {DataUtilisateur.filter(
                              (u) => u.id_structure === structure.id_structure
                            ).map((u) => (
                              <Form.Check
                                key={u.id_utilisateur}
                                type="checkbox"
                                label={`${u.noms} ${u.prenoms}`}
                                checked={
                                  selectedUsers[structure.id_structure]?.includes(
                                    u.id_utilisateur
                                  ) || false
                                }
                                onChange={() =>
                                  handleUserSelect(structure.id_structure, u.id_utilisateur)
                                }
                              />
                            ))}
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>

            {/* NOTE */}
            <Form.Group className="mb-3">
              <Form.Label>Note</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="note"
                value={formData.note}
                onChange={handleChange}
              />
            </Form.Group>

            {/* DOCUMENTS */}
            {documents.length > 0 && (
              <div className="mb-3">
                <h6 className="fw-bold">📎 Pièces Jointes</h6>
                <ListGroup>
                  {documents.map((doc) => (
                    <ListGroup.Item
                      key={doc.id_document}
                      className="d-flex justify-content-between align-items-center"
                    >
                      {doc.libelle}
                      <div>
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => handlePreview(doc)}
                          className="me-2"
                        >
                          Visualiser
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-success"
                          onClick={() => handleDownload(doc)}
                          className="me-2"
                        >
                          Télécharger
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
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

            {/* UPLOAD */}
            <Form.Group className="mb-3">
              <Form.Label>📁 Ajouter un document</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={handleFileChange}
                accept=".pdf, .doc, .docx, .jpg, .jpeg, .png"
              />
            </Form.Group>

            {/* BOUTONS */}
            <div className="d-flex justify-content-end gap-3">
              <Button type="submit" variant="success" disabled={isLoading}>
                {isLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <>
                    <FaPaperPlane className="me-2" /> Transférer
                  </>
                )}
              </Button>
              <Button
                variant="outline-danger"
                onClick={() => navigate("/liste-courrier")}
              >
                <FaTimes className="me-2" /> Annuler
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* 🔍 Modal Preview */}
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
