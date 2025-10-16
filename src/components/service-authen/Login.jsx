import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { NavLink, useNavigate } from "react-router";
import { Alert, Button, Spinner } from "react-bootstrap";
import { FaEnvelope, FaLock } from "react-icons/fa";

export default function Login() {
  const [credentials, setCredentials] = useState({
    adresse_email: "",
    password: "",
  });
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // 🔄 Supprime automatiquement les alertes après 5 secondes
  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => setAlert({ type: "", message: "" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setAlert({ type: "", message: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert({ type: "", message: "" });

    try {
      if (!credentials.adresse_email || !credentials.password) {
        throw new Error("Veuillez remplir tous les champs.");
      }

      const resul = await login(credentials);

      if(resul.success === false){
       setAlert( {type: "danger", message: "Les identifiants sont incorrect ou compte inactive"})
      }else{
        setAlert({ type: "success", message: "Connexion réussie 🎉" });
      }

      // Redirection après un court délai
      setTimeout(() => navigate("/home"), 2000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.statusText ||
        err.message ||
        "Une erreur inconnue est survenue.";

      setAlert({ type: "danger", message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100 bg-light"
      style={{
        background: "linear-gradient(135deg, #e3f2fd, #f1f8e9)",
      }}
    >
      <div className="card p-4 shadow-lg rounded-4 border-0 login-card"
        style={{ width: "100%", maxWidth: "420px" }}
      >
        <div className="text-center mb-3">
          <h1 className="h3 fw-bold text-uppercase mb-0">
            TENA <span className="text-success">MAIL</span>
          </h1>
          <h4 className="fw-bold mt-2">Bienvenue 👋</h4>
          <p className="text-muted small">
            Connectez-vous pour accéder à la plateforme
          </p>
        </div>

        {/* ---------- ALERTES ---------- */}
        {alert.message && (
          <Alert
            variant={alert.type}
            className="fade show text-center fw-semibold"
          >
            {alert.message}
          </Alert>
        )}

        {/* ---------- FORMULAIRE ---------- */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-semibold">
              Email <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <FaEnvelope />
              </span>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="user@minader.cm"
                name="adresse_email"
                value={credentials.adresse_email}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-semibold">
              Mot de passe <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <FaLock />
              </span>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="********"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          {/* Options */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="rememberMe" />
              <label className="form-check-label small" htmlFor="rememberMe">
                Se souvenir de moi
              </label>
            </div>
            <a href="#" className="text-decoration-none small text-primary">
              Mot de passe oublié ?
            </a>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="btn btn-success w-100 py-2 fw-semibold shadow-sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" /> Connexion...
              </>
            ) : (
              "Se connecter"
            )}
          </Button>
        </form>

        {/* Lien inscription */}
        <div className="text-center mt-3">
          <small>
            Vous n'avez pas de compte ?{" "}
            <NavLink to="/register" className="text-decoration-none fw-bold text-success">
              Demander un accès
            </NavLink>
          </small>
        </div>
      </div>
    </div>
  );
}
