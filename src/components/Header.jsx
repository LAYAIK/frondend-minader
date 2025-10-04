
import React from "react";
import { Button, Badge } from "react-bootstrap";
import { BellIcon, UnreadIcon } from "@primer/octicons-react";
import { NavLink } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import "../css/Header.css";

export default function Header() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    
    <header className="navbar navbar-expand-lg fixed custom-navbar px-3">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Logo / Titre */}
        <span className="navbar-brand fw-bold text-black d-none d-md-block">
          MINADER GEC
        </span>

        {/* Barre de recherche */}
        <div className="input-group search-bar d-none d-md-flex">
          <input
            type="text"
            className="form-control"
            placeholder="Rechercher..."
            aria-label="Rechercher"
          />
        </div>

        {/* Icônes à droite */}
        <div className="d-flex align-items-center gap-3">
          {/* Notifications */}
          <button
            className="btn btn-icon position-relative"
            title="Notifications"
          >
            <BellIcon size={22} className="text-black" />
            <span className="badge bg-danger rounded-pill notif-badge">3</span>
          </button>

          {/* Messages */}
          <button className="btn btn-icon position-relative" title="Messages">
            <UnreadIcon size={22} className="text-black" />
            <span className="badge bg-warning rounded-pill notif-badge">5</span>
          </button>

          {/* Profil utilisateur */}
          <div className="dropdown">
            <NavLink
              className="nav-link dropdown-toggle text-black d-flex align-items-center"
              to="#"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src={
                  user?.image_profile_url
                    ? user.image_profile_url
                    : `https://placehold.co/45x45/png`
                }
                alt="User Avatar"
                className="rounded-circle me-2"
                style={{ width: "32px", height: "32px" }}
              />
              <span className="fw-semibold">
                {user ? user.noms + " " + user.prenoms : "Utilisateur"}
              </span>
            </NavLink>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <NavLink className="dropdown-item" to="#">
                  Profil
                </NavLink>
              </li>
              <li>
                <NavLink className="dropdown-item" to="#">
                  Paramètres
                </NavLink>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <Button
                  className="dropdown-item text-danger"
                  onClick={handleLogout}
                >
                  Déconnexion
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
            
  );
}
