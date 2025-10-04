import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Table } from "react-bootstrap";
import { FaInbox, FaCheckCircle, FaArchive } from "react-icons/fa";
import Chart from "react-apexcharts";
import "../css/Home.css";

export default function Home() {
  const [stats, setStats] = useState({
    pending: 0,
    processedToday: 0,
    archived: 0,
  });

  const [recentCourriers, setRecentCourriers] = useState([]);

  useEffect(() => {
    // Simulation API
    const fetchData = async () => {
      const data = {
        pending: 45,
        processedToday: 12,
        archived: 258,
      };
      setStats(data);

      // Exemples de courriers récents
      setRecentCourriers([
        { id: 1, objet: "Demande de financement", type: "Entrant", date: "2025-09-20" },
        { id: 2, objet: "Rapport mensuel", type: "Interne", date: "2025-09-19" },
        { id: 3, objet: "Invitation conférence", type: "Sortant", date: "2025-09-18" },
      ]);
    };
    fetchData();
  }, []);

  // Graphique barres
  const barChartOptions = {
    chart: { id: "courriers-bar" },
    xaxis: { categories: ["Entrants", "Sortants", "Internes"] },
    colors: ["#3b82f6"],
  };
  const barChartSeries = [{ name: "Courriers", data: [55, 30, 15] }];

  // Graphique donut
  const donutOptions = {
    labels: ["Moins de 24h", "24-48h", "Plus de 48h"],
    colors: ["#22c55e", "#eab308", "#ef4444"],
    legend: { position: "bottom" },
  };
  const donutSeries = [70, 20, 10];

  return (
    <Container fluid className="p-4 bg-light min-vh-100 " style={{ overflowY: "auto"}}>
      <h1 className="fw-bold mb-4 text-dark font-monospace">Gestion des Courriers</h1>

      {/* Statistiques */}
      <Row className="g-4 mb-4">
        <Col md={4} sm={6}>
          <Card className="shadow-sm border-0 h-100 stat-card">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <Card.Title className="text-muted text-uppercase small">
                  Courriers en Attente
                </Card.Title>
                <h2 className="fw-bold text-primary">{stats.pending}</h2>
              </div>
              <FaInbox size={48} className="text-primary opacity-75" />
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} sm={6}>
          <Card className="shadow-sm border-0 h-100 stat-card">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <Card.Title className="text-muted text-uppercase small">
                  Traités Aujourd'hui
                </Card.Title>
                <h2 className="fw-bold text-success">{stats.processedToday}</h2>
              </div>
              <FaCheckCircle size={48} className="text-success opacity-75" />
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} sm={12}>
          <Card className="shadow-sm border-0 h-100 stat-card">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <Card.Title className="text-muted text-uppercase small">
                  Courriers Archivés
                </Card.Title>
                <h2 className="fw-bold text-secondary">{stats.archived}</h2>
              </div>
              <FaArchive size={48} className="text-secondary opacity-75" />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Graphiques */}
      <Row className="g-4 mb-4">
        <Col md={6}>
          <Card className="shadow-sm border-0 p-3">
            <Card.Title className="fw-semibold mb-3">Activité par Type</Card.Title>
            <Chart options={barChartOptions} series={barChartSeries} type="bar" height={300} />
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm border-0 p-3">
            <Card.Title className="fw-semibold mb-3">Délais de Traitement</Card.Title>
            <Chart options={donutOptions} series={donutSeries} type="donut" height={300} />
          </Card>
        </Col>
      </Row>

      {/* Tableau des courriers récents */}
      <Row>
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h3 className="fw-semibold mb-3">📂 Courriers Récents</h3>
              <Table hover responsive className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Objet</th>
                    <th>Type</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCourriers.map((c) => (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td>{c.objet}</td>
                      <td>{c.type}</td>
                      <td>{c.date}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}