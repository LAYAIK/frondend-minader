import { useState, useEffect } from 'react';
import axios from 'axios';

export const useDataObjet = () => {
    const [Data, setData] = useState([]);

    const fetchData = async () => {

        try {
            const response = await axios.get('http://localhost:3005/api/objets');
            setData(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { DataObjet: Data};
};
export const useDataPriorite = () => {
    const [Data, setData] = useState([]);;

    const fetchData = async () => {

        try {
            const response = await axios.get('http://localhost:3005/api/priorites');
            setData(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { DataPriorite : Data};
};
export const useDataStatus = () => {
    const [Data, setData] = useState([]);

    const fetchData = async () => {

        try {
            const response = await axios.get('http://localhost:3005/api/statuses');
            setData(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { DataStatus: Data };
};
export const useDataNote = () => {
    const [Data, setData] = useState([]);

    const fetchData = async () => {

        try {
            const response = await axios.get('http://localhost:3005/api/notes');
            setData(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { DataNote: Data };
};