import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Form,
  Button,
  Spinner,
  Card,
  Alert,
  Row,
  Col,
  Badge,
  Modal,
} from "react-bootstrap";
import axios from "axios";
import {
  FaShieldAlt,
  FaUser,
  FaLock,
  FaRegCheckCircle,
  FaUndoAlt,
  FaPlusCircle,
} from "react-icons/fa";
import "../../css/ModifierUtilisateur.css";

import {
  useDataRole,
  useDataScope,
  useDataRoleScope,
} from "../../data/serviceAuthen";
import {
  getByIdUtilisateur,
  createRoleScope,
  miseAJourUtilisateur,
  deleteRoleScope,
} from "../../actions/Utilisateur";

export default function ModifierUtilisateur() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { DataRole } = useDataRole();
  const { DataScope } = useDataScope();
  const { DataRoleScope } = useDataRoleScope();

  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [user, setUser] = useState({});
  const [permissions, setPermissions] = useState([]);
  const [userScopes, setUserScopes] = useState([]);

  // Modal création rôle
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRole, setNewRole] = useState("");

  // Charger permissions
  useEffect(() => {
    if (DataScope?.data || Array.isArray(DataScope)) {
      setPermissions(DataScope.data || DataScope);
    }
  }, [DataScope]);

  // Charger utilisateur
  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoading(true);
        const u = await getByIdUtilisateur(id);
        setUser(u);

        const scopes = DataRoleScope.filter(
          (r) => r.id_role === u.RoleIdRole
        ).map((r) => r.id_scope);
        setUserScopes(scopes);
      } catch (e) {
        console.error(e);
        setAlert({
          type: "danger",
          message: "Erreur lors du chargement de l'utilisateur.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, [id, DataRoleScope]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setUser((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handlePermissionChange = (scopeId) => {
    setUserScopes((prev) =>
      prev.includes(scopeId)
        ? prev.filter((id) => id !== scopeId)
        : [...prev, scopeId]
    );
  };

  // Group permissions
  const groupedPermissions = useMemo(() => {
    const groups = {};
    permissions.forEach((p) => {
      const key = p.objet || "Autres";
      if (!groups[key]) groups[key] = [];
      groups[key].push(p);
    });
    return groups;
  }, [permissions]);

  // === Ajouter un nouveau rôle ===
  const handleAddRole = async () => {
    if (!newRole.trim()) return;

    try {
      const response = await axios.post("http://localhost:3003/api/roles", {
        nom: newRole.trim(),
      });

      const createdRole = response.data;
      DataRole.push(createdRole);

      setUser((prev) => ({ ...prev, RoleIdRole: createdRole.id_role }));
      setAlert({ type: "success", message: "✅ Nouveau rôle ajouté avec succès !" });
      setShowRoleModal(false);
      setNewRole("");
    } catch (error) {
      console.error(error);
      setAlert({
        type: "danger",
        message: "Erreur lors de la création du rôle.",
      });
    }
  };

  // === Soumission principale ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert({ type: "", message: "" });

    try {
      await miseAJourUtilisateur(id, user);

      const currentScopes = DataRoleScope.filter(
        (r) => r.id_role === user.RoleIdRole
      ).map((r) => r.id_scope);

      for (const scope of userScopes)
        if (!currentScopes.includes(scope))
          await createRoleScope({ id_role: user.RoleIdRole, id_scope: scope });

      for (const old of currentScopes)
        if (!userScopes.includes(old))
          await deleteRoleScope({ id_role: user.RoleIdRole, id_scope: old });

      setAlert({
        type: "success",
        message: "✅ Utilisateur mis à jour avec succès !",
      });

      setTimeout(() => navigate("/liste-utilisateur"), 1800);
    } catch (err) {
      console.error(err);
      setAlert({
        type: "danger",
        message: "Erreur lors de la mise à jour.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      <Card className="shadow-lg border-0 rounded-4">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold text-success">
              <FaUser className="me-2" /> Modifier un utilisateur
            </h4>
            <Button variant="outline-secondary" onClick={() => navigate(-1)}>
              <FaUndoAlt className="me-1" /> Retour
            </Button>
          </div>

          {alert.message && (
            <Alert variant={alert.type} className="text-center fw-semibold">
              {alert.message}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            {/* === Informations personnelles === */}
            <section className="mb-4">
              <h5 className="text-secondary border-bottom pb-2 fw-bold">
                Informations personnelles
              </h5>
              <Row className="g-3">
                {[
                  { label: "Nom", name: "noms" },
                  { label: "Prénom", name: "prenoms" },
                  { label: "Email", name: "adresse_email" },
                  { label: "Téléphone", name: "telephone" },
                  { label: "Fonction", name: "fonction" },
                ].map((f) => (
                  <Col md={4} key={f.name}>
                    <Form.Group>
                      <Form.Label>{f.label}</Form.Label>
                      <Form.Control
                        type="text"
                        name={f.name}
                        value={user[f.name] || ""}
                        onChange={handleChange}
                        readOnly={["noms", "prenoms", "adresse_email", "telephone"].includes(f.name)}
                      />
                    </Form.Group>
                  </Col>
                ))}

                {/* Sélecteur de rôle + ajout */}
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Rôle</Form.Label>
                    <div className="d-flex gap-2">
                      <Form.Select
                        name="RoleIdRole"
                        value={user.RoleIdRole || ""}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Choisir...</option>
                        {DataRole?.map((r) => (
                          <option key={r.id_role} value={r.id_role}>
                            {r.nom}
                          </option>
                        ))}
                      </Form.Select>
                      <Button
                        variant="outline-primary"
                        title="Ajouter un nouveau rôle"
                        onClick={() => setShowRoleModal(true)}
                      >
                        <FaPlusCircle />
                      </Button>
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </section>

            {/* === Permissions === */}
            <section>
              <h5 className="text-success border-bottom pb-2 mb-3 fw-bold">
                <FaShieldAlt className="me-2" /> Permissions par objet
              </h5>

              <div className="permissions-grid">
                {Object.entries(groupedPermissions).map(([objet, perms]) => (
                  <Card key={objet} className="permission-card border-0 shadow-sm mb-3">
                    <Card.Header className="fw-semibold d-flex justify-content-between">
                      <span className="me-2 fw-bold text-success">{objet}</span>
                      <Badge bg="secondary">{perms.length}</Badge>
                    </Card.Header>
                    <Card.Body>
                      <div className="d-flex flex-wrap gap-2 justify-content-center">
                        {perms.map((perm) => (
                          <Form.Check
                            key={perm.id_scope}
                            type="checkbox"
                            id={`perm-${perm.id_scope}`}
                            checked={userScopes.includes(perm.id_scope)}
                            onChange={() => handlePermissionChange(perm.id_scope)}
                            label={perm.libelle}
                            className="border rounded-3 px-4 py-2 bg-white hover-shadow-sm align-items-center gap-2"
                          />
                        ))}
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </section>

            <div className="text-center mt-4">
              <Button
                type="submit"
                variant="primary"
                className="px-4 py-2 rounded-pill shadow-sm"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <FaRegCheckCircle className="me-2" />
                    Enregistrer
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* === MODAL NOUVEAU RÔLE === */}
      <Modal show={showRoleModal} onHide={() => setShowRoleModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un nouveau rôle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Nom du rôle</Form.Label>
            <Form.Control
              type="text"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              placeholder="Ex: Directeur RH"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRoleModal(false)}>
            Annuler
          </Button>
          <Button variant="success" onClick={handleAddRole}>
            <FaPlusCircle className="me-2" /> Ajouter
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
