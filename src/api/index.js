import axios from 'axios';

// Configuration de base d'Axios
const API_BASE_URL = 'http://localhost:3001/api'; // Remplacez par votre URL API
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },  
});

// Api pour le service de courrier
const api1 = axios.create({
  baseURL: 'http://localhost:3002/api',
  headers: {
    'Content-Type': 'application/json',
  },  
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Services d'authentification
export const authAPI = {
  // Connexion
  login: async (credentials) => {
    try {
      console.log("login credentials:",credentials);
      const response = await api.post('/login', credentials);
       console.log(response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Enregistrement du courrier
  registerCourrier: async (token, credentials, selectedFiles) => {
    try {
      console.log("registerCourrier credentials:",credentials);
      console.log("registerCourrier selectedFiles:",selectedFiles);
      const response = await api1.post('/couriers', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  // Récupération de la liste des courriers
  listeCourrier: async () => {
    try {
      const response = await api1.get('/couriers');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Déconnexion
  logout: async () => {
    try {
      const response = await api.post('/logout');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Vérification du token
  verifyToken: async (token) => {
    try {
      const response = await api.get('/verify', {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    console.log("verify token response:",response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // Récupération des données utilisateur
//   getUserProfile: async () => {
//     try {
//       const response = await api.get('/utilisateurs/:id');
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   }
 };

export default api;