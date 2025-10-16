import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../api/index.js';
import { registerCourrier, listeCourrier, transfertCourier, listeArchive} from '../actions/Courrier.js';
import { listeStructure, registerStructure } from '../actions/Structure.js';
import { listeUtilisateur, createUtilisateur } from '../actions/Utilisateur.js';

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
          localStorage.removeItem('scopeIds');
        }
      }
    } catch (error) {
      console.error('Erreur de vérification du token:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('scopeIds');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      
      if (response.success && response.data) {
        const user = response.data;
        const token = response.token;
        // Normalize response.scopeIds into an array (table) and stringify for storage
        let scopeIds = response.scopeIds ?? [];
        if (typeof scopeIds === 'string') {
          try {
            scopeIds = JSON.parse(scopeIds);
          } catch {
            scopeIds = scopeIds.split(',').map(s => s.trim()).filter(Boolean);
          }
        }
        if (!Array.isArray(scopeIds)) {
          scopeIds = [scopeIds];
        }
        // Convert numeric strings to numbers
        scopeIds = scopeIds.map(id => (typeof id === 'string' && /^\d+$/.test(id) ? Number(id) : id));
        // Save as JSON so the table (array) structure is preserved in localStorage
        scopeIds = JSON.stringify(scopeIds);
        
        localStorage.setItem('scopeIds', scopeIds);
        localStorage.setItem('token', token); 
        localStorage.setItem('user', JSON.stringify(user));
        
        setUser(user);
        setIsAuthenticated(true);
        
        return { success: true, message: 'Connexion réussie' };
      } else {

        console.log('Réponse de connexion:', response);
        console.log('Token reçu:', response.message);

        return { success: false, message: response.message || 'Erreur de connexion' };
      }
    } catch (error) {
      const message = error.message || 'Erreur de connexion';
      return { success: false, message };
    };
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('scopeIds');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,isAuthenticated,loading,
    login,logout,checkAuth,listeUtilisateur,createUtilisateur,
    registerCourrier,listeCourrier,transfertCourier,listeArchive,
    listeStructure,registerStructure,


  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};