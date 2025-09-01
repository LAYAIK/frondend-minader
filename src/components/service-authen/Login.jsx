import React from 'react'
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { NavLink, useNavigate } from 'react-router';

export default function Login() {

  const [credentials, setCredentials] = useState({
    adresse_email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  //const { login} = useContext(createContext());
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(credentials);
      console.log("login result :",result);
      
      if (result) {
        navigate('/home');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError(`Une erreur est survenue lors de la connexion: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="card p-4 shadow-sm login-card">
            <div className="text-center mb-4">
                <h1 className="h3 mb-4 text-uppercase fw-bold">TENA <span className="text-success">MAIL</span></h1>
                <h4 className="text-center mb-0 fw-bold">Connexion à Tena Mail</h4>
                <p className="text-muted small ">Système de gestion de courrier du MINADER</p>
            </div>
            <form  onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-bold">Email <span
                            className="text-danger fw-bold">*</span></label>
                    <input type="email" className="form-control" id="email" placeholder="user@minader.cm" onChange={handleChange} name="adresse_email" value={credentials.adresse_email} required disabled={isLoading}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label fw-bold">Mot de passe <span
                            className="text-danger fw-bold">*</span></label>
                    <input type="password" className="form-control" id="password" placeholder='********' onChange={handleChange} name="password" value={credentials.password} required disabled={isLoading}/>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="" id="rememberMe"/>
                        <label className="form-check-label" htmlFor="rememberMe">
                            Se souvenir de moi
                        </label>
                    </div>
                    <a href="#" className="text-decoration-none">Mot de passe oublié ?</a>
                </div>
                {error && <div className="error-message">{error}</div>}

                <button type="submit" className="btn btn-primary w-100 py-2" disabled={isLoading}>{isLoading ? 'Connexion...' : 'Se connecter'}</button>
            </form>

            <div className="text-center mt-4">
                Vous n'avez pas de compte ? <NavLink to="/register" className="text-decoration-none">Demander un accès</NavLink>
            </div>
        </div>
    </div>
  )
}
