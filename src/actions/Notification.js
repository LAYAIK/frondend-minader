import React from 'react';
import { authAPI } from '../api/index.js';


export const notifyUser = async (data) => {
      const response = await authAPI.notifyUser(data);
      return response;
  };
export const getGroups = async () => {
    const response = await authAPI.getGroups();
    return response;
};

export const createGroup = async (data) => {
    const response = await authAPI.createGroup(data);
    return response;
};
export const listeMessageGroup = async (id) => {
    const response = await authAPI.listeMessageGroup(id);
    return response;
};
export const createMessage = async (data) => {
    const response = await authAPI.createMessage(data);
    return response;
};