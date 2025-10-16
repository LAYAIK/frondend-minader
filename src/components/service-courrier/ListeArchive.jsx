// src/components/Archives.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Table,
  Alert,
  InputGroup,
  FormControl,
  Button,
  Spinner,
  Card,
  Badge,
  Pagination,
  Form,
} from "react-bootstrap";
import {
  useDataObjet,
  useDataPriorite,
  useDataStatus,
} from "../../data/serviceAutreData";
import { useDataTypeCourrier, useDataHistoriqueCourrier } from "../../data/serviceCourrierData";
import {
  FaEye,
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
   FaTrash,
} from "react-icons/fa";

const Archive = () => {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [archive, setArchive] = useState([]);
  const navigate = useNavigate();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // choix dynamique

  
  // Tri
  const [sortConfig, setSortConfig] = useState({
    key: "reference_courrier",
    direction: "asc",
  });

  const { DataObjet } = useDataObjet();
  const { DataPriorite } = useDataPriorite();
  const { DataStatus } = useDataStatus();
  const { DataTypeCourrier } = useDataTypeCourrier();
  const { DataHistoriqueCourrier } = useDataHistoriqueCourrier();

      const scopeIds = localStorage.getItem("scopeIds") || [];
    console.log('frond end scopesIds', scopeIds);
  
    const parsedScopeIds = (() => {
      try {
        return Array.isArray(scopeIds) ? scopeIds : JSON.parse(scopeIds);
      } catch {
        return [];
      }
    })();
  
  // --- Simulation des données dynamiques
  useEffect(() => { 
    try {
      if (Array.isArray(DataHistoriqueCourrier)){
        DataHistoriqueCourrier.forEach((h) => {
           if (h.action === 'Archiver') setArchive((prev) => [...prev, h])  ;
         });
       }else{
         setArchive([]);
         console.error("Données inattendues:", DataHistoriqueCourrier);
       }
     } catch (err) {
       console.error("Erreur lors du traitement de l'historique:", err);
       setArchive([]);
     } finally {
       setLoading(false);
      }
    }, [DataHistoriqueCourrier]);

   console.log('data :', archive);
  // Filtrage
  const filteredCourriers = archive.filter(
    (c) =>
      c.reference_courrier?.toLowerCase().includes(search.toLowerCase()) ||
      DataObjet.find((o) => o.id_objet === c.id_objet)?.libelle
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  // Tri dynamique
  const sortedCourriers = [...filteredCourriers].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const valueA = a[sortConfig.key] ?? "";
    const valueB = b[sortConfig.key] ?? "";

    if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentCourriers = sortedCourriers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedCourriers.length / itemsPerPage);

   if (loading) {
      return (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <Spinner animation="grow" variant="success" />
          <span className="ms-2 text-success">Chargement des courriers...</span>
        </div>
      );
    }

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="ms-1 text-muted" />;
    return sortConfig.direction === "asc" ? (
      <FaSortUp className="ms-1 text-primary" />
    ) : (
      <FaSortDown className="ms-1 text-primary" />
    );
  };

    const handleDetails = (id) => {
    navigate(`/detail-historique/${id}`);
  };

    const handleDelete = async (id) => {
      window.confirm("Êtes-vous sûr de vouloir supprimer ce courrier ?", id)
        // la logique
    };

  return (
    <div className="container-fluid py-4">
      <Card className="shadow-lg">
        <Card.Header className="d-flex flex-column flex-md-row justify-content-between align-items-center bg-success text-white">
          <h4 className="mb-3 mb-md-0">📂 Liste des Courriers Archivés</h4>
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
        </Card.Header>

        <Card.Body className="p-0">
          <Table responsive hover bordered className="mb-0 align-middle text-center">
            <thead className="table-success">
              <tr>
                <th>N°</th>
                <th onClick={() => requestSort("reference_courrier")} style={{ cursor: "pointer" }}>
                  Référence {renderSortIcon("reference_courrier")}
                </th>
                <th>Objet</th>
                <th>Type</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentCourriers.length > 0 ? (
                currentCourriers.map((c, index) => (
                  <tr key={c.id_courrier}>
                    <td>{indexOfFirst + index + 1}</td>
                    <td>
                      <strong>{c.reference_courrier}</strong>
                    </td>
                    <td>
                      {DataObjet.find((o) => o.id_objet === c.id_objet)?.libelle || c.id_objet}
                    </td>
                    <td>
                      {DataTypeCourrier.find((t) => t.id_type_courrier === c.id_type_courrier)?.type ||
                        c.id_type_courrier}
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <Button size="sm" variant="outline-primary" 
                        onClick={() => handleDetails(c.id_historique)}
                        >
                          <FaEye />
                        </Button>
                        {parsedScopeIds.includes( "f29abc72-1080-438e-9896-69140d036ebf" ) ? (
                          <Button size="sm" variant="outline-danger" onClick={() => handleDelete(c.id_historique)}>
                            <FaTrash />
                           </Button> ) :''}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">
                    Aucun courrier trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>

        {/* Pagination + Sélecteur */}
        <Card.Footer className="d-flex flex-column flex-md-row justify-content-between align-items-center">
          <Form.Select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1); // reset page
            }}
            style={{ maxWidth: "150px" }}
          >
            <option value={5}>5 par page</option>
            <option value={10}>10 par page</option>
            <option value={20}>20 par page</option>
          </Form.Select>

          <Pagination className="mt-3 mt-md-0">
            <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
            <Pagination.Prev onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} />
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === currentPage}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            />
            <Pagination.Last
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default Archive;