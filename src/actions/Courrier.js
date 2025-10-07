import React from 'react';
import { authAPI } from '../api/index.js';
import { useState, useEffect } from 'react'

export const registerCourrier = async (formData) => {

      const token = localStorage.getItem('token');
      const response = await authAPI.registerCourrier(formData, token);
      return response;
  };

export const listeCourrier = async () => {
      const token = localStorage.getItem('token');
      const response = await authAPI.listeCourrier(token);
      return response;
  };
export const listeArchive = async () => {
      const token = localStorage.getItem('token');
      const response = await authAPI.listeArchive(token);
      return response;
  };

export const detailCourrier = async (id) => {
      const token = localStorage.getItem('token');
      const response = await authAPI.detailCourrier(token, id);
      return response;
  };
  
export const miseAJourCourrier = async (id, updatedData) => {
      const token = localStorage.getItem('token');
      const response = await authAPI.miseAJourCourrier(id, updatedData, token);
      return response;
  };

export const suppressionCourrier = async (id, payload) => {
      const token = localStorage.getItem('token');
      const response = await authAPI.suppressionCourrier(id,payload, token);
      return response;
  };

export const rechercheCourrier = async (query) => {
      const token = localStorage.getItem('token');
      const response = await authAPI.rechercheCourrier(token, query);
      return response;
  };
export const transfertCourier = async (id, formData) => {
    const response = await authAPI.transfertCourier(id, formData)
    return response;
  };

export const getByIdCourrier = async (id) => {
    const token = localStorage.getItem('token');
    const response = await authAPI.getByIdCourrier(id, token)
    return response;
  };

export const getByIdDocument = async (id) => {
    const token = localStorage.getItem('token');
    const response = await authAPI.getByIdDocument(id, token)
    return response;
  };

export const deleteDocument = async (id) => {
    const token = localStorage.getItem('token');
    const response = await authAPI.deleteDocument(id, token)
    return response;
  }

export const useCourrierEntrant = (data) => {
  const id_courrier_entrant = '4cd78808-7d9b-4853-ac54-caefbf8da671';
  const [dataEntrant, setDataEntrant] = useState([]);

  useEffect(() => {
    const filtered = data
      .filter(dat => dat.id_type_courrier === id_courrier_entrant)
      .map(dat => dat.id_courrier);
    setDataEntrant(filtered);
  }, [data]);

  return dataEntrant;
};

export const createCourrierArchive = async (formDataPayload) => {

      const token = localStorage.getItem('token');
      const response = await authAPI.createCourrierArchive(formDataPayload, token);
      return response;
  };
