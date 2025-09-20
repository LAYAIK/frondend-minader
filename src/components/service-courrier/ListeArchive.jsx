// src/components/ListeArchives.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, Table, Alert, Spinner, Button } from 'react-bootstrap';
import { useDataCourrier } from '../../data/serviceCourrierData';
import { useDataObjet} from '../../data/serviceAutreData';

const ListeArchive = () => {
  const [archives, setArchives] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { listeArchive } = useAuth();

  // Donnees
  const { DataCourrier } = useDataCourrier();
  const { DataObjet } = useDataObjet();

  useEffect(() => {
    const fetchArchives = async () => {
      try {
        const response = await listeArchive();

        console.log('Données des archives:', response);
        setArchives(response);
      } catch (err) {
        setError('Erreur lors de la récupération des archives.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArchives();
  }, [listeArchive]); // Le tableau de dépendances vide assure que l'effet s'exécute une seule fois au montage du composant.

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
   <div className="container-fluid"> 
    <Card className="m-4">
      <Card.Header as="h3">Liste des Archives</Card.Header>
      <Card.Body>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>N°</th>
              <th>Référence Courrier</th>
              <th>Objet</th>
              <th>Date d'archivage</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {archives && archives.length > 0 ?  (
              archives.map((archive, index) => (
                <tr key={archive.id_archive}>
                  <td>{index + 1}</td>
                  <td>{DataCourrier.find(t => t.id_courrier === archive.id_courrier)?.reference_courrier || archive.id_courrier}</td>
                  <td>{DataObjet.find(o => o.id_objet === DataCourrier.find(t => t.id_courrier === archive.id_courrier)?.id_objet)?.libelle || DataObjet.find(o => o.id_objet === archive.id_objet)?.libelle || archive.id_objet}</td>
                  <td>{new Date(archive.date_archivage).toLocaleDateString()}</td>
                  <td>
                    <div>
                      <Button variant="secondary" className=" mr-2">Voir details</Button>
                      <Button variant="primary" className=" mr-2">Modifier</Button>
                      <Button  variant="danger" className="">Supprimer</Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  Aucune archive trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
   </div>
  );
};

export default ListeArchive;