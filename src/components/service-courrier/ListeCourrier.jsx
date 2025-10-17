// src/components/ListeCourriers.jsx
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
  Pagination,
  Form,
} from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import {
  useDataObjet,
  useDataPriorite,
  useDataStatus,
} from "../../data/serviceAutreData";
import { useDataTypeCourrier } from "../../data/serviceCourrierData";
import { getByIdCourrier, suppressionCourrier } from "../../actions/Courrier";
import { useNavigate } from "react-router";
import {
  FaTrash,
  FaEdit,
  FaShare,
  FaEye,
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaFilter,
} from "react-icons/fa";
import '../../css/List.css'

const ListeCourrier = () => {
  const [courriers, setCourriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // choix dynamique

  // Tri
  const [sortConfig, setSortConfig] = useState({
    key: "reference_courrier",
    direction: "asc",
  });

  const { listeCourrier } = useAuth();
  const { DataObjet } = useDataObjet();
  const { DataPriorite } = useDataPriorite();
  const { DataStatus } = useDataStatus();
  const { DataTypeCourrier } = useDataTypeCourrier();
  const navigate = useNavigate();

    const scopeIds = localStorage.getItem("scopeIds") || [];
    console.log('frond end scopesIds', scopeIds);
  
    const parsedScopeIds = (() => {
      try {
        return Array.isArray(scopeIds) ? scopeIds : JSON.parse(scopeIds);
      } catch {
        return [];
      }
    })();


  useEffect(() => {
    const fetchCourriers = async () => {
      try {
        const response = await listeCourrier();
        if (Array.isArray(response)) {
          setCourriers(response);
        } else {
          setCourriers([]);
          console.error("Données inattendues:", response);
        }
      } catch (err) {
        setError("Impossible de charger les courriers. Veuillez réessayer plus tard.", err);
        setCourriers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourriers();
  }, [listeCourrier]);

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce courrier ?")) {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      try {
        const result = await getByIdCourrier(id);
        if (!result) return;

        let payload = {
          id_courrier: result.id_courrier,
          id_objet: result.id_objet,
          id_utilisateur: user.id_utilisateur,
          reference_courrier: result.reference_courrier,
          id_type_courrier: result.id_type_courrier,
          id_structure: result.id_structure,
        };

        const resultat = await suppressionCourrier(id, payload);
        if (resultat) {
          setCourriers(courriers.filter((c) => c.id_courrier !== id));
        }
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
      }
    }
  };

  const handleUpdate = (id) => {
    navigate(`/modifier-courrier/${id}`);
  };

  const handleTransfer = (id) => {
    navigate(`/transfert-courrier/${id}`);
  };

  const handleDetails = (id) => {
    navigate(`/detail-courrier/${id}`);
  };

// 🔹 Filtrage combiné : recherche + statut
const filteredCourriers = courriers.filter((c) => {
  const matchSearch =
    c.reference_courrier?.toLowerCase().includes(search.toLowerCase()) ||
    DataObjet.find((o) => o.id_objet === c.id_objet)?.libelle
      ?.toLowerCase()
      .includes(search.toLowerCase());

  const matchStatus = selectedFilter
    ? c.id_status === selectedFilter
    : true;

  return matchSearch && matchStatus;
});


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

  if (error) return <Alert variant="danger">{error}</Alert>;

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="ms-1 text-muted" />;
    return sortConfig.direction === "asc" ? (
      <FaSortUp className="ms-1 text-primary" />
    ) : (
      <FaSortDown className="ms-1 text-primary" />
    );
  };

  return (
    <div className="container-fluid py-4">
      <Card className="shadow-lg">
        <Card.Header className="d-flex flex-column flex-md-row justify-content-between align-items-center bg-success text-white">
          <h4 className="mb-3 mb-md-0">📂 Liste des Courriers</h4>
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
              {/* 🔸 Barre de filtre stylée */}
<div className="d-flex flex-wrap justify-content-between align-items-center gap-3 px-3 py-2 bg-light border-bottom">
  <div className="d-flex align-items-center gap-2">
    <Form.Label className="fw-bold text-secondary mb-0">
      <FaFilter className="me-1 text-success" /> Statut :
    </Form.Label>
    <Form.Select
      value={selectedFilter}
      onChange={(e) => setSelectedFilter(e.target.value)}
      className="shadow-sm border-success fw-semibold"
      style={{
        width: "200px",
        minWidth: "160px",
        cursor: "pointer",
        backgroundColor: "#fefefe",
      }}
    >
      <option value="">Tous les statuts</option>
      <option value="2763fb62-7795-4612-8e11-2391a47b1f00">🟡 En cours</option>
      <option value="2f42f43e-e0f3-4125-b6e2-c8d1a1f95394">🕓 En attente</option>
      <option value="a342bc27-db38-4b6a-b4fd-dd29f258cf89">📤 Transmis</option>
      <option value="5f1684e9-a207-4dcb-98e9-c41e2f1c74d6">📬 Reçu</option>
      <option value="0e0d54a6-03f6-44a9-a92d-36d57940d74a">✅ Traité</option>
      <option value="25ad694f-4afa-4637-b386-b0cf65d0c8b5">❌ Rejeté</option>
    </Form.Select>
  </div>

  {selectedFilter && (
    <Button
      variant="outline-danger"
      size="sm"
      className="fw-semibold"
      onClick={() => setSelectedFilter("")}
    >
      Réinitialiser
    </Button>
  )}
</div>


        <Card.Body className="p-0">
          <Table responsive hover bordered className="mb-0 align-middle text-center">
            <thead className="table-success">
              <tr>
                <th>N°</th>
                <th onClick={() => requestSort("reference_courrier")} style={{ cursor: "pointer" }}>
                  Référence {renderSortIcon("reference_courrier")}
                </th>
                <th>Objet</th>
                <th onClick={() => requestSort("id_status")} style={{ cursor: "pointer" }}>
                  Statut {renderSortIcon("id_status")}
                </th>
                <th>Priorité</th>
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
                      <Badge bg="info">
                        {DataStatus.find((s) => s.id_status === c.id_status)?.libelle || c.id_status}
                      </Badge>
                    </td>
                    <td>
                      <Badge
                        bg={
                          c.id_priorite === '4a869293-370b-488c-bb7d-b3e1ffd37eaa'
                            ? "danger"
                            : c.id_priorite === '0dba28dc-8e13-4784-b957-59de6a954e8f'
                            ? "warning"
                            : c.id_priorite === '69bef5bb-5772-4b8c-a928-34ad092437d8' 
                            ? "secondary"
                            : c.id_priorite === '8cf4676e-fe69-4dd5-9558-5da14a363f5a'
                            ? "primary"
                            : "success"
                        }
                      >
                        {DataPriorite.find((p) => p.id_priorite === c.id_priorite)?.niveau ||
                          c.id_priorite}
                      </Badge>
                    </td>
                    <td>
                      {DataTypeCourrier.find((t) => t.id_type_courrier === c.id_type_courrier)?.type ||
                        c.id_type_courrier}
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <Button size="sm" variant="outline-primary" onClick={() => handleDetails(c.id_courrier)}>
                          <FaEye />
                        </Button>      
                        {parsedScopeIds.includes( "ef120502-c060-4ae0-9575-9506832c1a1e" ) ? (
                          <Button size="sm" variant="outline-secondary" onClick={() => handleTransfer(c.id_courrier)}>
                            <FaShare />
                          </Button> ) :''}
                          {parsedScopeIds.includes( "abad4cc2-f595-44ec-a33c-79ea6c5908c1" ) ? (
                          <Button size="sm" variant="outline-warning" onClick={() => handleUpdate(c.id_courrier)}>
                          <FaEdit />
                        </Button> ) :''}
                          {parsedScopeIds.includes( "407d83f9-ef1f-4447-8778-2d1fa481d992" ) ? (
                          <Button size="sm" variant="outline-danger" onClick={() => handleDelete(c.id_courrier)}>
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

export default ListeCourrier;