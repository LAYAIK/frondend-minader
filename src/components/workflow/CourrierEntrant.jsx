// // src/components/CourrierEntrants.jsx
// import React, { useState, useEffect } from "react";
// import {
//   Table,
//   Alert,
//   InputGroup,
//   FormControl,
//   Button,
//   Spinner,
//   Card,
//   Accordion,
// } from "react-bootstrap";
// import { useDataObjet } from "../../data/serviceAutreData";
// import { useDataStructure } from "../../data/serviceStructurePerso";
// import { useDataUtilisateur } from "../../data/serviceAuthen";
// import { useDataCourrier, useDataHistoriqueCourrier } from "../../data/serviceCourrierData";
// import { useNavigate } from "react-router";
// import { Eye } from "lucide-react"; // Icône moderne

// // Composant Workflow
// const CourrierWorkflow = ({ courrierId }) => {
//   const [historique, setHistorique] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { DataHistoriqueCourrier } = useDataHistoriqueCourrier();
//   const { DataUtilisateur } = useDataUtilisateur();
//   const { DataStructure } = useDataStructure();

//   useEffect(() => {
//     if (!courrierId) return;
//     setLoading(true);
//     try {
//       if (Array.isArray(DataHistoriqueCourrier)) {
//         const filtered = DataHistoriqueCourrier.filter(
//           (h) => h.id_courrier === courrierId
//         );
//         setHistorique(filtered);
//       }
//     } catch (err) {
//       setError("Erreur lors de la récupération de l'historique.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   }, [DataHistoriqueCourrier, courrierId]);

//   if (loading)
//     return (
//       <div className="text-center p-3">
//         <Spinner animation="border" size="sm" /> Chargement du workflow...
//       </div>
//     );

//   if (error) return <Alert variant="danger">{error}</Alert>;

//   return (
//     <ul className="list-group list-group-flush">
//       {historique.map((etape) => (
//         <li key={etape.id} className="list-group-item small">
//           <strong>{etape.action}</strong> par{" "}
//           {DataUtilisateur.data?.find((u) => u.id_utilisateur === etape.id_utilisateur)?.noms || ""}{" "}
//           {DataUtilisateur.data?.find((u) => u.id_utilisateur === etape.id_utilisateur)?.prenoms || ""}{" "}
//           <br />
//           <span className="text-muted">
//             de la{" "}
//             {DataStructure.data?.find((s) => s.id_structure === etape.id_structure)?.nom || "..."} vers{" "}
//             {DataStructure.data?.find((s) => s.id_structure === etape.id_structure_destination)?.nom || "..."} le{" "}
//             {new Date(etape.date_historique).toLocaleString()}
//           </span>
//           {etape.note && <p className="mb-0 text-info">{etape.note}</p>}
//         </li>
//       ))}
//     </ul>
//   );
// };

// // Liste des courriers entrants
// const CourrierEntrant = () => {
//   const { DataCourrier } = useDataCourrier();
//   const { DataObjet } = useDataObjet();
//   const [courriers, setCourriers] = useState([]);
//   const [filteredCourriers, setFilteredCourriers] = useState([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchCourriers = () => {
//       const id_courrier_entrant = "4cd78808-7d9b-4853-ac54-caefbf8da671";
//       try {
//         if (Array.isArray(DataCourrier)) {
//           const filtered = DataCourrier.filter(
//             (c) => c.id_type_courrier === id_courrier_entrant
//           );
//           setCourriers(filtered);
//           setFilteredCourriers(filtered);
//         }
//       } catch (err) {
//         setError("Impossible de charger les courriers.");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCourriers();
//   }, [DataCourrier]);

//   // Recherche
//   useEffect(() => {
//     if (!search) {
//       setFilteredCourriers(courriers);
//     } else {
//       setFilteredCourriers(
//         courriers.filter((c) =>
//           c.reference_courrier.toLowerCase().includes(search.toLowerCase())
//         )
//       );
//     }
//   }, [search, courriers]);

