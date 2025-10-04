import { authAPI } from '../api/index.js';

export const listeUtilisateur = async () => {
      const token = localStorage.getItem('token');
      const response = await authAPI.listeUtilisateur(token);
      return response;
  };

export const getByIdUtilisateur = async (id) => {
      const token = localStorage.getItem('token');
      const response = await authAPI.getByIdUtilisateur(id, token);
      return response;
  };
export const suppressionUtilisateur = async (id, payload) => {
      const response = await authAPI.suppressionUtilisateur(id, payload);
      return response;
  }