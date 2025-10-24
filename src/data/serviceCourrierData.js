import { useState, useEffect } from 'react';
import { listeCourrier,typeCourrier ,listeDocument, listeHistorique} from '../actions/Courrier';

export const useDataTypeCourrier = () => {
    const [Data, setData] = useState([]);

    const fetchData = async () => {

        try {
            const response = await typeCourrier();
            setData(response);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { DataTypeCourrier: Data};
};

export const useDataCourrier = () => {
    const [Data, setData] = useState([]);
    const fetchData = async () => {
        try {
            const response = await listeCourrier();
            setData(response);
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    return { DataCourrier: Data};
};

export const useDataDocument = () => {
    const [Data, setData] = useState([]);
    const fetchData = async () => {
        try {
            const response = await listeDocument();
            setData(response);
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    return { DataDocument: Data};
};

export const useDataHistoriqueCourrier = () => {
    const [Data, setData] = useState([]);

    const fetchData = async () => {

        try {
            const response = await listeHistorique();
            setData(response);
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    return { DataHistoriqueCourrier: Data};
}