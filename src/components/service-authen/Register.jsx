import React, { useState } from "react";
import { motion } from "framer-motion";
import { Form, Spinner, Alert, ProgressBar } from "react-bootstrap";
import { FaEnvelope, FaBuilding, FaLock, FaFileUpload } from "react-icons/fa";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { NavLink, useNavigate } from "react-router";
import { useDataStructure } from "../../data/serviceStructurePerso";
import { useAuth } from "../../contexts/AuthContext";
import { createDocument } from "../../actions/Courrier";

export default function Register() {
  const { createUtilisateur } = useAuth();
  const { DataStructure } = useDataStructure();
  const navigate = useNavigate();

  // États
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    id_structure: "",
    pwd1: "",
    pwd2: "",
    id: "",
  });
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ✅ Gestion des champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  // ✅ Gestion des fichiers
  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  // ✅ Simulation de l'upload
  const simulateUploadProgress = (onFinish) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setUploadProgress(0);
        onFinish();
      }
    }, 200);
  };

  // ✅ Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      if (formData.pwd1 !== formData.pwd2) {
        setError("❌ Les mots de passe ne correspondent pas.");
        setIsLoading(false);
        return;
      }

      const payload = {
        id_structure: formData.id_structure,
        password: formData.pwd1,
        adresse_email: formData.email,
        noms: formData.nom,
        prenoms: formData.prenom,
      };

      const resultat = await createUtilisateur(payload);
      const userId = resultat?.data?.id_utilisateur;

      if (!userId) throw new Error("Impossible de créer l'utilisateur.");

      setFormData((prev) => ({ ...prev, id: userId }));

      // Préparation de l'envoi du fichier
      if (files.length > 0) {
        const formDataFile = new FormData();
        formDataFile.append("id_utilisateur", userId);
        files.forEach((file) => formDataFile.append("fichiers", file));

        await createDocument(formDataFile);
      }

      // Simulation de la progression pour UX
      simulateUploadProgress(() => {
        setSuccess("✅ Votre demande d’accès a été envoyée avec succès !");
        setIsLoading(false);
        navigate("/login");
      });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.statusText ||
        err.message ||
        "Une erreur inconnue est survenue.";
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient d-flex justify-content-center align-items-center min-vh-100 px-3">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="card shadow-lg border-0 rounded-4 p-4 p-md-5 w-100"
        style={{ maxWidth: "550px" }}
      >
        {/* ---------- HEADER ---------- */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-4"
        >
          <h2 className="fw-bold text-black">
            TENA <span className="text-success">MAIL</span>
          </h2>
          <p className="text-muted mb-0">Demande d'accès à la plateforme</p>
        </motion.div>

        {/* ---------- ALERTES ---------- */}
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        {/* ---------- FORMULAIRE ---------- */}
        <Form onSubmit={handleSubmit}>
          {/* Nom & Prénom */}
          <div className="row">
            <Form.Group className="mb-3 col-md-6">
              <Form.Label className="fw-bold">Nom *</Form.Label>
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <BsFillPersonLinesFill />
                </span>
                <Form.Control
                  type="text"
                  name="nom"
                  placeholder="Ex : Nguimgo"
                  value={formData.nom}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3 col-md-6">
              <Form.Label className="fw-bold">Prénom</Form.Label>
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <BsFillPersonLinesFill />
                </span>
                <Form.Control
                  type="text"
                  name="prenom"
                  placeholder="Ex : Pascalo"
                  value={formData.prenom}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </Form.Group>
          </div>

          {/* Email & Direction */}
          <div className="row">
            <Form.Group className="mb-3 col-md-6">
              <Form.Label className="fw-bold">Email *</Form.Label>
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <FaEnvelope />
                </span>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="exemple@minader.cm"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3 col-md-6">
              <Form.Label className="fw-bold">Direction *</Form.Label>
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <FaBuilding />
                </span>
                <Form.Select
                  name="id_structure"
                  value={formData.id_structure}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                >
                  <option value="">Choisir...</option>
                  {DataStructure?.map((item) => (
                    <option key={item.id_structure} value={item.id_structure}>
                      {item.nom} — {item.definition}
                    </option>
                  ))}
                </Form.Select>
              </div>
            </Form.Group>
          </div>

          {/* Mots de passe */}
          <div className="row">
            {["pwd1", "pwd2"].map((field, idx) => (
              <Form.Group className="mb-3 col-md-6" key={field}>
                <Form.Label className="fw-bold">
                  {idx === 0 ? "Mot de passe *" : "Confirmer *"}
                </Form.Label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <FaLock />
                  </span>
                  <Form.Control
                    type="password"
                    name={field}
                    placeholder="********"
                    value={formData[field]}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                </div>
              </Form.Group>
            ))}
          </div>

          {/* Pièce jointe */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Justificatif / Pièce jointe</Form.Label>
            <div className="border rounded-3 p-3 text-center bg-light">
              <FaFileUpload size={24} className="text-primary mb-2" />
              <Form.Control
                type="file"
                multiple
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.docx"
                disabled={isLoading}
              />
              {files.length > 0 && (
                <ul className="list-unstyled mt-2 small text-muted">
                  {files.map((file, idx) => (
                    <li key={idx}>📎 {file.name}</li>
                  ))}
                </ul>
              )}
            </div>
          </Form.Group>

          {/* Barre de progression */}
          {isLoading && (
            <ProgressBar animated now={uploadProgress} className="mb-3" />
          )}

          {/* Bouton d'envoi */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            disabled={isLoading}
            type="submit"
            className="btn btn-primary w-100 py-2 fw-semibold shadow-sm"
          >
            {isLoading ? (
              <>
                <Spinner animation="border" size="sm" /> Envoi en cours...
              </>
            ) : (
              "Envoyer la demande"
            )}
          </motion.button>
        </Form>

        {/* Lien vers Login */}
        <div className="text-center mt-3">
          <small>
            Vous avez déjà un compte ?{" "}
            <NavLink to="/login" className="fw-bold text-decoration-none">
              Se connecter
            </NavLink>
          </small>
        </div>
      </motion.div>
    </div>
  );
}
