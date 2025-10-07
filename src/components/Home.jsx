import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Table, Button, Form } from "react-bootstrap";
import { FaInbox, FaCheckCircle, FaArchive, FaClock } from "react-icons/fa";
import Chart from "react-apexcharts";
import { useDataCourrier,useDataTypeCourrier,useDataHistoriqueCourrier } from "../data/serviceCourrierData";
import { useDataObjet, useDataStatus } from "../data/serviceAutreData";
import "../css/Home.css";

export default function Home() {
  const { DataCourrier } = useDataCourrier();
  const { DataObjet } = useDataObjet();
  const { DataStatus } = useDataStatus();
  const { DataHistoriqueCourrier } = useDataHistoriqueCourrier();
  const { DataTypeCourrier } = useDataTypeCourrier();
  const [stats, setStats] = useState({ enAttente: 0, traiter: 0, archiver: 0, enCours: 0 });
  const [recentCourriers, setRecentCourriers] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("mois");

  // --- Simulation des données dynamiques
  useEffect(() => {
    const courriers = Array.isArray(DataCourrier) ? DataCourrier : [];
    const counts = { enAttente: 0, traiter: 0, archiver: 0, enCours: 0 };
    
    courriers.forEach((courrier) => {
      if (courrier.id_status === '2f42f43e-e0f3-4125-b6e2-c8d1a1f95394') counts.enAttente += 1;
      if (courrier.id_status === '0e0d54a6-03f6-44a9-a92d-36d57940d74a') counts.traiter += 1;
      if (courrier.id_status === '2763fb62-7795-4612-8e11-2391a47b1f00') counts.enCours += 1;
    }); 
    const historiques = Array.isArray(DataHistoriqueCourrier) ? DataHistoriqueCourrier : [];
    historiques.forEach((h) => {
      if (h.action === 'Archiver') counts.archiver += 1;
    });
    
    setStats(counts);

      if (Array.isArray(DataCourrier) && DataCourrier.length > 0) {
      // 🔹 On trie les courriers par date de création (du plus récent au plus ancien)
      const sorted = [...DataCourrier].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      // 🔹 On prend uniquement les 4 plus récents
      setRecentCourriers(sorted.slice(0, 4));
    }


  }, [DataCourrier, DataHistoriqueCourrier]);

  // --- Graphique 1 : Activité par Type
  const barChartOptions = {
    chart: { id: "courriers-bar", toolbar: { show: false } },
    xaxis: { categories: ["Entrants", "Sortants", "Internes"], labels: { style: { colors: "#6b7280" } } },
    colors: ["#3b82f6"],
    plotOptions: { bar: { borderRadius: 6 } },
  };
  const barChartSeries = [{ name: "Courriers", data: [55, 30, 15] }];

  // --- Graphique 2 : Délais de traitement (Donut)
  const donutOptions = {
    labels: ["Moins de 24h", "24-48h", "Plus de 48h"],
    colors: ["#22c55e", "#eab308", "#ef4444"],
    legend: { position: "bottom" },
    dataLabels: { style: { fontSize: "14px" } },
  };
  const donutSeries = [60, 25, 15];

  // --- Graphique 3 : Évolution du traitement (Line chart)
  const lineOptions = {
    chart: { id: "line", toolbar: { show: false } },
    xaxis: { categories: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"] },
    stroke: { curve: "smooth" },
    colors: ["#0ea5e9"],
  };
  const lineSeries = [{ name: "Courriers traités", data: [2, 4, 3, 5, 4, 6, 8] }];

  const formatDate = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d)) return value;
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Loading local state pour l'affichage du tableau
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Considère que les données sont prêtes quand les tableaux essentiels existent
    const ready =
      Array.isArray(DataCourrier) &&
      Array.isArray(DataObjet) &&
      Array.isArray(DataTypeCourrier);
    setLoading(!ready);
  }, [DataCourrier, DataObjet, DataTypeCourrier]);

  return (
    <Container fluid className="p-4 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark font-monospace">Gestion - Courriers</h2>
        <Form.Select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          style={{ width: "180px" }}
        >
          <option value="jour">Aujourd'hui</option>
          <option value="semaine">Cette semaine</option>
          <option value="mois">Ce mois</option>
        </Form.Select>
      </div>

      {/* === STAT CARDS === */}
      <Row className="g-4 mb-4">
        {[
          { title: "En cours", value: stats.enCours, icon: <FaClock />, color: "primary" },
          { title: "En attente", value: stats.enAttente, icon: <FaInbox />, color: "warning" },
          { title: "Traités", value: stats.traiter, icon: <FaCheckCircle />, color: "success" },
          { title: "Archivés", value: stats.archiver, icon: <FaArchive />, color: "secondary" },
        ].map((stat, i) => (
          <Col md={3} sm={6} key={i}>
            <Card className={`shadow-sm border-0 h-100 bg-${stat.color}-subtle stat-card`}>
              <Card.Body className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title className="text-uppercase small text-muted">{stat.title}</Card.Title>
                  <h2 className={`fw-bold text-${stat.color}`}>{stat.value}</h2>
                </div>
                <div className={`display-6 text-${stat.color}`}>{stat.icon}</div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* === GRAPH SECTION === */}
      <Row className="g-4 mb-4">
        <Col lg={4} md={12}>
          <Card className="shadow-sm border-0 p-3">
            <Card.Title className="fw-semibold mb-3">📈 Activité par Type</Card.Title>
            <Chart options={barChartOptions} series={barChartSeries} type="bar" height={150} />
          </Card>
        </Col>

        <Col lg={4} md={12}>
          <Card className="shadow-sm border-0 p-3">
            <Card.Title className="fw-semibold mb-3">🕒 Délais de Traitement</Card.Title>
            <Chart options={donutOptions} series={donutSeries} type="donut" height={166} />
          </Card>
        </Col>
        <Col lg={4} md={12}>
          <Card className="shadow-sm border-0 p-3">
            <Card.Title className="fw-semibold mb-3">📅 Évolution Hebdomadaire</Card.Title>
            <Chart options={lineOptions} series={lineSeries} type="line" height={150} />
          </Card>
        </Col>
      </Row>

      {/* === TABLEAU COURRIERS RÉCENTS === */}
      <Card className="shadow-sm border-0 mt-3">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Card.Title className="fw-semibold">📂 Courriers Récents</Card.Title>
            <Button variant="outline-primary" size="sm">Voir tout</Button>
          </div>

          {loading ? (
            // Affiche un spinner tant que les données ne sont pas prêtes
            <div className="text-center py-5">
              <div className="spinner-border text-primary mb-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div>Chargement des courriers...</div>
            </div>
          ) : (
            <Table hover responsive className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>Reference</th>
                  <th>Objet</th>
                  <th>Type</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentCourriers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center text-muted py-4">
                      Aucun courrier récent
                    </td>
                  </tr>
                ) : (
                  recentCourriers.map((c) => (
                    <tr key={c.id_courrier}>
                      <td>{c.reference_courrier}</td>
                      <td>{DataObjet.find(obj => obj.id_objet === c.id_objet)?.libelle ?? "-"}</td>
                      <td>{DataTypeCourrier.find(type => type.id_type_courrier === c.id_type_courrier)?.type ?? "-"}</td>
                      <td>{formatDate(c.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
