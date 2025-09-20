import React from 'react'
import { Form, Button, Col, Row, Card, Alert } from 'react-bootstrap';
import { useState, useEffect} from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useDataTypeCourrier } from '../../data/serviceCourrierData';
import { useNavigate } from 'react-router';
import { useDataObjet, useDataPriorite, useDataStatus } from '../../data/serviceAutreData'; 

export default function RegisterCourrier() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const { registerCourrier } = useAuth(); 
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
      reference_courrier: '',
      id_courrier:'',
      id_utilisateur:'',
      id_objet: '',
      objet: '',
      id_type_courrier: '',
      contenu: '',
      id_priorite: '',
      id_status: '',
      id_structure: '',
      id_note: '',
      // ... autres champs
    });
      const { DataTypeCourrier } = useDataTypeCourrier();
      const { DataObjet } = useDataObjet();
      const { DataPriorite} = useDataPriorite();
      const { DataStatus } = useDataStatus();
      const objet = DataObjet;
      const priorite = DataPriorite;
      const status = DataStatus;
      const typecourrier = DataTypeCourrier;

// useEffect pour Recupere l'id de l'utilisateur
    useEffect(() => {
          const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
          if (user && user.id_utilisateur) {
            const id_user = user.id_utilisateur;
            const id_structure = user.id_structure;

              console.log('id_utilisateur 1:', id_user);
              console.log('id_structure:', id_structure);

              setFormData(prevData => ({
                ...prevData,
                id_utilisateur: id_user,
                id_structure: id_structure
              }));
          }
      }, [formData.id_utilisateur]);
      

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    setError('');
    setSuccessMessage('');
  };
  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    try {
       setIsLoading(true);
       e.preventDefault();
       if (!formData.id_utilisateur){
        throw new Error('Veuillez sélectionner le courrier et l\'utilisateur.');
       }
    let payload = {
      id_structure: formData.id_structure,
      id_note: formData.id_note,
      id_status: formData.id_status,
      id_utilisateur: formData.id_utilisateur,
      id_type_courrier: formData.id_type_courrier,
      reference_courrier: formData.reference_courrier,
      id_objet: formData.id_objet,
      objet: formData.objet,
      id_priorite: formData.id_priorite,
      contenu: formData.contenu
    };

    console.log('Payload before files 1:', payload);

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

      const response = await registerCourrier(payload);
      setSuccessMessage("Courrier enregistré avec succès !");
      console.log('Réponse de l\'API:', response.data);
      // Redirection après un court délai pour que l'utilisateur voie le message
      setTimeout(() => {
        navigate('/liste-courrier'); // Redirige vers la liste des courriers
      }, 3000); // 2 secondes
    } catch (err) {
      setError("Erreur lors de l'enregistrement du courrier.");
        console.error(err);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className='container-fluid' style={{ padding: '20px' }}>
    <Card className="mt-2 mx-auto" >
    <Card.Header as="h3">Register Courrier</Card.Header>
    <Card.Body> 
    
    <Form>
      <Row className="mb-3"> 

        <Form.Group as={Col} controlId="dynamic-select">
          <Form.Label>Source du courrier</Form.Label>
          <Form.Select value={formData.id_type_courrier} onChange={handleChange} name="id_type_courrier" required disabled={isLoading}>
            {/* Default option */}
            <option value="">Sélectionner...</option>
              {typecourrier.length > 0 ? ( typecourrier.map((item) => (
              <option key={item.id_type_courrier} value={item.id_type_courrier}> {item.type}</option> ))
              ) : (
              <option disabled>Aucune donnée disponible</option> )}
          </Form.Select>
        </Form.Group>
        <Form.Group as={Col} controlId="formGridEmail">
          <Form.Label>Reference Courrier</Form.Label>
          <Form.Control type="text" placeholder="Reference du courrier" onChange={handleChange} name="reference_courrier" value={formData.reference_courrier} disabled={isLoading} />
        </Form.Group>
      </Row>
        <Form.Group as={Col} controlId="dynamic-select">
          <Form.Label>Objet</Form.Label>
          <Form.Select value={formData.id_objet} onChange={handleChange} name="id_objet" required disabled={isLoading}>
            {/* Default option */}
            <option value="">Sélectionner...</option>
              {objet.length > 0 ? ( objet.map((item) => (
              <option key={item.id_objet} value={item.id_objet}> {item.libelle}</option> ))
              ) : (
              <option disabled>Aucune donnée disponible</option> )}
          </Form.Select>
        </Form.Group>
        
      <Row className="mt-3 mb-3">
      <Form.Group as={Col} controlId="dynamic-select">
          <Form.Label>Type Courrier</Form.Label>
          <Form.Select  onChange={handleChange} name="id_type_courrier" value={formData.id_type_courrier} required disabled={isLoading}>
            <option value="">Sélectionner...</option>
              {typecourrier.length > 0 ? ( typecourrier.map((item) => (
              <option key={item.id_type_courrier} value={item.id_type_courrier}> {item.type}</option> ))
              ) : (
            <option disabled>Aucune donnée disponible</option> )}
            <option>Autres</option>
          </Form.Select>
        </Form.Group>      
        <Form.Group as={Col} controlId="dynamic-select">
          <Form.Label>Statut Courrier</Form.Label>
          <Form.Select  onChange={handleChange} name="id_status" value={formData.id_status} required disabled={isLoading}>
            <option value="">Sélectionner...</option>
              {status.length > 0 ? ( status.map((item) => (
              <option key={item.id_status} value={item.id_status}> {item.libelle}</option> ))
              ) : (
            <option disabled>Aucune donnée disponible</option> )}
            <option>Autres</option>
          </Form.Select>
        </Form.Group>      
        <Form.Group as={Col} controlId="dynamic-select">
          <Form.Label>Priorite</Form.Label>
          <Form.Select  onChange={handleChange} name="id_priorite" value={formData.id_priorite} required disabled={isLoading}>
            <option value="">Sélectionner...</option>
              {priorite.length > 0 ? ( priorite.map((item) => (
              <option key={item.id_priorite} value={item.id_priorite}> {item.niveau}</option> ))
              ) : (
            <option disabled>Aucune donnée disponible</option> )}
            <option>Autres</option>
          </Form.Select>
        </Form.Group> 
      </Row>

      <Form.Group className="mb-3" controlId="formGridAddress1">
        <Form.Label>Contenu</Form.Label>
        <Form.Control type='text' placeholder="texte ...." onChange={handleChange} name="contenu" value={formData.contenu} required as="textarea" rows={2} disabled={isLoading} />
      </Form.Group>

      <Form.Group controlId="formFileMultiple" className="mb-3">
        <Form.Label>Les documents jointes</Form.Label>
        <Form.Control type="file" multiple onChange={handleFileChange} accept=".pdf, .doc, .docx, .jpg, .jpeg, .png, .xls, .xlsx"  disabled={isLoading}/>
      </Form.Group>

      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Button variant="primary" type="submit" onClick={ isLoading ? null : handleSubmit} disabled={isLoading}> { isLoading ? 'Loading…' : 'Enregistrer'} </Button>
      
    </Form>
      </Card.Body> 
      </Card>  
    </div>
  )
}
