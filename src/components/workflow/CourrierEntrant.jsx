// src/components/CourrierEntrants.jsx
import React, { useState, useEffect } from 'react';
import { Table, Alert, InputGroup, FormControl, Button, Spinner,Card } from 'react-bootstrap';
import { useDataObjet, } from '../../data/serviceAutreData';
import { useDataStructure } from '../../data/serviceStructurePerso';
import { useDataUtilisateur } from '../../data/serviceAuthen';
import { useDataCourrier, useDataHistoriqueCourrier } from '../../data/serviceCourrierData';
import { useNavigate } from 'react-router';


// Nouveau composant pour afficher le workflow
const CourrierWorkflow = ({ courrierId }) => {
    const [historique, setHistorique] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { DataHistoriqueCourrier } = useDataHistoriqueCourrier();
    const { DataUtilisateur } = useDataUtilisateur();
    const { DataStructure } = useDataStructure();

    console.log('data structure 1', DataStructure.data);


    React.useEffect(() => {
        const fetchHistorique = async () => {
            if (!courrierId) return; // Ne fait rien si l'ID est null
            setLoading(true);
            try {
                if (Array.isArray(DataHistoriqueCourrier)){

                    const filtered = DataHistoriqueCourrier
                        .filter(dat => dat.id_courrier === courrierId)
                        .map(dat => dat);
                         setHistorique(filtered);
                }
                setLoading(false);
            } catch (err) {
                setError("Erreur lors de la récupération de l'historique.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistorique();
    }, [DataHistoriqueCourrier, courrierId]);

    if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement du workflow...</span>
        </Spinner>
      </div>
    );
  }
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Card className="mt-3">
            <Card.Body>
                <Card.Title>Workflow du Courrier - {courrierId}</Card.Title>
                <ul className="list-group">
                    {historique.map(etape => (
                        <li key={etape.id} className="list-group-item">
                            <strong>{etape.action}</strong> par { DataUtilisateur.data?.find(user => user.id_utilisateur === etape.id_utilisateur)?.noms || ""
                             } { DataUtilisateur.data?.find(user => user.id_utilisateur === etape.id_utilisateur)?.prenoms || ""
                             } de la { DataStructure.data?.find(s => s.id_structure === etape.id_structure)?.nom || "..."
                             } vers { DataStructure.data?.find(structure => structure.id_structure === etape.id_structure_destination)?.nom || "..."
                             } le {new Date(etape.date_historique).toLocaleString()}
                            {etape.note && <p className="mb-0 text-muted">{etape.note}</p>}
                        </li>
                    ))}
                </ul>
            </Card.Body>
        </Card>
    );
};






const CourrierEntrant = () => {
    const { DataCourrier } = useDataCourrier();
    const [courriers, setCourriers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { DataObjet } = useDataObjet();
    const navigate = useNavigate();
    const [selectedCourrierId, setSelectedCourrierId] = useState(null);

    useEffect(() => {
        const fetchCourriers = async () => {
         const id_courrier_entrant = '4cd78808-7d9b-4853-ac54-caefbf8da671';
            try {
                if (Array.isArray(DataCourrier)){

                    const filtered = DataCourrier
                        .filter(dat => dat.id_type_courrier === id_courrier_entrant)
                        .map(dat => dat.id_courrier);
                         setCourriers(filtered);
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
    }, [DataCourrier]);  

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
    const handleWorckflow = async (id) => {
            setSelectedCourrierId(selectedCourrierId === id ? null : id);
    };

    return (
        <>
        <div className="liste-courriers-container mt-4 container-fluid">
            <h2>Les courriers entrant</h2>
            <InputGroup> 
                <FormControl placeholder="Rechercher..." 
                onChange={(e) => console.log(e.target.value)} />
            </InputGroup>
            <Table striped bordered hover responsive className="mt-1 ">
                <thead>
                    <tr>
                        <th>N°</th>
                        <th>Référence  Courrier</th>
                        <th>Objet</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {courriers.length > 0 ? (
                        courriers.map((courrier, index) => (
                            <React.Fragment key={courrier}>
                            <tr key={courrier}>
                                <td>{index + 1}</td>
                                <td>{DataCourrier.find(i => i.id_courrier === courrier)?.reference_courrier || courrier}</td>
                                <td>{DataObjet.find(o => o.id_objet === DataCourrier.find(t => t.id_courrier === courrier)?.id_objet)?.libelle || DataObjet.find(o => o.id_objet === courrier)?.libelle || courrier}</td>
                                <td>
                                    <Button variant="primary" onClick={()=> handleWorckflow(courrier)}>Workflow</Button>
                                </td>
                            </tr>
                            {selectedCourrierId === courrier && (
                                    <tr>
                                        <td colSpan="4">
                                            <CourrierWorkflow courrierId={courrier} />
                                        </td>
                                    </tr>
                                )}
                                </React.Fragment>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">Aucun courrier trouvé.</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        <Button variant='secondary' onClick={() => navigate('/workflow')}> Retour</Button>
        </div>
        </>
    );
};

export default CourrierEntrant;