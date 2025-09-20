import { useState, useEffect } from 'react';
import axios from 'axios';

export const useDataTypeCourrier = () => {
    const [Data, setData] = useState([]);

    const fetchData = async () => {

        try {
            const response = await axios.get('http://localhost:3002/api/typecourriers');
            setData(response.data);
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
            const response = await axios.get('http://localhost:3002/api/couriers');
            setData(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { DataCourrier: Data};
};

export const useDataHistoriqueCourrier = () => {
    const [Data, setData] = useState([]);

    const fetchData = async () => {

        try {
            const response = await axios.get('http://localhost:3002/api/getAllHistoriqueCourriers');
            setData(response.data);
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    return { DataHistoriqueCourrier: Data};
}