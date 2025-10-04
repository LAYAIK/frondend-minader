
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { NavLink, useNavigate } from "react-router";
import { Alert, Button, Spinner } from "react-bootstrap";
import { FaEnvelope, FaLock } from "react-icons/fa";

export default function Login() {
  const [credentials, setCredentials] = useState({
    adresse_email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
 const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const result = await login(credentials);
      if (result) {
        navigate("/home");
      } else {
        setError(result.message || "Identifiants incorrects.");
        console.log(result.message);
        console.log(result);
        console.error(result);
      }
    } catch (error) {
      setError(
        `Une erreur est survenue lors de la connexion: ${error.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-gradient">
      <div className="card p-4 shadow-lg rounded-4 border-0 login-card">
        <div className="text-center mb-3">
          <h1 className="h3 fw-bold text-uppercase">
            TENA <span className="text-success">MAIL</span>
          </h1>
          <h4 className="fw-bold mb-1">Bienvenue 👋</h4>
          <p className="text-muted small">
            Connectez-vous pour accéder à la plateforme
          </p>
        </div>
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
                onChange={handleChange}
                name="adresse_email"
                value={credentials.adresse_email}
                required
                disabled={isLoading}
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
                onChange={handleChange}
                name="password"
                value={credentials.password}
                required
                disabled={isLoading}
                />
            </div>
          </div>

          {/* Remember me + Mot de passe oublié */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="rememberMe"
              />
              <label className="form-check-label small" htmlFor="rememberMe">
                Se souvenir de moi
              </label>
            </div>
            <a href="#" className="text-decoration-none small">
              Mot de passe oublié ?
            </a>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          {/* Submit button */}
          <Button
            type="submit"
            className="btn btn-primary w-100 py-2 fw-semibold"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner animation="border" size="sm" /> Connexion...
              </>
            ) : (
              "Se connecter"
            )}
          </Button>
        </form>

        <div className="text-center mt-3">
          <small>
            Vous n'avez pas de compte ?{" "}
            <NavLink to="/register" className="text-decoration-none fw-bold">
              Demander un accès
            </NavLink>
          </small>
        </div>
      </div>
    </div>
  );
}
