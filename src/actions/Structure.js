import React from 'react';
import { authAPI } from '../api/index.js';



export const listeStructure = async () => {
      const token = localStorage.getItem('token');
      const response = await authAPI.listeStructure(token);
      return response;
  };

export const registerStructure = async (payload) => {
      const token = localStorage.getItem('token');
      const response = await authAPI.registerStructure(payload, token);
      return response;
  };  

export const getByIdStructure = async (id) => {
      const token = localStorage.getItem('token');
      const response = await authAPI.getByIdStructure(id, token);
      return response;
  };

export const suppressionStructure = async (id, payload) => {
      const response = await authAPI.suppressionStructure(id, payload);
      return response;
  };