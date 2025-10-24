import { useState, useEffect } from 'react';
import { listeNotes,listeObjets,listePriorites,listeStatuses } from '../actions/Autres';

export const useDataObjet = () => {
    const [Data, setData] = useState([]);

    const fetchData = async () => {

        try {
            const response = await listeObjets();
            setData(response);
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
            const response = await listePriorites();
            setData(response);
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
            const response = await listeStatuses();
            setData(response);
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
            const response = await listeNotes();
            setData(response);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { DataNote: Data };
};