import { useState, useEffect } from "react";
import { listeStructure } from "../actions/Structure";

export const useDataStructure = () => {
    const [Data, setData] = useState([]);
    const fetchData = async () => {
        try {
            const response = await listeStructure();
            setData(response);
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    return { DataStructure: Data};
};