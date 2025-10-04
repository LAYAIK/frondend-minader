import { useState, useEffect } from "react";
import axios from 'axios';

export const useDataStructure = () => {
    const [Data, setData] = useState([]);
    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/structures');
            setData(response.data);
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    return { DataStructure: Data};
};