import React, { useState } from "react";
import { NavLink } from "react-router";
import { FaUser, FaEnvelope, FaBuilding, FaBriefcase, FaRegCommentDots } from "react-icons/fa";
import { Spinner, Alert } from "react-bootstrap";

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    setTimeout(() => {
      setIsLoading(false);
      setSuccess("Votre demande a été envoyée avec succès ✅");
    }, 2000);
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-gradient">
      <div className="card p-4 shadow-lg rounded-4 border-0 access-request-card">
        <div className="text-center mb-4">
          <h1 className="h3 mb-2 text-uppercase fw-bold">
            TENA <span className="text-success">MAIL</span>
          </h1>
          <h4 className="fw-bold">Demande d'accès</h4>
          <p className="text-muted small">
            Remplissez ce formulaire pour demander un accès à la plateforme.
          </p>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <form onSubmit={handleSubmit}>
          {/* Nom complet */}
          <div className="mb-3">
            <label htmlFor="fullName" className="form-label fw-semibold">
              Nom complet <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <FaUser />
              </span>
              <input
                type="text"
                className="form-control"
                id="fullName"
                placeholder="Entrez votre nom complet"
                required
              />
            </div>
          </div>

          {/* Email professionnel */}
          <div className="mb-3">
            <label htmlFor="professionalEmail" className="form-label fw-semibold">
              Email professionnel <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <FaEnvelope />
              </span>
              <input
                type="email"
                className="form-control"
                id="professionalEmail"
                placeholder="exemple@minader.cm"
                required
              />
            </div>
          </div>

          {/* Direction */}
          <div className="mb-3">
            <label htmlFor="direction" className="form-label fw-semibold">
              Direction <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <FaBuilding />
              </span>
              <select className="form-select" id="direction" required>
                <option value="">Sélectionner une option</option>
                <option>Direction Générale</option>
                <option>Département Commercial</option>
                <option>Département Finance</option>
                <option>Service Informatique</option>
              </select>
            </div>
          </div>

          {/* Poste */}
          <div className="mb-3">
            <label htmlFor="position" className="form-label fw-semibold">
              Poste / Fonction <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <FaBriefcase />
              </span>
              <input
                type="text"
                className="form-control"
                id="position"
                placeholder="Directeur, Chef de service, etc."
                required
              />
            </div>
          </div>

          {/* Justification */}
          <div className="mb-3">
            <label htmlFor="justification" className="form-label fw-semibold">
              Justification de la demande <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <FaRegCommentDots />
              </span>
              <textarea
                className="form-control"
                id="justification"
                rows="3"
                placeholder="Expliquez brièvement pourquoi vous avez besoin d'un accès"
                required
              ></textarea>
            </div>
          </div>

          {/* Bouton */}
          <button
            type="submit"
            className="btn btn-primary w-100 py-2 fw-semibold"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner animation="border" size="sm" /> Envoi en cours...
              </>
            ) : (
              "Envoyer la demande"
            )}
          </button>
        </form>

        <div className="text-center mt-3">
          <small>
            Vous avez déjà un compte ?{" "}
            <NavLink to="/login" className="text-decoration-none fw-bold">
              Se connecter
            </NavLink>
          </small>
        </div>
      </div>
    </div>
  );
}
