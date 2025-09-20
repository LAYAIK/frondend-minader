// src/components/ListeCourriers.jsx
import React, { useState, useEffect } from 'react';
import { Table, Alert, InputGroup, FormControl, Button, Spinner } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { useDataObjet, useDataPriorite, useDataStatus } from '../../data/serviceAutreData';
import { useDataTypeCourrier } from '../../data/serviceCourrierData';
import { getByIdCourrier, suppressionCourrier } from '../../actions/Courrier';
import { useNavigate } from 'react-router';




const ListeCourrier = () => {
    const [courriers, setCourriers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { listeCourrier } = useAuth();
    const { DataObjet } = useDataObjet();
    const { DataPriorite} = useDataPriorite();
    const { DataStatus } = useDataStatus();
    const { DataTypeCourrier } = useDataTypeCourrier();
    const navigate = useNavigate();

    const objet = DataObjet;
    const priorite = DataPriorite;
    const status = DataStatus;
    const typecourrier = DataTypeCourrier;

    useEffect(() => {
        const fetchCourriers = async () => {
            try {
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
    }, [listeCourrier]);  

    if (loading) {
     return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
      </div>
     );
    };

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    };

    const handleDelete = async (id) =>{
        const userConfirmed = window.confirm("Etes-vous sur de vouloir supprimer cet element ?");
      if(userConfirmed) {
        const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
          try {
              
            const result = await getByIdCourrier(id);
            if(!result){
                console.error('Echec de la suppression  sur le serveur')
                return;
            }
            let payload = {
                id_courrier: result.id_courrier,
                id_objet: result.id_objet,
                id_utilisateur: user.id_utilisateur,
                reference_courrier: result.reference_courrier,
                id_type_courrier: result.id_type_courrier
            };
              const resultat = await suppressionCourrier(id, payload);
              if(resultat) {
                  const newListe = courriers.filter(element => element.id_courrier !== id);
                  setCourriers(newListe);
                }else{
                    console.error('Echec de la suppression  sur le serveur')
                }
            } catch (error) {
                console.error('Erreur lors de la supression :', error)
            }
        }

    };
    const handleUpdate = async (id) => {
        const userConfirmed = window.confirm("Etes-vous sur de vouloir modifier cet element ?");
        if(userConfirmed){
            navigate(`/modifier-courrier/${id}`);
        } 
    };
    const handleTransfer = async (id) => {
        const userConfirmed = window.confirm("Etes-vous sur de vouloir transferer cet element ?");
        if(userConfirmed){
            navigate(`/transfert-courrier/${id}`);
        } 
    };
    const handleDetails = async () => {
        const userConfirmed = window.confirm("Voulez-vous voir les details de cet element ?");
        if(userConfirmed){
           //logique............
        } 
    };

    return (
        <div className="liste-courriers-container mt-4 container-fluid">
            <h2>Liste des courriers</h2>
            <InputGroup> 
                <FormControl placeholder="Rechercher..." 
                onChange={(e) => console.log(e.target.value)} />
            </InputGroup>
            <Table striped bordered hover responsive className="mt-1 ">
                <thead>
                    <tr>
                        <th>N°</th>
                        <th>Référence</th>
                        <th>Objet</th>
                        <th>Status</th>
                        <th>Niveau de Priorite</th>
                        <th>Type de Courrier</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {courriers.length > 0 ? (
                        courriers.map((courrier, index) => (
                            <tr key={courrier.id_courrier}>
                                <td>{index + 1}</td>
                                <td>{courrier.reference_courrier}</td>
                                <td>{objet.find(o => o.id_objet === courrier.id_objet)?.libelle || courrier.id_objet}</td>
                                <td>{status.find(s => s.id_status === courrier.id_status)?.libelle || courrier.id_status}</td>
                                <td>{priorite.find(p => p.id_priorite === courrier.id_priorite)?.niveau || courrier.id_priorite}</td>
                                <td>{typecourrier.find(t => t.id_type_courrier === courrier.id_type_courrier)?.type || courrier.id_type_courrier}</td>
                                <td>
                                    <Button variant="primary" onClick={()=> handleDetails(courrier.id_courrier)}>Voir details</Button>
                                    <Button variant="secondary" onClick={()=> handleTransfer(courrier.id_courrier)}>Transferer</Button>
                                    <Button variant="warning" onClick={()=> handleUpdate(courrier.id_courrier)} className="ms-2">Modifier</Button>
                                    <Button variant="danger" onClick={()=> handleDelete(courrier.id_courrier)}>Supprimer</Button>
                                </td>
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
