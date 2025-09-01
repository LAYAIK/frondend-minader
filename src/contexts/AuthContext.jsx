import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../api/index.js';
import { registerCourrier, miseAJourCourrier, suppressionCourrier, telechargementPieceJointe, listeStatistiques ,
  listeCourrier, detailCourrier, rechercheCourrier
} from '../actions/Courrier.js';

const AuthContext = createContext();
//export default AuthContext;

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      if (token && user) {
        // Vérifier si le token est toujours valide
        const isValid = await authAPI.verifyToken(token);
        if (isValid.valid) {
          setUser(JSON.parse(user));
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    } catch (error) {
      console.error('Erreur de vérification du token:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authAPI.login(credentials);
      
      if (response.success && response.data) {
        const user = response.data;
        const token = response.token;

        console.log('Token reçu:', token);
        console.log('Données utilisateur reçues:', user);
        
        localStorage.setItem('token', token); 
        localStorage.setItem('user', JSON.stringify(user));
        
        setUser(user);
        setIsAuthenticated(true);
        
        return { success: true, message: 'Connexion réussie' };
      } else {
        return { success: false, message: response.message || 'Erreur de connexion' };
      }
    } catch (error) {
      const message = error.message || 'Erreur de connexion';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    checkAuth,
    registerCourrier,
    miseAJourCourrier,
    suppressionCourrier,
    telechargementPieceJointe,
    listeStatistiques,
    listeCourrier,    
    detailCourrier,
    rechercheCourrier
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};