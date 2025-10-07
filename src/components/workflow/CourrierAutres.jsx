// src/components/CourrierEntrants.jsx
import React, { useState, useEffect } from 'react';
import { Table, Alert, InputGroup, FormControl, Button, Spinner,Card } from 'react-bootstrap';
import { useDataObjet, } from '../../data/serviceAutreData';
import { useDataStructure } from '../../data/serviceStructurePerso';
import { useDataUtilisateur } from '../../data/serviceAuthen';
import {  useDataHistoriqueCourrier } from '../../data/serviceCourrierData';
import { useNavigate } from 'react-router';


// Nouveau composant pour afficher le workflow
const CourrierWorkflow = ({ id_historique }) => {
    const [historique, setHistorique] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { DataHistoriqueCourrier } = useDataHistoriqueCourrier();
    const { DataUtilisateur } = useDataUtilisateur();
    const { DataStructure } = useDataStructure();

    useEffect(() => {
        const fetchHistorique = async () => {
            if (!id_historique) return; // Ne fait rien si l'ID est null
            setLoading(true);
            try {
                if (Array.isArray(DataHistoriqueCourrier)){

                    const filtered = DataHistoriqueCourrier
                        .filter(dat => dat.id_historique === id_historique)
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
    }, [DataHistoriqueCourrier, id_historique]);

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
                <Card.Title>Workflow du Courrier - {id_historique}</Card.Title>
                <ul className="list-group">
                    {historique.map(etape => (
                        <li key={etape.id} className="list-group-item">
                            <strong>{etape.action}</strong> par { DataUtilisateur.data?.find(user => user.id_utilisateur === etape.id_utilisateur)?.noms || ""
                             } { DataUtilisateur.data?.find(user => user.id_utilisateur === etape.id_utilisateur)?.prenoms || ""
                             } de la { DataStructure?.find(s => s.id_structure === etape.id_structure)?.nom || "..."
                             } vers { DataStructure?.find(structure => structure.id_structure === etape.id_structure_destination)?.nom || "..."
                             } le {new Date(etape.date_historique).toLocaleString()}
                            {etape.note && <p className="mb-0 text-muted">{etape.note}</p>}
                        </li>
                    ))}
                </ul>
            </Card.Body>
        </Card>
    );
};






const CourrierAutres = () => {
    const { DataHistoriqueCourrier } = useDataHistoriqueCourrier();
    const [historiques, setHistoriques] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { DataObjet } = useDataObjet();
    const navigate = useNavigate();
    const [selectedCourrierId, setSelectedCourrierId] = useState(null);

    useEffect(() => {
        const fetchHistoriques = async () => {

         const type_interne = 'adb3c1c1-61c2-493b-9c53-441d4310c607';

            try {
                if (Array.isArray(DataHistoriqueCourrier)){

                    const filtered = DataHistoriqueCourrier
                        .filter(dat => dat.id_type_courrier === type_interne)
                        .map(dat => dat);
                         setHistoriques(filtered);
                }
                setLoading(false);
            } catch (err) {
                setError("Erreur lors de la récupération de l'historique.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistoriques();
    }, [DataHistoriqueCourrier]);  

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
        <div className="liste-courriers-container mt-4 container-fluid" style={{ maxHeight: '630px', overflowY: 'auto', position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <h2>Les courriers Interne</h2>
            <div className='d-flex justify-content-between'>
                <InputGroup style={{maxWidth: '300px'}}> 
                    <FormControl placeholder="Rechercher..." 
                    onChange={(e) => console.log(e.target.value)}  className=''/>
                </InputGroup>
                <Button variant='secondary' onClick={() => navigate('/workflow')}> Retour</Button>
            </div>
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
                    {historiques.length > 0 ? (
                        historiques.map((datahis, index) => (
                            <React.Fragment key={datahis.id_historique}>
                            <tr key={datahis.id_historique}>
                                <td>{index + 1}</td>
                                <td>{datahis.reference_courrier}</td>
                                <td>{DataObjet.find(o => o.id_objet === datahis.id_objet)?.libelle || ""}</td>
                                <td>
                                    <Button variant="primary" onClick={()=> handleWorckflow(datahis.id_historique)}>Workflow</Button>
                                </td>
                            </tr>
                            {selectedCourrierId === datahis.id_historique && (
                                    <tr>
                                        <td colSpan="4">
                                            <CourrierWorkflow id_historique = {datahis.id_historique} />
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
        
        </div>
        </>
    );
};

export default CourrierAutres;