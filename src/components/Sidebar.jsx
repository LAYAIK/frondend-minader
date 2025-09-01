import { Container, Row, Col, Nav } from "react-bootstrap";
import { HomeIcon, SearchIcon, InboxIcon, ArchiveIcon, PeopleIcon, WorkflowIcon, ReportIcon,
  RepoCloneIcon, GearIcon, CommentDiscussionIcon, TriangleDownIcon, } from '@primer/octicons-react';
import {NavLink } from "react-router";

export default function Sidebar() {
   
  return (
    <Container fluid className="d-flex flex-column vh-100 p-0" >
      <Row className="flex-grow-0" style={{ backgroundColor: 'rgba(58, 158, 8, 0.82)' , borderBottom: '2px solid lightgray' }}>
        <Col>
          <div className="p-3 justify-content-center d-flex align-items-center">
            <div><img src="https://placehold.co/45x45/png" alt="logo MINADER" className="rounded-circle me-2 "/></div>
            <div>
              <h5 className="mb-0" style={{ color: 'white' }}>MINADER</h5>
              <small>Gestion du Courrier</small>
            </div>
            
          </div>
        </Col>
      </Row>
      <Row className="flex-grow-1 " style={{ backgroundColor: 'rgba(58, 158, 8, 0.82)' , overflowY: 'auto' }}>
        <Col>
          <Container fluid className="p-0 h-100 justify-content-center d-flex" style={{overflowY: 'auto'}}>
            <Nav>
              <div className="list-group list-group-flush" >
                <NavLink to="/" className="active nav-link" style={{ fontSize: '22px', fontWeight: 'bold', color: 'white', marginTop: '10px' }}>
                    <HomeIcon size={28}/> Tableau de bord
                </NavLink>
                <hr/>
                <NavLink to="/courriers" className="nav-link btn-toggle rounded collapsed" data-bs-toggle="collapse" data-bs-target="#home-collapse" aria-expanded="false" style={{ fontSize: '18px' ,color:'white'}}>
                    <InboxIcon size={24} /> Courriers <TriangleDownIcon size={20} />
                </NavLink>
                <div className="collapse" id="home-collapse">
                  <ul className="btn-toggle-nav list-unstyled fw-normal">
                   <li><NavLink to="/register-courrier" className="nav-link p-0" style={{ marginLeft: '50px',color:'white' }}>Enregistrer</NavLink></li>
                   <li><NavLink to="/liste-courrier" className="nav-link p-0" style={{ marginLeft: '50px',color:'white' }}>Consulter</NavLink></li>
                   <li><NavLink to="#" className="nav-link p-0" style={{ marginLeft: '50px',color:'white' }}>Modifier</NavLink></li>
                   <li><NavLink to="#" className="nav-link p-0" style={{ marginLeft: '50px',color:'white' }}>Supprimer</NavLink></li>
                   <li><NavLink to="#" className="nav-link p-0" style={{ marginLeft: '50px',color:'white' }}>Rechercher</NavLink></li>
                  </ul>
                </div>
              
                 <NavLink to="/archives" className="nav-link" style={{ fontSize: '18px' ,color:'white'}}>
                    <ArchiveIcon size={24} /> Archives
                </NavLink>
                <NavLink to="/rechercher" className="nav-link" style={{ fontSize: '18px' ,color:'white'}}>
                    <SearchIcon size={24}/> Rechercher
                </NavLink>
                <NavLink to="/utilisateurs" className="nav-link" style={{ fontSize: '18px' ,color:'white'}}>
                    <PeopleIcon size={24} /> Utilisateurs
                </NavLink>
                <NavLink to="/workflows" className="nav-link" style={{ fontSize: '18px' ,color:'white'}}>
                    <WorkflowIcon size={24} /> Workflows
                </NavLink>
                <NavLink to="/structures" className="nav-link" style={{ fontSize: '18px' ,color:'white'}}>
                    <RepoCloneIcon size={24} /> Structures
                </NavLink>
                <NavLink to="/chat" className="nav-link" style={{ fontSize: '18px' ,color:'white'}}>
                    <CommentDiscussionIcon size={24} /> Chat
                </NavLink>
                <NavLink to="/rapports" className="nav-link" style={{ fontSize: '18px' ,color:'white'}}>
                    <ReportIcon size={24} /> Rapports
                </NavLink>
                <NavLink to="/parametres" className="nav-link" style={{ fontSize: '18px' ,color:'white'}}>
                    <GearIcon size={24} /> Paramètres
                </NavLink>
              
            </div>
            </Nav>
          </Container>
        </Col>
      </Row>
      {/* <Row className="flex-grow-0 bg-inf">
        <Col>
          <div className="p-2">
            <small>Footer - Hauteur fixe</small>
          </div>
        </Col>
      </Row> */}
    </Container>
  );
};

