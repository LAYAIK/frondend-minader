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
  };
  export const miseAJourUtilisateur = async (id, payload) => {
      const response = await authAPI.miseAJourUtilisateur(id, payload);
      return response;
  }
export const createUtilisateur = async (payload) => {
      const response = await authAPI.createUtilisateur(payload);
      return response;
  }
export const createRoleScope = async ({id_scope, id_role}) => {
      const response = await authAPI.createRoleScope({id_scope, id_role});
      return response;
  }
export const deleteRoleScope = async ({id_scope, id_role}) => {
      const response = await authAPI.deleteRoleScope({id_scope, id_role});
      return response;
  }
export const listeRoles = async () =>{
  const res = await await authAPI.listeRoles();
  return res
}
export const listeScopes = async () =>{
  const res = await await authAPI.listeScopes();
  return res
}
export const listeRoleScopes = async () =>{
  const res = await await authAPI.listeRoleScopes();
  return res
}
  