// src/components/ListeCourriers.jsx
import React, { useState, useEffect } from 'react';
import { Table, Alert, InputGroup, FormControl } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';

const ListeCourrier = () => {
    const [courriers, setCourriers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { listeCourrier } = useAuth();
    const [recherche, setRecherche] = useState('');

    useEffect(() => {
        const fetchCourriers = async () => {
            try {
                // Remplacez cette URL par l'URL de votre API
                const response = await listeCourrier();
                if (Array.isArray(response)) {
                  setCourriers(response);
                  console.log("Courriers fetched:", response);
                } else {
                  // Si l'API ne renvoie pas un tableau, traitez le cas
                  setCourriers([]);
                  console.error("Données de courrier inattendues:", response);
                }
                setLoading(false);
            } catch (err) {
                setError('Impossible de charger les courriers. Veuillez réessayer plus tard.');
                setCourriers([]);
                setLoading(false);
                console.error("Erreur lors de la récupération des courriers:", err);
            }
        };
        fetchCourriers();
    }, [ listeCourrier ]);

       // Fonction de filtrage des courriers
    // const courriersFiltres = courriers.filter(courrier => {
    //     // La recherche est insensible à la casse
    //     return (
    //         courrier.reference_courrier.toLowerCase().includes(recherche.toLowerCase()) ||
    //         courrier.objet_courrier.toLowerCase().includes(recherche.toLowerCase()) ||
    //         courrier.source_courrier.toLowerCase().includes(recherche.toLowerCase())
    //     );
    // });

    if (loading) {
        return <p>Chargement des courriers...</p>;
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <div className="liste-courriers-container mt-4">
            <h2>Liste des courriers</h2>
            <InputGroup> 
                <FormControl placeholder="Rechercher..." 
                onChange={(e) => setRecherche(e.target.value)} />
            </InputGroup>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Référence</th>
                        <th>Objet</th>
                        <th>Source</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {courriers.length > 0 ? (
                        courriers.map((courrier, index) => (
                            <tr key={courrier.id}>
                                <td>{index + 1}</td>
                                <td>{courrier.reference_courrier}</td>
                                <td>{courrier.objet_courrier}</td>
                                <td>{courrier.source_courrier}</td>
                                <td>{new Date(courrier.date_courrier).toLocaleDateString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">Aucun courrier trouvé.</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default ListeCourrier;
