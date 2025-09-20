import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert,Col } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { useDataCourrier } from '../../data/serviceCourrierData';
import { useDataStructure } from '../../data/serviceStructurePerso';
import { getByIdCourrier } from '../../actions/Courrier';
import { useParams, useNavigate } from 'react-router';


export default function TransfertCourrier() {

  const navigate = useNavigate();
  const { id } = useParams(); // Récupère l'ID du courrier depuis l'URL
  // State management
  const [formData, setFormData] = useState({
    id_courrier: '',
    id_structure_nouveau: '',
    note: '',
    id_status: 'd2e53662-c898-4645-8ed3-4f24e5a052e3', // Example: ID for a "Transferred" status
    id_type_courrier: '',
  });
  const [files, setFiles] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Custom Hooks for Data
  const { transfertCourier } = useAuth();
  const { DataStructure } = useDataStructure();
  const { DataCourrier } = useDataCourrier();

  // Effect pour récupérer les données du courrier
    useEffect(() => {
      const fetchCourrier = async () => {
        try {
          console.log('id...', id)
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
    const id_type_courrier = DataCourrier.find(dat => dat.id_courrier === id)?.id_type_courrier || '';
    if (user && user.id_utilisateur) {
      setFormData(prevData => ({
        ...prevData,
        id_utilisateur_transfert: user.id_utilisateur,
        id_type_courrier: id_type_courrier
      }));
      console.log('id_user', formData.id_utilisateur_transfert)
    }
  }, [formData.id_utilisateur_transfert, DataCourrier, id]);

  // Handlers for form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    setError('');
    setSuccessMessage('');
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };
  const handleAnnuler = async () =>{
    navigate('/liste-courrier');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      // Validate form data before sending
      if (!formData.id_courrier || !formData.id_structure_nouveau) {
        throw new Error('Veuillez sélectionner le courrier et la structure de destination.');
      }
       console.log('Form Data to submit:', formData.id_courrier);

    let payload = {
      id_structure_nouveau: formData.id_structure_nouveau,
      note: formData.note,
      id_status: 'd2e53662-c898-4645-8ed3-4f24e5a052e3',
      id_utilisateur_transfert: formData.id_utilisateur_transfert,
      id_type_courrier: formData.id_type_courrier
    };

    console.log('Payload before files:', payload);

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

      console.log('Payload with files:', payload);

      const id_courrier = formData.id_courrier;
      // Call the API function from the AuthContext
      const result = await transfertCourier(id_courrier, payload);

      console.log('Transfert réussi:', result);
      setSuccessMessage('Le courrier a été transféré avec succès !');
      // Redirection après un court délai pour que l'utilisateur voie le message
      setTimeout(() => {
        navigate('/liste-courrier'); // Redirige vers la liste des courriers
      }, 3000); // 2 secondes
    } catch (error) {
      // Check for a specific message, a generic 'error' field, or a status text
  const errorMessage = error.response?.data?.message || 
                     error.response?.data?.error || 
                     error.response?.statusText || 
                     'Une erreur inconnue est survenue.';

  console.error("Erreur lors du transfert du courrier:", errorMessage);
  setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='container-fluid' style={{ padding: '20px' }}>
      <Card className="mt-2 mx-auto">
        <Card.Header as="h3">Transférer Courrier</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {successMessage && <Alert variant="success">{successMessage}</Alert>}

            <Form.Group as={Col} controlId="courrier-select">
              <Form.Label>Référence du Courrier</Form.Label>
              <Form.Select
                value={formData.reference_courrier}
                onChange={handleChange}
                name="id_courrier"
                required
                disabled={isLoading}
                >
                <option value="">Sélectionner...</option>
                {DataCourrier && DataCourrier.length > 0 ? (
                  DataCourrier.map((item) => (
                    <option key={item.reference_courrier} value={item.reference_courrier}>
                      {item.reference_courrier} - {item.objet}
                    </option>
                  ))
                ) : (
                  <option disabled>Aucune donnée disponible</option>
                )}
              </Form.Select>
            </Form.Group>

            <Form.Group as={Col} controlId="structure-select">
              <Form.Label>Structure destinataire</Form.Label>
              <Form.Select
                value={formData.id_structure_nouveau}
                onChange={handleChange}
                name="id_structure_nouveau"
                required
                disabled={isLoading}
                >
                <option value="">Sélectionner...</option>
                {DataStructure && DataStructure.length > 0 ? (
                  DataStructure.map((item) => (
                    <option key={item.id_structure} value={item.id_structure}>
                      {item.nom}
                    </option>
                  ))
                ) : (
                  <option disabled>Aucune donnée disponible</option>
                )}
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Note</Form.Label>
                <Form.Control
                  type="text"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  />
                </Form.Group>

            <Form.Group controlId="formFileMultiple" className="mb-3">
              <Form.Label>Documents joints</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={handleFileChange}
                accept=".pdf, .doc, .docx, .jpg, .jpeg, .png"
                disabled={isLoading}
                />
            </Form.Group>

            {error && <Alert variant="danger">{error}</Alert>}
            <div className='d-flex gap-3'>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? 'Transfert en cours...' : 'Transférer'}
            </Button>
            <Button variant="danger" type="submit" onClick={ handleAnnuler} >Annuler</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}