// src/components/Listestructures.jsx
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
import { useAuth } from "../../contexts/AuthContext";
import { getByIdStructure, suppressionStructure } from "../../actions/Structure";
import { useNavigate } from "react-router";
import {
  FaTrash,
  FaEdit,
  FaEye,
  FaSearch,
} from "react-icons/fa";

const ListeStructure = () => {
  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const { listeStructure } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStructures = async () => {
      try {
        const response = await listeStructure();
        if (Array.isArray(response)) {
          setStructures(response);
        } else {
          setStructures([]);
          console.error("Données de structure inattendues:", response);
        }
      } catch (err) {
        setError("Impossible de charger les structures. Veuillez réessayer plus tard.",err);
        setStructures([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStructures();
  }, [listeStructure]);

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce structure ?")) {
      const user = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null;
      try {
        const result = await getByIdStructure(id);
        if (!result) return;

        let payload = {
          id_structure: id,
          description: result.description,
          id_utilisateur: user.id_utilisateur,
          nom: result.nom,
        };

        const data = await suppressionStructure(id, payload);

        console.log("Suppression réussie :", data);
       
          setStructures(structures.filter((c) => c.id_structure !== id));
         
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
      }
    }
  };

  const handleUpdate = (id) => {
    if (window.confirm("Voulez-vous modifier ce structure ?")) {
      navigate(`/modifier-structure/${id}`);
    }
  };

  const handleDetails = (id) => {
    navigate(`/details-structure/${id}`);
  };

  // Filtrage
  const filteredStructure = structures.filter(
    (c) =>
      c.nom?.toLowerCase().includes(search.toLowerCase()) ||
      c.description
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
      </div>
    );
  }

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container-fluid py-4">
      <Card className="shadow-lg">
        <Card.Header className="d-flex justify-content-between align-items-center bg-success text-white py-3">
          <h4 className="mb-0">📂 Liste des structures</h4>
          <Button variant="" onClick={() => navigate("/ajouter-structure")} className="fw-bold text-black" style={{ backgroundColor: "fuchsia" }}> Ajouter une structure</Button>
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
              <tr className="h4">
                <th>N°</th>
                <th>Structure</th>
                <th>Definition</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStructure.length > 0 ? (
                filteredStructure.map((c, index) => (
                  <tr key={c.id_structure}>
                    <td>{index + 1}</td>
                    <td>
                      <strong>{c.nom}</strong>
                    </td>
                    <td>
                      {c.definition || '--'}
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => handleDetails(c.id_structure)}
                        >
                          <FaEye />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-warning"
                          onClick={() => handleUpdate(c.id_structure)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => handleDelete(c.id_structure)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">
                    Aucun structure trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ListeStructure;
