import React, { useState } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../contexts/AuthContext.jsx";
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { FaBars } from "react-icons/fa";
import '../css/PrivateRoute.css'

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Pendant le chargement de l’authentification
  if (loading) {
    return (
      <div className="d-flex vh-100 vw-100 justify-content-center align-items-center bg-light">
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3 text-muted">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Si non authentifié → redirection
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="vh-100 d-flex flex-column bg-body-tertiary">
      {/* HEADER */}
      <Header />

      {/* Bouton d’ouverture du menu mobile */}
      <div className="d-md-none text-start p-2">
        <Button
          variant="outline-primary"
          className="rounded-circle shadow-sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FaBars size={20} />
        </Button>
      </div>

      <Container fluid className="flex-grow-1 overflow-hidden">
        <Row className="h-100">
          {/* SIDEBAR (avec animation Framer Motion) */}
          <AnimatePresence>
            {(sidebarOpen || window.innerWidth >= 768) && (
              <motion.div
                initial={{ x: -250, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -250, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="col-10 col-md-2 bg-white shadow-sm border-end position-relative z-3"
                style={{
                  position: window.innerWidth < 768 ? "absolute" : "relative",
                  height: "100%",
                  top: 0,
                  left: 0,
                }}
              >
                <Sidebar onClose={() => setSidebarOpen(false)} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* CONTENU PRINCIPAL */}
          <Col
            xs={12}
            md={10}
            className="p-3 overflow-auto"
            style={{ height: "calc(100vh - 60px)" }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-4 shadow-sm p-3"
            >
              {children}
            </motion.div>
          </Col>
        </Row>
      </Container>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default PrivateRoute;


