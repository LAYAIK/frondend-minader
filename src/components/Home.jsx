import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Navbar } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { FaInbox, FaCheckCircle, FaArchive } from 'react-icons/fa';
import Chart from 'react-apexcharts'; // Pour les graphiques
export default function Home() {
  const [stats, setStats] = useState({
    pending: 0,
    processedToday: 0,
    archived: 0,
  });

  useEffect(() => {
    // Simuler la récupération de données de l'API
    const fetchData = async () => {
      // Remplacez par votre appel API réel
      const data = {
        pending: 45,
        processedToday: 12,
        archived: 258,
      };
      setStats(data);
    };
    fetchData();
  }, []);

  // Configuration des graphiques
  const barChartOptions = {
    chart: { id: 'basic-bar' },
    xaxis: { categories: ['Entrants', 'Sortants', 'Internes'] },
  };
  const barChartSeries = [
    { name: 'Courriers', data: [55, 30, 15] },
  ];


  return (
        <Container fluid className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Tableau de Bord</h1>

      {/* Section des statistiques */}
      <Row className="mb-8 g-4">
        {/* Carte 1 : Courriers en Attente */}
        <Col md={4}>
          <Card className="shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <Card.Body className="p-5 flex justify-between items-center">
              <div>
                <Card.Title className="text-gray-500 text-sm uppercase tracking-wide">
                  Courriers en Attente
                </Card.Title>
                <Card.Text className="text-4xl font-bold text-blue-600 mt-2">
                  {stats.pending}
                </Card.Text>
              </div>
              <FaInbox size={48} className="text-blue-400" />
            </Card.Body>
          </Card>
        </Col>

        {/* Carte 2 : Courriers Traités Aujourd'hui */}
        <Col md={4}>
          <Card className="shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <Card.Body className="p-5 flex justify-between items-center">
              <div>
                <Card.Title className="text-gray-500 text-sm uppercase tracking-wide">
                  Traités Aujourd'hui
                </Card.Title>
                <Card.Text className="text-4xl font-bold text-green-600 mt-2">
                  {stats.processedToday}
                </Card.Text>
              </div>
              <FaCheckCircle size={48} className="text-green-400" />
            </Card.Body>
          </Card>
        </Col>

        {/* Carte 3 : Courriers Archivés */}
        <Col md={4}>
          <Card className="shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <Card.Body className="p-5 flex justify-between items-center">
              <div>
                <Card.Title className="text-gray-500 text-sm uppercase tracking-wide">
                  Courriers Archivés
                </Card.Title>
                <Card.Text className="text-4xl font-bold text-gray-600 mt-2">
                  {stats.archived}
                </Card.Text>
              </div>
              <FaArchive size={48} className="text-gray-400" />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Section des graphiques */}
      <Row className="g-4 mb-8">
        <Col md={6}>
          <Card className="shadow-lg p-4">
            <Card.Title className="text-xl font-semibold mb-4">
              Activité par Type
            </Card.Title>
            <Chart
              options={barChartOptions}
              series={barChartSeries}
              type="bar"
              height={300}
            />
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-lg p-4">
            <Card.Title className="text-xl font-semibold mb-4">
              Délais de Traitement
            </Card.Title>
            {/* Remplacez par votre graphique */}
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              [Graphique linéaire ici]
            </div>
          </Card>
        </Col>
      </Row>

      {/* Tableau des courriers récents */}
      <Row>
        <Col>
          <Card className="shadow-lg">
            <Card.Body>
              <h3 className="text-xl font-semibold mb-4">Courriers Récents</h3>
              {/* Ajoutez un composant de tableau ici (e.g., une table React-Bootstrap) */}
              <div className="h-[200px] flex items-center justify-center text-gray-500">
                [Tableau des courriers récents ici]
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

