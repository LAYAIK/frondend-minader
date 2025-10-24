import { authAPI } from "../api/index.js";

export const listeNotes = async () => {
    const token = localStorage.getItem('token');
    console.log(token)
    const response = await authAPI.listeNotes()
    return response;
};
export const listeStatuses = async () => {
    const token = localStorage.getItem('token');
    console.log(token)
    const response = await authAPI.listeStatuses()
    return response;
};
export const listePriorites = async () => {
    const token = localStorage.getItem('token');
    console.log(token)
    const response = await authAPI.listePriorites()
    return response;
};
export const listeObjets = async () => {
    const token = localStorage.getItem('token');
    console.log(token)
    const response = await authAPI.listeObjets()
    return response;
};

export const createObjet = async ({libelle}) => {
    const token = localStorage.getItem('token');
    console.log(token)
    const response = await authAPI.createObjet({libelle})
    return response;
};