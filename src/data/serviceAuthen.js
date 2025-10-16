import { useState, useEffect } from 'react';
import { authAPI } from '../api/index.js';

export const useDataUtilisateur = () => {
    const [Data, setData] = useState({});
    const fetchData = async () => {
        try {
            const response = await authAPI.listeUtilisateur();
            setData(response);
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    return { DataUtilisateur: Data};
};
export const useDataRole = () => {
    const [Data, setData] = useState([]);
    const fetchData = async () => {
        try {
            const response = await authAPI.listeRoles();
            setData(response.data);
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    return { DataRole: Data};
};

export const useDataScope = () => {
    const [Data, setData] = useState([]);
    const fetchData = async () => {
        try {
            const response = await authAPI.listeScopes();
            setData(response.data);
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    return { DataScope: Data};
};
export const useDataRoleScope = () => {
    const [Data, setData] = useState([]);
    const fetchData = async () => {
        try {
            const response = await authAPI.listeRoleScopes();
            setData(response.data);
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    return { DataRoleScope: Data};
};

