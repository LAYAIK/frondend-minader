import React from 'react'
import { Form, Button, Col, Row, Card, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function RegisterCourrier() {
const [credentials, setCredentials] = useState({
    source_courrier: '',
    reference_courrier: '',
    objet: '',
    contenu: '',
    type_courrier: '',
    priorite: '',
    statut_courrier: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { registerCourrier } = useAuth();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    setError('');
  };
  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    try{ 
    setIsLoading(true);
    e.preventDefault();
    console.log("Submitting form with credentials:", credentials);
    const resultat = await registerCourrier(credentials, selectedFiles);
    console.log("resultat :",resultat);
    }catch(error){
      setError(`Erreur lors de l'enregistrement du courrier. Veuillez réessayer : ${error.response ? error.response.data : error.message}`);
      console.error('Erreur lors de l\'enregistrement du courrier:', error.response ? error.response.data : error.message);
    }finally{
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

        <Form.Group as={Col} controlId="formGridState">
          <Form.Label>Source du courrier</Form.Label>
          <Form.Select onChange={handleChange} name="source_courrier" value={credentials.source_courrier} required disabled={isLoading}>
            <option>Choisir...</option>
            <option>srvice 1</option>
            <option>service  2</option>
            <option>personnel</option>
            <option>Autres</option>
          </Form.Select>
        </Form.Group>
        <Form.Group as={Col} controlId="formGridEmail">
          <Form.Label>Reference Courrier</Form.Label>
          <Form.Control type="text" placeholder="Reference du courrier" onChange={handleChange} name="reference_courrier" value={credentials.reference_courrier} disabled={isLoading} />
        </Form.Group>
      </Row>

        <Form.Group as={Col} controlId="formGridState">
          <Form.Label>Objet</Form.Label>
          <Form.Select  onChange={handleChange} name="objet" value={credentials.objet} required disabled={isLoading}>
            <option>Choisir...</option>
            <option>Demande de Stage</option>
            <option>Demande d'emploi</option>
            <option>Demande d'information</option>
            <option>Demande de Reclamation</option>
            <option>Autres</option>
          </Form.Select>
        </Form.Group>
        
      <Row className="mt-3 mb-3">
      
      <Form.Group as={Col} controlId="formGridState">
          <Form.Label>Type Courrier</Form.Label>
          <Form.Select  onChange={handleChange} name="type_courrier" value={credentials.type_courrier} required disabled={isLoading}>
            <option>Choisir...</option>
            <option>Demande de Stage</option>
            <option>Demande d'emploi</option>
            <option>Demande d'information</option>
            <option>Demande de Reclamation</option>
            <option>Autres</option>
          </Form.Select>
        </Form.Group>      
        <Form.Group as={Col} controlId="formGridState">
          <Form.Label>Statut Courrier</Form.Label>
          <Form.Select  onChange={handleChange} name="statut_courrier" value={credentials.statut_courrier} required disabled={isLoading}>
            <option>Choisir...</option>
            <option>Demande de Stage</option>
            <option>Demande d'emploi</option>
            <option>Demande d'information</option>
            <option>Demande de Reclamation</option>
            <option>Autres</option>
          </Form.Select>
        </Form.Group>      
        <Form.Group as={Col} controlId="formGridState">
          <Form.Label>Priorite</Form.Label>
          <Form.Select  onChange={handleChange} name="priorite" value={credentials.priorite} required disabled={isLoading} > 
            <option>Choisir...</option>
            <option>Demande de Stage</option>
            <option>Demande d'emploi</option>
            <option>Demande d'information</option>
            <option>Demande de Reclamation</option>
            <option>Autres</option>
          </Form.Select>
        </Form.Group> 
      </Row>

      <Form.Group className="mb-3" controlId="formGridAddress1">
        <Form.Label>Contenu</Form.Label>
        <Form.Control type='text' placeholder="texte ...." onChange={handleChange} name="contenu" value={credentials.contenu} required as="textarea" rows={2} disabled={isLoading} />
      </Form.Group>

      <Form.Group controlId="formFileMultiple" className="mb-3">
        <Form.Label>Les documents jointes</Form.Label>
        <Form.Control type="file" multiple onChange={handleFileChange} accept=".pdf, .doc, .docx"  disabled={isLoading}/>
      </Form.Group>

      {error && <Alert variant="danger">{error}</Alert>}

      <Button variant="primary" type="submit" onClick={ isLoading ? null : handleSubmit} disabled={isLoading}> { isLoading ? 'Loading…' : 'Enregistrer'} </Button>
        

    </Form>
      </Card.Body> 
      </Card>  
    </div>
  )
}
