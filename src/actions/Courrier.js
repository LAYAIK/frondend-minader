import React from 'react';
import { authAPI } from '../api/index.js';

export const registerCourrier = async (credentials, selectedFiles) => {
      const token = localStorage.getItem('token');
      const response = await authAPI.registerCourrier(token, credentials, selectedFiles);
      return response;
  };

export const listeCourrier = async () => {
      const token = localStorage.getItem('token');
      const response = await authAPI.listeCourrier(token);
      return response;
  };

export const detailCourrier = async (id) => {
      const token = localStorage.getItem('token');
      const response = await authAPI.detailCourrier(token, id);
      return response;
  };
  
export const miseAJourCourrier = async (id, updatedData) => {
      const token = localStorage.getItem('token');
      const response = await authAPI.miseAJourCourrier(token, id, updatedData);
      return response;
  };

export const suppressionCourrier = async (id) => {
      const token = localStorage.getItem('token');
      const response = await authAPI.suppressionCourrier(token, id);
      return response;
  };

export const rechercheCourrier = async (query) => {
      const token = localStorage.getItem('token');
      const response = await authAPI.rechercheCourrier(token, query);
      return response;
  };

export const telechargementPieceJointe = async (fileId) => {
      const token = localStorage.getItem('token');
      const response = await authAPI.telechargementPieceJointe(token, fileId);
      return response;
  };

export const listeStatistiques = async () => {
      const token = localStorage.getItem('token');
      const response = await authAPI.listeStatistiques(token);
      return response;
  };

