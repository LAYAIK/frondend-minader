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

//Api pour le service des notification et chat
const api4 = axios.create({
  baseURL: 'http://localhost:3003/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
// // Api pour le service des autres
const api3 = axios.create({
  baseURL: 'http://localhost:8000/api',
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
  registerCourrier: async (formData) => {
    try {
    const response = await api1.post('/couriers', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  createCourrierArchive: async (formDataPayload) => {
    try {
    const response = await api1.post('/archives', formDataPayload, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }, 
  
  registerStructure: async (payload) => {
    try {
    const response = await api3.post('/structures/', payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }, 

  transfertCourier: async (id, formData) => {
    try {
      const response = await api1.put(`/couriers/${id}/transfert`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        }
      });
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
  listeStructure: async () => {
    try {
      const response = await api3.get('/structures');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  listeUtilisateur: async () => {
    try {
      const response = await api.get('/utilisateurs');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }, 
  listeArchive: async () => {
    try {
      const response = await api1.get('/archives');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },  
  suppressionCourrier: async (id_courrier, payload) => {
    try {
      console.log('id :', id_courrier)
      const response = await api1.delete(`/couriers/${id_courrier}`, {data: payload });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },  
  suppressionUtilisateur: async (id, payload) => {
    try {
      const response = await api.delete(`/utilisateurs/${id}`, {data: payload });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  suppressionStructure: async (id_structure, payload) => {
    try {
      console.log('id :', id_structure)
      const response = await api3.delete(`/structures/${id_structure}/`, {data: payload });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  getByIdStructure: async (id) => {
    try {
      const response = await api3.get(`/structures/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  getByIdCourrier: async (id) => {
    try {
      const response = await api1.get(`/couriers/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getByIdDocument: async (id) => {
    try {
      const response = await api1.get(`/documents/${id}`,{ responseType: "blob",});
      console.log("getByIdDocument response:",response);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  miseAJourCourrier: async (id, formData) => {
    try {
      const response = await api1.put(`/couriers/${id}`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  notifyUser: async (data) => {
    try {
    const response = await api4.post('/notifications/notifyUser', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteDocument: async (id) => {
    try {
      const response = await api1.delete(`/documents/${id}`);
      return response;
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
  },
  getGroups: async () => {
    try {
    const response = await api4.get('/groups/listeGroups');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  createGroup: async (data) => {
    try {
    const response = await api4.post('/groups/create_group' , data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  listeMessageGroup: async (id) => {
    try {
    const response = await api4.get(`/messages/list_messages_for_group/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  createMessage: async (data) => {
    try {
    const response = await api4.post("/messages/create_message", data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
}


export default api;