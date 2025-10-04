import { useState, useEffect } from 'react';
import axios from 'axios';

export const useDataUtilisateur = () => {
    const [Data, setData] = useState({});
    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/utilisateurs');
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