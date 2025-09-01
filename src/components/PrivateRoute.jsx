import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Col, Container, Nav, Row } from 'react-bootstrap';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading">Vérification de l'authentification...</div>;
  }

  return isAuthenticated ? 
      <div >
      <Container fluid >
        <Row className="vh-100">
          <Col xs={12} md={2} className="d-flex flex-column ">
            <Nav>
               <Sidebar />
            </Nav>
          </Col>
          <Col  xs={12} md={10} className="d-flex flex-column ">
            <Row  className="mb-" >
              <Header />
            </Row>
            {/* MAIN CONTAIN AREA */}
            <Row  className="flex-grow-1" style={{ overflowY: 'auto', backgroundColor: '#dd168aff' }}>  
              <Container fluid className="p-0 h-100 justify-content-center d-flex" style={{overflowY: 'auto'}} >
                {children}
              </Container>
            </Row>
            <Row className="mt-auto">
              <Footer />  
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
   : <Navigate to="/login" replace />;
};

export default PrivateRoute;