//   if (loading)
//     return (
//       <div className="d-flex justify-content-center align-items-center vh-100">
//         <Spinner animation="border" />
//       </div>
//     );

//   if (error) return <Alert variant="danger">{error}</Alert>;

//   return (
//     <div className="container-fluid mt-4">
//       <Card className="shadow-sm">
//         <Card.Header className="d-flex justify-content-between align-items-center">
//           <h4 className="mb-0">📥 Courriers Entrants</h4>
//           <Button variant="outline-secondary" size="sm" onClick={() => navigate("/workflow")}>
//             Retour
//           </Button>
//         </Card.Header>
//         <Card.Body>
//           <InputGroup className="mb-3">
//             <FormControl
//               placeholder="🔎 Rechercher par référence..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </InputGroup>

//           <Table hover responsive className="align-middle">
//             <thead className="table-light">
//               <tr>
//                 <th>#</th>
//                 <th>Référence</th>
//                 <th>Objet</th>
//                 <th className="text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredCourriers.length > 0 ? (
//                 filteredCourriers.map((courrier, index) => (
//                   <tr key={courrier.id_courrier}>
//                     <td>{index + 1}</td>
//                     <td>{courrier.reference_courrier}</td>
//                     <td>
//                       {DataObjet.find(
//                         (o) => o.id_objet === courrier.id_objet
//                       )?.libelle || "N/A"}
//                     </td>
//                     <td className="text-center">
//                       <Accordion>
//                         <Accordion.Item eventKey="0">
//                           <Accordion.Header>
//                             <Eye size={16} className="me-2" /> Voir Workflow
//                           </Accordion.Header>
//                           <Accordion.Body>
//                             <CourrierWorkflow courrierId={courrier.id_courrier} />
//                           </Accordion.Body>
//                         </Accordion.Item>
//                       </Accordion>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="4" className="text-center">
//                     Aucun courrier trouvé.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </Table>
//         </Card.Body>
//       </Card>
//     </div>
//   );
// };

// export default CourrierEntrant;



import React, { useState, useEffect } from "react";
import {
  Table,
  Alert,
  InputGroup,
  FormControl,
  Button,
  Spinner,
  Card,
  Badge,
} from "react-bootstrap";
import { useDataObjet } from "../../data/serviceAutreData";
import { useDataStructure } from "../../data/serviceStructurePerso";
import { useDataUtilisateur } from "../../data/serviceAuthen";
import {
  useDataCourrier,
  useDataHistoriqueCourrier,
} from "../../data/serviceCourrierData";
import { useNavigate } from "react-router";
import { FaSearch } from "react-icons/fa";

