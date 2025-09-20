// src/components/ModifierCourrier.jsx
import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router';
import { getByIdCourrier, miseAJourCourrier } from '../../actions/Courrier';
import { useDataObjet, useDataPriorite, useDataStatus } from '../../data/serviceAutreData';
import { useDataTypeCourrier } from '../../data/serviceCourrierData';

export default function ModifierCourrier() {
  const navigate = useNavigate();
  const { id } = useParams(); // Récupère l'ID du courrier depuis l'URL
  const [formData, setFormData] = useState({
    reference_courrier: '',
    id_courrier:'',
    id_utilisateur:'',
    id_objet: '',
    objet: '',
    id_type_courrier: '',
    // ... autres champs
  });
  const [files, setFiles] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { DataObjet } = useDataObjet();
  const { DataPriorite } = useDataPriorite();
  const { DataStatus } = useDataStatus();
  const { DataTypeCourrier } = useDataTypeCourrier();

  // Effect pour récupérer les données du courrier avec l'ID
  useEffect(() => {
    const fetchCourrier = async () => {
      try {
        const response = await getByIdCourrier(id);
        setFormData(response); // Pré-remplit l'état du formulaire
        setIsLoading(false);
        console.log('Données du courrier:', response);
      } catch (err) {
        setError("Erreur lors de la récupération des données du courrier.");
        console.error(err);
        setIsLoading(false);
      }
    };
    fetchCourrier();
  }, [id]);

// Get user ID from AuthContext or localStorage and set initial state
  useEffect(() => {
      const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
      if (user && user.id_utilisateur) {
        const id_user = user.id_utilisateur;
        setFormData(prevData => ({
          ...prevData,
          id_utilisateur: id_user,
        }));
      }
    }, [formData.id_utilisateur]);

  // Gère les changements dans les champs du formulaire
 const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    setError('');
    setSuccessMessage('');
  };
   const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  // Gère la soumission du formulaire
  const handleSubmit = async (e) => {
    try {
       setIsLoading(true);
       e.preventDefault();
       if (!id || !formData.id_utilisateur){
        throw new Error('Veuillez sélectionner le courrier et l\'utilisateur.');
       }
    let payload = {
      id_structure: formData.id_structure,
      id_note: formData.id_note,
      id_status: formData.id_status,
      id_utilisateur: formData.id_utilisateur,
      id_type_courrier: formData.id_type_courrier
    };

    // If files are selected, append them to the payload
      if (files && files.length > 0) {
        const formDataWithFiles = new FormData();
        Object.keys(payload).forEach(key => {
          formDataWithFiles.append(key, payload[key]);
        });
        for (let i = 0; i < files.length; i++) {
          formDataWithFiles.append('fichiers', files[i]);
        }
        payload = formDataWithFiles;
      }else{
        // If no files, convert payload to FormData
        const formDataWithoutFiles = new FormData();
        Object.keys(payload).forEach(key => {
          formDataWithoutFiles.append(key, payload[key]);
        });
        payload = formDataWithoutFiles;
      }

      const response = await miseAJourCourrier(id, payload);
      setSuccessMessage("Courrier mis à jour avec succès !");
      console.log('Réponse de l\'API:', response.data);
      // Redirection après un court délai pour que l'utilisateur voie le message
      setTimeout(() => {
        navigate('/liste-courrier'); // Redirige vers la liste des courriers
      }, 3000); // 2 secondes
    } catch (err) {
      setError("Erreur lors de la mise à jour du courrier.");
        console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  const handleAnnuler = async () =>{
    navigate('/liste-courrier');
  };
  return (
    <div className='container-fluid '>

    <Card className='mt-2 mx-auto' style={{ padding: '20px' }}>
      <Card.Header as="h3">Modifier le Courrier</Card.Header>
      <Card.Body>
        <Form >
          <Form.Group as={Col} className="mb-3">
            <Form.Label>Référence Courrier</Form.Label>
            <Form.Control
              type="text"
              name="reference_courrier"
              value={formData.reference_courrier}
              onChange={handleChange}
              />
          </Form.Group>
        <Row className=''>
          <Form.Group as={Col} controlId="dynamic-select">
            <Form.Label>Objet</Form.Label>
            <Form.Select value={formData.id_objet} onChange={handleChange} name="id_objet" required disabled={isLoading}>
                {/* Default option */}
                <option value="">Sélectionner...</option>
                {DataObjet.length > 0 ? ( DataObjet.map((item) => (
                    <option key={item.id_objet} value={item.id_objet}> {item.libelle}</option> ))
                ) : (
                    <option disabled>Aucune donnée disponible</option> )}
             </Form.Select>
          </Form.Group>
            <Form.Group as={Col} controlId="dynamic-select">
            <Form.Label>Status du Courrier</Form.Label>
            <Form.Select value={formData.id_status} onChange={handleChange} name="id_status" required disabled={isLoading}>
                {/* Default option */}
                <option value="">Sélectionner...</option>
                {DataStatus.length > 0 ? ( DataStatus.map((item) => (
                    <option key={item.id_status} value={item.id_status}> {item.libelle}</option> ))
                ) : (
                    <option disabled>Aucune donnée disponible</option> )}
             </Form.Select>
            </Form.Group>
        </Row>
        <Row className=''>
            <Form.Group as={Col} controlId="dynamic-select">
            <Form.Label>Niveau de Priorite du Courrier</Form.Label>
            <Form.Select value={formData.id_priorite} onChange={handleChange} name="id_priorite" required disabled={isLoading}>
                {/* Default option */}
                <option value="">Sélectionner...</option>
                {DataPriorite.length > 0 ? ( DataPriorite.map((item) => (
                    <option key={item.id_priorite} value={item.id_priorite}> {item.niveau}</option> ))
                ) : (
                    <option disabled>Aucune donnée disponible</option> )}
             </Form.Select>
            </Form.Group>
            <Form.Group as={Col} controlId="dynamic-select">
            <Form.Label>Type de Courrier</Form.Label>
            <Form.Select value={formData.id_type_courrier} onChange={handleChange} name="id_type_courrier" required disabled={isLoading}>
                {/* Default option */}
                <option value="">Sélectionner...</option>
                {DataTypeCourrier.length > 0 ? ( DataTypeCourrier.map((item) => (
                    <option key={item.id_type_courrier} value={item.id_type_courrier}> {item.type}</option> ))
                ) : (
                    <option disabled>Aucune donnée disponible</option> )}
             </Form.Select>
            </Form.Group>
        </Row>
            <Form.Group className="mb-3">
            <Form.Label>Note</Form.Label>
            <Form.Control
            type="text"
            name="note"
            value={formData.note}
            onChange={handleChange}
            />
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label></Form.Label>
            <Form.Control
            hidden
            type="file"
            name="file"
            value={formData.file}
            onChange={handleFileChange}
            />
            </Form.Group> 
          {/* ... autres champs de formulaire */}
                    {error && <Alert variant="danger">{error}</Alert>}
                    {successMessage && <Alert variant="success">{successMessage}</Alert>}
            <div className='d-flex gap-5'>
                <Button variant="primary" type="submit" onClick={ isLoading ? null : handleSubmit} disabled={isLoading} > { isLoading ? 'Mise à jour...' : 'Mettre à jour'} </Button>
                <Button variant="danger" type="submit" onClick={ handleAnnuler} >Annuler</Button>
            </div>
        </Form>
      </Card.Body>
    </Card>
            </div>
  );
}