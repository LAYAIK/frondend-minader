import React from 'react'
import { Container,Navbar,Button,Badge } from 'react-bootstrap'
import { BellIcon, UnreadIcon } from '@primer/octicons-react'
import { NavLink } from 'react-router'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router'
export default function Header() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  console.log("user ", user);
  console.log("user image ", user ? user.image_profile_url :"fff" );

    const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  return (
 <div className="container-fluid p-0">
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom p-3">
                <div className="container-fluid">
                    <span className="navbar-brand me-4 d-none d-md-block text-muted">MINADER GEC</span>
                    <div className="input-group flex-grow-1 me-5" style={{ maxWidth: '400px' }}>
                        <input type="text" className="form-control" placeholder="Rechercher..." aria-label="Rechercher"/>
                    </div>
                    <div className="d-flex align-items-center">
                        <button className="btn btn-outline fs-1  p-0 mx-0"  title="Notifications">
                          <BellIcon size={20} /><span className="badge" style={{ fontSize: '15px' , color: 'red'}}> 3</span>
                        </button>
                        <button className="btn btn-outline me-2" type="button" title="Messages">
                            <span className="badge bg-danger"><UnreadIcon size={16} /> 5</span>
                        </button>
                        <Button variant="primary"><UnreadIcon size={20} /> <Badge bg="danger">9</Badge><span className="visually-hidden">unread messages</span>
                        </Button>

                      <div className="dropdown">
                        <NavLink className="nav-link dropdown-toggle" to="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <img src={user.image_profile_url ? user.image_profile_url :`https://placehold.co/45x45/png`} alt="User Avatar" className="rounded-circle me-1" style={{ width: '30px', height: '30px' }}/>
                           { user ? user.noms +' '+user.prenoms : 'Utilisateur'}
                        </NavLink>
                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                            <li><NavLink className="dropdown-item" to="#">Profil</NavLink></li>
                            <li><NavLink className="dropdown-item" to="#">Paramètres</NavLink></li>
                            <li><hr className="dropdown-divider"/></li>
                            <li><Button className="dropdown-item" onClick={handleLogout}>Déconnexion</Button></li>
                        </ul>
                      </div>
                    </div>
                </div>
            </nav>
 </div>
  )
}