// ✅ Composant Workflow d’un courrier
const CourrierWorkflow = ({ courrierId }) => {
  const [historique, setHistorique] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { DataHistoriqueCourrier } = useDataHistoriqueCourrier();
  const { DataUtilisateur } = useDataUtilisateur();
  const { DataStructure } = useDataStructure();

  useEffect(() => {
    if (!courrierId) return;

    const fetchHistorique = async () => {
      try {
        if (Array.isArray(DataHistoriqueCourrier)) {
          const filtered = DataHistoriqueCourrier.filter(
            (dat) => dat.id_courrier === courrierId
          );
          setHistorique(filtered);
        }
      } catch (err) {
        setError("Erreur lors de la récupération de l'historique.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistorique();
  }, [DataHistoriqueCourrier, courrierId]);

  if (loading)
    return (
      <div className="text-center my-3">
        <Spinner animation="border" size="sm" /> Chargement du workflow...
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Card className="shadow-sm mt-3">
      <Card.Body>
        <Card.Title className="h6 text-primary">
          Workflow du Courrier <Badge bg="info">{courrierId}</Badge>
        </Card.Title>
        <ul className="list-group list-group-flush">
          {historique.map((etape) => {
            const user = DataUtilisateur.data?.find((u) => u.id_utilisateur === etape.id_utilisateur);
            const structureSrc = DataStructure?.find((s) => s.id_structure === etape.id_structure);
            const structureDest = DataStructure?.find( (s) => s.id_structure === etape.id_structure_destinataire);

            return (
              <li
                key={etape.id}
                className="list-group-item d-flex flex-column"
              >
                <div>
                  <strong className="text-success">{etape.action}</strong> par{" "}
                  <span className="fw-bold">
                    {user?.noms} {user?.prenoms}
                  </span>
                </div>
                <div className="small text-muted">
                  De <Badge bg="secondary">{structureSrc?.nom || "..."}</Badge>{" "}
                  vers{" "}
                  <Badge bg="warning" text="dark">
                    {structureDest?.nom || "..."}
                  </Badge>{" "}
                  le {new Date(etape.date_historique).toLocaleString()}
                </div>
                {etape.note && (
                  <div className="mt-1 fst-italic text-muted">{etape.note}</div>
                )}
              </li>
            );
          })}
        </ul>
      </Card.Body>
    </Card>
  );
};

// ✅ Composant Courriers Sortants
const CourrierEntrant = () => {
  const { DataCourrier } = useDataCourrier();
  const [courriers, setCourriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { DataObjet } = useDataObjet();
  const navigate = useNavigate();
  const [selectedCourrierId, setSelectedCourrierId] = useState(null);
  const [search, setSearch] = useState("");
  const { DataHistoriqueCourrier } = useDataHistoriqueCourrier();

  useEffect(() => {
    const id_type_entrant = "4cd78808-7d9b-4853-ac54-caefbf8da671";
    try {
      if (Array.isArray(DataHistoriqueCourrier)) {
        const filtered = DataHistoriqueCourrier.filter(
          (dat) => dat.id_type_courrier === id_type_entrant
        ).map((dat) => dat.id_courrier);
        setCourriers(filtered);
      }
    } catch (err) {
      setError("Impossible de charger les courriers.");
      console.error("Erreur :", err);
    } finally {
      setLoading(false);
    }
  }, [DataHistoriqueCourrier]);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status" />
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;

  const handleWorkflow = (id) => {
    setSelectedCourrierId(selectedCourrierId === id ? null : id);
  };

  return (
    <div className="container-fluid mt-4">
      <Card className="shadow-lg">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3 rounded">
            <h2 className="h4 text-success">📥 Courriers Entrants</h2>  
          <InputGroup style={{ maxWidth: "300px" }}>
                      <InputGroup.Text>
                        <FaSearch />
                      </InputGroup.Text>
                      <FormControl
                        placeholder="Rechercher..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </InputGroup>
            <Button variant="outline-secondary" onClick={() => navigate("/workflow")}>
              Retour
            </Button>
          </div>


          <div className="table-responsive">
            <Table hover bordered className="align-middle shadow-sm">
              <thead className="table-primary sticky-top">
                <tr>
                  <th>N°</th>
                  <th>Référence</th>
                  <th>Objet</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courriers.length > 0 ? (
                  courriers.map((courrier, index) => {
                    const data = DataHistoriqueCourrier.find((i) => i.id_courrier === courrier);
                    const objet = DataObjet.find((o) => o.id_objet === data.id_objet);

                    return (
                      <React.Fragment key={courrier}>
                        <tr>
                          <td>{index + 1}</td>
                          <td>
                            <Badge bg="info">{data?.reference_courrier}</Badge>
                          </td>
                          <td>{objet?.libelle || "Sans objet"}</td>
                          <td className="text-center">
                            <Button
                              size="sm"
                              variant={
                                selectedCourrierId === courrier
                                  ? "danger"
                                  : "primary"
                              }
                              onClick={() => handleWorkflow(courrier)}
                            >
                              {selectedCourrierId === courrier
                                ? "Fermer"
                                : "Voir Workflow"}
                            </Button>
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
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      Aucun courrier trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CourrierEntrant;