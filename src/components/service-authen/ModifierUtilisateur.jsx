import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Form,
  Button,
  Spinner,
  Card,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import {
  FaUser,
  FaShieldAlt,
} from "react-icons/fa";
import "../../css/EditUser.css";

// --- Import des services ---
import {
  useDataRole,
  useDataScope,
  useDataRoleScope,
} from "../../data/serviceAuthen";
import {
  getByIdUtilisateur,
  createRoleScope, miseAJourUtilisateur,deleteRoleScope
} from "../../actions/Utilisateur";

export default function ModifierUtilisateur() {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- États globaux ---
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  // --- Données contextuelles ---
  const { DataRole } = useDataRole();
  const { DataScope } = useDataScope();
  const { DataRoleScope } = useDataRoleScope();

  // --- États locaux ---
  const [permissions, setPermissions] = useState([]);
  const [userScopes, setUserScopes] = useState([]);
  const [user, setUser] = useState({
    noms: "",
    prenoms: "",
    adresse_email: "",
    telephone: "",
    RoleIdRole: "",
    fonction: "",
    id_structure: "",
    is_actif: false,
  });

  // --- Charger les permissions disponibles ---
  useEffect(() => {
    if (DataScope) {
      const scopes = Array.isArray(DataScope.data)
        ? DataScope.data
        : Array.isArray(DataScope)
        ? DataScope
        : [];
      setPermissions(scopes);
    }
  }, [DataScope]);

  // --- Charger les infos utilisateur et ses scopes ---
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await getByIdUtilisateur(id);
        setUser((prev) => ({ ...prev, ...response }));

        // Récupération des scopes liés au rôle de cet utilisateur
        const roleScopes = DataRoleScope.filter(
          (rs) => rs.id_role === response.RoleIdRole
        ).map((rs) => rs.id_scope);

        setUserScopes(roleScopes);
      } catch (err) {
        console.error("Erreur utilisateur:", err);
        setAlert({
          type: "danger",
          message:
            "Erreur lors du chargement des informations de l'utilisateur.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [id, DataRoleScope]);

  // --- Gestion des changements des champs utilisateur ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setAlert({ type: "", message: "" });
  };

  // --- Gestion des permissions dynamiques ---
  const handlePermissionChange = (scopeId) => {
    setUserScopes((prev) =>
      prev.includes(scopeId)
        ? prev.filter((id) => id !== scopeId)
        : [...prev, scopeId]
    );
  };

  // --- Enregistrer les modifications ---
 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setAlert({ type: "", message: "" });

  try {
    // --- 1️⃣ Met à jour les infos utilisateur ---
    const payload = {
      noms: user.noms,
      prenoms: user.prenoms,
      adresse_email: user.adresse_email,
      telephone: user.telephone,
      RoleIdRole: user.RoleIdRole,
      fonction: user.fonction,
      id_structure: user.id_structure,
      is_actif: user.is_actif,
    };

    console.log("🟢 Payload envoyé :", payload);
    const resUpdate = await miseAJourUtilisateur(id, payload);
    console.log("🟢 Utilisateur mis à jour :", resUpdate);

    // --- 2️⃣ Synchroniser les scopes ---
    // On récupère tous les scopes actuels du rôle
    const existingRoleScopes = DataRoleScope
      .filter((rs) => rs.id_role === user.RoleIdRole)
      .map((rs) => rs.id_scope);

    console.log("🔹 Scopes actuels en base :", existingRoleScopes);
    console.log("🔹 Scopes cochés (nouveaux) :", userScopes);

    // --- Créer les nouveaux scopes cochés ---
    for (const scopeId of userScopes) {
      if (!existingRoleScopes.includes(scopeId)) {
        const resAdd = await createRoleScope({
          id_role: user.RoleIdRole,
          id_scope: scopeId,
        });
        console.log(`✅ Scope ajouté (${scopeId}) :`, resAdd);
      }
    }

    // --- Supprimer les anciens scopes décochés ---
    for (const oldScopeId of existingRoleScopes) {
      if (!userScopes.includes(oldScopeId)) {
        // ⚠️ Tu dois avoir une fonction deleteRoleScope() dans ton service
        const resDel = await deleteRoleScope({
          id_role: user.RoleIdRole,
          id_scope: oldScopeId,
        });
        console.log(`🗑️ Scope supprimé (${oldScopeId}) :`, resDel);
      }
    }

    // --- 3️⃣ Message de succès ---
    setAlert({
      type: "success",
      message: "✅ Utilisateur et permissions mis à jour avec succès.",
    });

    // --- Redirection après succès ---
    setTimeout(() => navigate("/liste-utilisateur"), 2500);
  } catch (err) {
    console.error("❌ Erreur de mise à jour :", err);
    setAlert({
      type: "danger",
      message:
        err.response?.data?.message ||
        "Une erreur est survenue lors de la mise à jour.",
    });
  } finally {
    setIsLoading(false);
  }
};

  
  const handleAnnuler = () => navigate('/liste-utilisateur');



  // --- Rendu principal ---
  return (
    <div className="container my-4">
      <Card className="shadow-lg border-0 rounded-4">
        <Card.Body> 
          <div className="justify-content-between container-fluid d-flex">
          <h4 className="fw-bold mb-3 text-primary">
            <FaUser className="me-2" />
            Modifier un utilisateur
          </h4>
          <Button variant="secondary" style={{height:'35px'}} onClick={handleAnnuler}>Retour</Button>
          </div>

          {alert.message && (
            <Alert variant={alert.type} className="fw-semibold text-center">
              {alert.message}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            {/* === SECTION INFOS PERSONNELLES === */}
            <section className="mb-4">
              <h5 className="border-bottom pb-2 mb-3 text-secondary fw-bold">
                Informations personnelles
              </h5>

              <Row className="g-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Nom</Form.Label>
                    <Form.Control
                      type="text"
                      name="noms"
                      value={user.noms}
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Prénom</Form.Label>
                    <Form.Control
                      type="text"
                      name="prenoms"
                      value={user.prenoms}
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="adresse_email"
                      value={user.adresse_email}
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Téléphone</Form.Label>
                    <Form.Control
                      type="text"
                      name="telephone"
                      value={user.telephone}
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Fonction</Form.Label>
                    <Form.Control
                      type="text"
                      name="fonction"
                      value={user.fonction}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Rôle</Form.Label>
                    <Form.Select
                      name="RoleIdRole"
                      value={user.RoleIdRole}
                      onChange={handleChange}
                      required
                    >
                      <option >Choisir...</option>
                      {DataRole?.map((role) => (
                        <option
                          key={role.id_role}
                          value={role.id_role}
                        >
                          {role.nom}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </section>

            {/* === SECTION PERMISSIONS === */}
            <section className="mt-4">
              <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                <h5 className="text-secondary fw-bold">
                  <FaShieldAlt className="me-2" />
                  Permissions
                </h5>
                <Form.Check
                  type="switch"
                  id="is_actif"
                  label="Compte actif"
                  name="is_actif"
                  checked={user.is_actif}
                  onChange={handleChange}
                />
              </div>

              {permissions.length === 0 ? (
                <div className="text-center py-3">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : (
                <Row className="g-3">
                  {permissions.map((perm) => (
                    <Col key={perm.id} md={6} lg={4} className="text-center">
                      <Form.Check
                        type="checkbox"
                        id={`perm-${perm.code}`}
                        checked={userScopes.includes(perm.id_scope || perm.code)}
                        label={perm.libelle || perm.description}
                        onChange={() =>
                          handlePermissionChange(perm.id_scope || perm.code)
                        }
                        className="fw-semibold border rounded-3 bg-light hover-shadow-sm"
                      />
                    </Col>
                  ))}
                </Row>
              )}
            </section>

            {/* === BOUTON DE VALIDATION === */}
            <div className="text-center mt-4">
              <Button
                variant="primary"
                type="submit"
                className="px-4 py-2 fw-semibold rounded-pill shadow-sm"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Sauvegarde...
                  </>
                ) : (
                  "Enregistrer les modifications"
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
