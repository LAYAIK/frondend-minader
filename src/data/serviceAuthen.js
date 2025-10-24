import { useState, useEffect } from 'react';
import { listeUtilisateur, listeRoleScopes, listeRoles,listeScopes } from '../actions/Utilisateur';

export const useDataUtilisateur = () => {
    const [Data, setData] = useState({});
    const fetchData = async () => {
        try {
            const response = await listeUtilisateur();
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
            const response = await listeRoles();
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
            const response = await listeScopes();
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
            const response = await listeRoleScopes();
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

