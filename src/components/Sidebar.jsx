
import React, { useState } from "react";
import { Container, Row, Col, Nav, Collapse } from "react-bootstrap";
import { NavLink } from "react-router";
import {
  HomeIcon,
  SearchIcon,
  InboxIcon,
  ArchiveIcon,
  PeopleIcon,
  WorkflowIcon,
  ReportIcon,
  RepoCloneIcon,
  GearIcon,
  CommentDiscussionIcon,
  TriangleDownIcon,
} from "@primer/octicons-react";

import "../css/Sidebar.css"; // styles ci-dessous

export default function Sidebar() {
  const [openCourriers, setOpenCourriers] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true); // contrôle du sidebar

  return (
    <>
    {/* Bouton toggle visible seulement sur mobile */}
      <button
        className="btn btn-outline-light d-md-none m-2"
        onClick={() => setShowSidebar(!showSidebar)}
      >
        ☰
      </button>
    <Container fluid className={`sidebar-container d-flex flex-column vh-100 p-0 ${showSidebar ? "show" : "hide"}`}>
      <Row className="flex-grow-0 sidebar-header">
        <Col>
          <div className="p-3 d-flex align-items-center">
            <img
              src="https://placehold.co/45x45/png"
              alt="logo MINADER"
              className="rounded-circle me-2"
            />
            <div>
              <h4 className="mb-0 text-white">MINADER</h4>
              <small className="text-white-50">Gestion du Courrier</small>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="flex-grow-1 sidebar-body">
        <Col className="p-0">
          <Nav className="flex-column p-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                "nav-link d-flex align-items-center gap-2" + (isActive ? " active" : "")
              }
            >
              <HomeIcon size={22} /> <span style={{ fontSize: "20px" }}>Tableau de bord</span>
            </NavLink>

            <hr className="my-2" />

            {/* Bouton collapse pour Courriers */}
            <button
              type="button"
              className="btn btn-toggle nav-link d-flex align-items-center gap-2"
              onClick={() => setOpenCourriers((s) => !s)}
              aria-expanded={openCourriers}
            >
              <InboxIcon size={18} />
              <span>Courriers</span>
              <TriangleDownIcon size={19} className={`ms-auto toggle-icon ${openCourriers ? "open" : ""}`} />
            </button>

            <Collapse in={openCourriers}>
              <div className="submenu ps-3">
                <NavLink to="/register-courrier" className="nav-link small">
                  Enregistrer
                </NavLink>
                <NavLink to="/liste-courrier" className="nav-link small">
                  Consulter
                </NavLink>
                <NavLink to="/rechercher" className="nav-link small">
                  Rechercher
                </NavLink>
              </div>
            </Collapse>

            <NavLink
              to="/liste-archive"
              className={({ isActive }) =>
                "nav-link d-flex align-items-center gap-2" + (isActive ? " active" : "")
              }
            >
              <ArchiveIcon size={19} /> <span>Archives</span>
            </NavLink>

            <NavLink
              to="/rechercher"
              className={({ isActive }) =>
                "nav-link d-flex align-items-center gap-2" + (isActive ? " active" : "")
            }
            >
              <SearchIcon size={19} /> <span>Rechercher</span>
            </NavLink>

            <NavLink
              to="/liste-utilisateur"
              className={({ isActive }) =>
                "nav-link d-flex align-items-center gap-2" + (isActive ? " active" : "")
              }
            >
              <PeopleIcon size={19} /> <span>Utilisateurs</span>
            </NavLink>

            <NavLink
              to="/workflow"
              className={({ isActive }) =>
                "nav-link d-flex align-items-center gap-2" + (isActive ? " active" : "")
              }
            >
              <WorkflowIcon size={19} /> <span>Workflows</span>
            </NavLink>

            <NavLink
              to="/liste-structure"
              className={({ isActive }) =>
                "nav-link d-flex align-items-center gap-2" + (isActive ? " active" : "")
            }
            >
              <RepoCloneIcon size={19} /> <span>Structures</span>
            </NavLink>

            <NavLink
              to="/chat"
              className={({ isActive }) =>
                "nav-link d-flex align-items-center gap-2" + (isActive ? " active" : "")
              }
            >
              <CommentDiscussionIcon size={19} /> <span>Chat</span>
            </NavLink>
            <NavLink
              to="/app-chat1"
              className={({ isActive }) =>
                "nav-link d-flex align-items-center gap-2" + (isActive ? " active" : "")
              }
            >
              <CommentDiscussionIcon size={19} /> <span>APP Chat 1</span>
            </NavLink>

            <NavLink
              to="/notifications"
              className={({ isActive }) =>
                "nav-link d-flex align-items-center gap-2" + (isActive ? " active" : "")
              }
            >
              <CommentDiscussionIcon size={19} /> <span>Notifications</span>
            </NavLink>

            <NavLink
              to="/rapports"
              className={({ isActive }) =>
                "nav-link d-flex align-items-center gap-2" + (isActive ? " active" : "")
            }
            >
              <ReportIcon size={19} /> <span>Rapports</span>
            </NavLink>

            <NavLink
              to="/parametres"
              className={({ isActive }) =>
                "nav-link d-flex align-items-center gap-2" + (isActive ? " active" : "")
            }
            >
              <GearIcon size={19} /> <span>Paramètres</span>
            </NavLink>
          </Nav>
        </Col>
      </Row>
    </Container>
            </>
  );
}


