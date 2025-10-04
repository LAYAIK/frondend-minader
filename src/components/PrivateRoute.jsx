// import React from 'react';
// import { Navigate } from 'react-router';
// import { useAuth } from '../contexts/AuthContext.jsx';
// import { Col, Container, Nav, Row } from 'react-bootstrap';
// import Sidebar from './Sidebar.jsx';
// import Header from './Header.jsx';
// import Footer from './Footer.jsx';

// const PrivateRoute = ({ children }) => {
//   const { isAuthenticated, loading } = useAuth();

//   if (loading) {
//     return <div className="loading">Vérification de l'authentification...</div>;
//   }

//   return isAuthenticated ? 
//       <div >
//       <Container fluid >
//         <Row className="vh-100">
//           <Col xs={12} md={2} className="d-flex flex-column ">
//             <Nav>
//                <Sidebar />
//             </Nav>
//           </Col>
//           <Col  xs={12} md={10} className="d-flex flex-column">
//             <Row  className="flex-grow-0" >
//               <Header />
//             </Row>
//             {/* MAIN CONTAIN AREA */}
//             <Row  className="flex-grow-1" style={{backgroundColor: '#dd168aff' }}>  
//               <Container fluid className="p-0 h-100 justify-content-center d-flex" style={{overflowY: 'auto'}} >
//                 {children}
//               </Container>
//             </Row>
//             <Row className="mt-auto fixed-bottom">
//               <Footer />  
//             </Row>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//    : <Navigate to="/login" replace />;
// };

// export default PrivateRoute;



import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Col, Container, Nav, Row, Spinner } from 'react-bootstrap';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

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

  return isAuthenticated ? (
    <Container fluid className="p-0">
      <Row className="vh-100 g-0">
        {/* Sidebar */}
        <Col xs={12} md={2} className="bg-dark text-white shadow-lg d-flex flex-column p-0">
          <Nav className="flex-column flex-grow-1">
            <Sidebar />
          </Nav>
        </Col>

        {/* Main Content */}
        <Col xs={12} md={10} className="d-flex flex-column">
          {/* Header */}
          <Row className="flex-grow-0 shadow-sm">
            <Header />
          </Row>

          {/* Main Area */}
          <Row className="flex-grow-1 overflow-auto bg-light">
            <Container fluid className="p-4">
              {children}
            </Container>
          </Row>

          {/* Footer */}
          <Row className="flex-grow-0 bg-dark text-white text-center py-2 shadow-sm">
            <Footer />
          </Row>
        </Col>
      </Row>
    </Container>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoute;


// import React from 'react';
// import { Navigate } from 'react-router';
// import { useAuth } from '../contexts/AuthContext.jsx';
// import { Col, Container, Nav, Row, Spinner } from 'react-bootstrap';
// import Sidebar from './Sidebar.jsx';
// import Header from './Header.jsx';
// import Footer from './Footer.jsx';

// const PrivateRoute = ({ children }) => {
//   const { isAuthenticated, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="d-flex vh-100 justify-content-center align-items-center bg-light">
//         <div className="text-center">
//           <Spinner animation="border" variant="primary" size="lg" />
//           <p className="mt-3 text-muted fw-semibold">
//             Vérification de l'authentification...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return isAuthenticated ? (
//     <Container fluid className="p-0">
//       <Row className="min-vh-100 g-0">
//         {/* Sidebar */}
//         <Col
//           xs={12}
//           md={2}
//           className="bg-dark text-white d-flex flex-column p-0 shadow-lg"
//           style={{ minHeight: '100vh' }}
//         >
//           <Nav className="flex-column flex-grow-1 p-3">
//             <Sidebar />
//           </Nav>
//         </Col>

//         {/* Main Content */}
//         <Col xs={12} md={10} className="d-flex flex-column">
//           {/* Header */}
//           <Row className="flex-grow-0 shadow-sm bg-white">
//             <Header />
//           </Row>

//           {/* Main Area */}
//           <Row
//             className="flex-grow-1"
//             style={{
//               backgroundColor: '#f8f9fa',
//               overflowY: 'auto',
//             }}
//           >
//             <Container
//               fluid
//               className="p-4 d-flex flex-column"
//               style={{ minHeight: '100%' }}
//             >
//               {children}
//             </Container>
//           </Row>

//           {/* Footer */}
//           <Row className="flex-grow-0 shadow-sm bg-light">
//             <Footer />
//           </Row>
//         </Col>
//       </Row>
//     </Container>
//   ) : (
//     <Navigate to="/login" replace />
//   );
// };

// export default PrivateRoute;

