// src/components/service-authen/ListeUtilisateur.jsx
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
} from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { useDataStructure } from "../../data/serviceStructurePerso";
import {
  getByIdUtilisateur,
  suppressionUtilisateur,
} from "../../actions/Utilisateur";
import { useNavigate } from "react-router";
import { FaTrash, FaEdit, FaEye, FaSearch, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

const ListeUtilisateur = () => {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "noms", direction: "asc" });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const utilisateursParPage = 5;

  const { listeUtilisateur } = useAuth();
  const navigate = useNavigate();
  const { DataStructure } = useDataStructure();

  useEffect(() => {
    const fetchUtilisateurs = async () => {
      try {
        const response = await listeUtilisateur();
        if (Array.isArray(response)) {
          setUtilisateurs(response);
        } else {
          setUtilisateurs([]);
        }
      } catch (err) {
        setError("Impossible de charger les utilisateurs. Veuillez réessayer plus tard.",err);
      } finally {
        setLoading(false);
      }
    };
    fetchUtilisateurs();
  }, [listeUtilisateur]);

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      const user = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null;
      try {
        if (user.id_utilisateur === id) {
          alert("⚠️ Vous ne pouvez pas supprimer votre propre compte.");
          return;
        }
        const result = await getByIdUtilisateur(id);
        if (!result) return;

        let payload = {
          id_utilisateur: user.id_utilisateur,
          noms: result.noms,
          prenoms: result.prenoms,
          adresse_email: result.adresse_email,
          id_structure: result.id_structure,
          id_fonction: result.id_fonction,
          is_active: 0,
        };

        const resultat = await suppressionUtilisateur(id, payload);
        if (resultat) {
          setUtilisateurs(utilisateurs.filter((c) => c.id_utilisateur !== id));
        }
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
      }
    }
  };

  const handleUpdate = (id) => navigate(`/modifier-utilisateur/${id}`);
  const handleDetails = (id) => navigate(`/detail-utilisateur/${id}`);

  // 🔎 Filtrage recherche
  const filteredUtilisateurs = utilisateurs.filter(
    (u) =>
      u.noms?.toLowerCase().includes(search.toLowerCase()) ||
      u.prenoms?.toLowerCase().includes(search.toLowerCase()) ||
      u.adresse_email?.toLowerCase().includes(search.toLowerCase()) ||
      u.fonction?.toLowerCase().includes(search.toLowerCase()) ||
      DataStructure.find((o) => o.id_structure === u.id_structure)?.nom
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  // 🔀 Tri dynamique
  const sortedUtilisateurs = [...filteredUtilisateurs].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const valA = (a[sortConfig.key] || "").toString().toLowerCase();
    const valB = (b[sortConfig.key] || "").toString().toLowerCase();

    if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // 📄 Pagination
  const indexOfLast = currentPage * utilisateursParPage;
  const indexOfFirst = indexOfLast - utilisateursParPage;
  const currentUtilisateurs = sortedUtilisateurs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedUtilisateurs.length / utilisateursParPage);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="grow" variant="success" />
        <span className="ms-2 text-success">Chargement des utilisateurs...</span>
      </div>
    );
  }

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container-fluid py-4">
      <Card className="shadow-lg border-0">
        <Card.Header className="d-flex justify-content-between align-items-center bg-success text-white">
          <h4 className="mb-0 fw-bold">📋 Liste des utilisateurs</h4>
          <InputGroup style={{ maxWidth: "300px" }}>
            <InputGroup.Text className="bg-light">
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
                <th onClick={() => handleSort("noms")} style={{ cursor: "pointer" }}>
                  Nom {sortConfig.key === "noms" && (sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />)}
                </th>
                <th onClick={() => handleSort("prenoms")} style={{ cursor: "pointer" }}>
                  Prénom {sortConfig.key === "prenoms" && (sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />)}
                </th>
                <th onClick={() => handleSort("adresse_email")} style={{ cursor: "pointer" }}>
                  Email {sortConfig.key === "adresse_email" && (sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />)}
                </th>
                <th>Fonction</th>
                <th>Structure</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUtilisateurs.length > 0 ? (
                currentUtilisateurs.map((c, index) => (
                  <tr key={c.id_utilisateur}>
                    <td>{indexOfFirst + index + 1}</td>
                    <td className="fw-bold">{c.noms}</td>
                    <td>{c.prenoms}</td>
                    <td><Badge bg="info">{c.adresse_email}</Badge></td>
                    <td><Badge bg="secondary">{c.fonction}</Badge></td>
                    <td>
                      {DataStructure.find((t) => t.id_structure === c.id_structure)?.nom || c.id_structure}
                    </td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <Button size="sm" variant="outline-primary" onClick={() => handleDetails(c.id_utilisateur)}>
                          <FaEye /> 
                        </Button>
                        <Button size="sm" variant="outline-warning" onClick={() => handleUpdate(c.id_utilisateur)}>
                          <FaEdit /> 
                        </Button>
                        <Button size="sm" variant="outline-danger" onClick={() => handleDelete(c.id_utilisateur)}>
                          <FaTrash /> 
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">
                    🚫 Aucun utilisateur trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>

        {/* 📌 Pagination */}
        <Card.Footer className="d-flex justify-content-center">
          <Pagination>
            <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
            <Pagination.Prev onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} />
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item
                key={i}
                active={i + 1 === currentPage}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} />
            <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
          </Pagination>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default ListeUtilisateur;
