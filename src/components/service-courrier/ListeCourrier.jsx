import React, { useState, useEffect, useMemo } from "react";
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
  FaSortUp,
  FaSortDown,
  FaFilter,
  FaSyncAlt,
} from "react-icons/fa";
import "../../css/List.css";

export default function ListeCourrier() {
  const [courriers, setCourriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState("desc"); // 🔹 tri du plus récent au plus ancien

  const { listeCourrier } = useAuth();
  const { DataObjet } = useDataObjet();
  const { DataPriorite } = useDataPriorite();
  const { DataStatus } = useDataStatus();
  const { DataTypeCourrier } = useDataTypeCourrier();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const parsedScopeIds = JSON.parse(localStorage.getItem("scopeIds") || "[]");

  // 🔹 Chargement des courriers
  useEffect(() => {
    const fetchCourriers = async () => {
      setLoading(true);
      try {
        const response = await listeCourrier();
        if (Array.isArray(response)) {
          // ✅ tri initial : les plus récents d'abord
          const sorted = [...response].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setCourriers(sorted);
        } else {
          console.error("Réponse inattendue :", response);
          setCourriers([]);
        }
      } catch (err) {
        console.error("Erreur chargement courriers :", err);
        setError("Impossible de charger les courriers. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourriers();
  }, [listeCourrier]);

  // 🔹 Suppression
  const handleDelete = async (id) => {
    if (window.confirm("Confirmer la suppression de ce courrier ?")) {
      try {
        const result = await getByIdCourrier(id);
        if (!result) return;
        const payload = {
          id_courrier: result.id_courrier,
          id_objet: result.id_objet,
          id_utilisateur: user.id_utilisateur,
          reference_courrier: result.reference_courrier,
          id_type_courrier: result.id_type_courrier,
          id_structure: result.id_structure,
        };
        await suppressionCourrier(id, payload);
        setCourriers((prev) => prev.filter((c) => c.id_courrier !== id));
      } catch (error) {
        console.error("Erreur suppression :", error);
      }
    }
  };

  const handleUpdate = (id) => navigate(`/modifier-courrier/${id}`);
  const handleTransfer = (id) => navigate(`/transfert-courrier/${id}`);
  const handleDetails = (id) => navigate(`/detail-courrier/${id}`);

  // 🔹 Recherche et filtrage
  const filteredCourriers = useMemo(() => {
    return courriers.filter((c) => {
      const matchSearch =
        c.reference_courrier?.toLowerCase().includes(search.toLowerCase()) ||
        DataObjet.find((o) => o.id_objet === c.id_objet)?.libelle
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchStatus = selectedFilter ? c.id_status === selectedFilter : true;
      return matchSearch && matchStatus;
    });
  }, [courriers, search, selectedFilter, DataObjet]);

  // 🔹 Tri par date
  const sortedCourriers = useMemo(() => {
    return [...filteredCourriers].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [filteredCourriers, sortOrder]);

  // 🔹 Pagination
  const totalPages = Math.ceil(sortedCourriers.length / itemsPerPage);
  const currentCourriers = sortedCourriers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 🔹 Chargement
  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="success" />
        <span className="ms-2 text-success">Chargement des courriers...</span>
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container-fluid py-4">
      <Card className="shadow-lg border-0">
        <Card.Header className="d-flex flex-wrap justify-content-between align-items-center bg-success text-white p-3">
          <h4 className="mb-0">📬 Liste des Courriers</h4>
          <div className="d-flex align-items-center gap-2">
            <InputGroup>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <FormControl
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="shadow-sm"
              />
            </InputGroup>
            <Button
              variant="light"
              size="sm"
              onClick={() =>
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
              }
              title="Inverser l'ordre"
            >
              {sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />}
            </Button>
          </div>
        </Card.Header>

        {/* 🔸 Filtres */}
        <div className="d-flex flex-wrap justify-content-between align-items-center p-3 bg-light border-bottom">
          <div className="d-flex align-items-center gap-2">
            <Form.Label className="fw-bold text-secondary mb-0">
              <FaFilter className="me-1 text-success" /> Statut :
            </Form.Label>
            <Form.Select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="shadow-sm border-success"
              style={{ width: "200px" }}
            >
              <option value="">Tous les statuts</option>
              {DataStatus.map((s) => (
                <option key={s.id_status} value={s.id_status}>
                  {s.libelle}
                </option>
              ))}
            </Form.Select>
          </div>

          {selectedFilter && (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => setSelectedFilter("")}
            >
              <FaSyncAlt className="me-1" /> Réinitialiser
            </Button>
          )}
        </div>

        {/* 🔹 Tableau */}
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0 text-center align-middle">
            <thead className="table-success">
              <tr>
                <th>#</th>
                <th>Référence</th>
                <th>Objet</th>
                <th>Statut</th>
                <th>Priorité</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentCourriers.length ? (
                currentCourriers.map((c, i) => (
                  <tr key={c.id_courrier}>
                    <td>{(currentPage - 1) * itemsPerPage + i + 1}</td>
                    <td>
                      <strong>{c.reference_courrier}</strong>
                    </td>
                    <td>
                      {DataObjet.find((o) => o.id_objet === c.id_objet)?.libelle ||
                        "N/A"}
                    </td>
                    <td>
                      <Badge bg="info">
                        {DataStatus.find((s) => s.id_status === c.id_status)
                          ?.libelle || "N/A"}
                      </Badge>
                    </td>
                    <td>
                      <Badge
                        bg={
                          c.id_priorite ===
                          "4a869293-370b-488c-bb7d-b3e1ffd37eaa"
                            ? "danger"
                            : c.id_priorite ===
                              "0dba28dc-8e13-4784-b957-59de6a954e8f"
                            ? "warning"
                            : "success"
                        }
                      >
                        {DataPriorite.find(
                          (p) => p.id_priorite === c.id_priorite
                        )?.niveau || "N/A"}
                      </Badge>
                    </td>
                    <td>
                      {
                        DataTypeCourrier.find(
                          (t) => t.id_type_courrier === c.id_type_courrier
                        )?.type
                      }
                    </td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => handleDetails(c.id_courrier)}
                        >
                          <FaEye />
                        </Button>

                        {parsedScopeIds.includes("ef120502-c060-4ae0-9575-9506832c1a1e") && (
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            onClick={() => handleTransfer(c.id_courrier)}
                          >
                            <FaShare />
                          </Button>
                        )}

                        {parsedScopeIds.includes("abad4cc2-f595-44ec-a33c-79ea6c5908c1") &&
                          user.id_utilisateur !== c.id_utilisateur_transmis && (
                            <Button
                              size="sm"
                              variant="outline-warning"
                              onClick={() => handleUpdate(c.id_courrier)}
                            >
                              <FaEdit />
                            </Button>
                          )}

                        {parsedScopeIds.includes("407d83f9-ef1f-4447-8778-2d1fa481d992") && (
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleDelete(c.id_courrier)}
                          >
                            <FaTrash />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-muted py-4">
                    Aucun courrier trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>

        {/* 🔹 Pagination */}
        <Card.Footer className="d-flex flex-column flex-md-row justify-content-between align-items-center">
          <Form.Select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            style={{ maxWidth: "150px" }}
          >
            <option value={5}>5 par page</option>
            <option value={10}>10 par page</option>
            <option value={20}>20 par page</option>
          </Form.Select>

          <Pagination className="mt-3 mt-md-0">
            <Pagination.First
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            />
            <Pagination.Prev
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            />
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
}
