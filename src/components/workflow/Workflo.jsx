// // src/components/Workflow.jsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Card, Spinner, Alert } from 'react-bootstrap';
// import { useParams } from 'react-router';

// const Workflow = () => {
//   const { id } = useParams(); // Récupère l'ID du courrier depuis l'URL
//   const [historique, setHistorique] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchHistorique = async () => {
//       try {
//         const response = await axios.get(`http://votre-api.com/api/couriers/${id}/historique`);
//         setHistorique(response.data);
//       } catch (err) {
//         setError('Erreur lors de la récupération de l’historique du courrier.');
//         console.error(err);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchHistorique();
//   }, [id]); // Déclenche l'effet lorsque l'ID change

//   if (isLoading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
//         <Spinner animation="border" role="status">
//           <span className="visually-hidden">Chargement du workflow...</span>
//         </Spinner>
//       </div>
//     );
//   }

//   if (error) {
//     return <Alert variant="danger">{error}</Alert>;
//   }
//   return (
//     <Card className="m-4">
//       <Card.Header as="h3">Workflow du Courrier</Card.Header>
//       <Card.Body>
//         {historique.length > 0 ? (
//           <ul className="list-group list-group-flush">
//             {historique.map((etape) => (
//               <li key={etape.id_historique} className="list-group-item">
//                 <div className="d-flex w-100 justify-content-between">
//                   <h5 className="mb-1">{etape.action}</h5>
//                   <small className="text-muted">{new Date(etape.date_historique).toLocaleString()}</small>
//                 </div>
//                 <p className="mb-1">
//                   Par : **{etape.utilisateur.nom}** ({etape.utilisateur.structure})
//                 </p>
//                 {etape.details && <small className="text-muted">Détails : {etape.details}</small>}
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-center text-muted">Aucun historique disponible pour ce courrier.</p>
//         )}
//       </Card.Body>
//     </Card>
//   );
// };

// export default Workflow;