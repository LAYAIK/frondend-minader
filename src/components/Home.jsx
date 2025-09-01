import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
//import { useState, useEffect } from 'react';
import { Routes, Route, Link, } from 'react-router';
//import { useAuth } from '../contexts/AuthContext';
//import { authAPI } from '../api/index.js';
import { Container, Row, Col, Navbar } from 'react-bootstrap';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Rapports from './Rapports.jsx';
import { Nav  } from 'react-bootstrap';
import PrivateRoute from './PrivateRoute.jsx';

export default function Home() {
  // const [userData, setUserData] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const { user } = useAuth();

  // useEffect(() => {
  //   fetchUserProfile();
  // }, []);

  // const fetchUserProfile = async () => {
  //   const token = localStorage.getItem('token');
  //   console.log("profile token:",token);
  //   try {
  //     const data = await authAPI.verifyToken(token);
  //       console.log("data du profile", data);

  //     //setUserData(data);
  //   } catch (error) {
  //     console.error('Erreur lors du chargement du profil:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // if (loading) {
  //   return <div className="loading">Chargement du dashboard...</div>;
  // }
  return (
    <div >
        hOMMRMRMMRMR
    </div>
  )
}

// Move DashboardHome outside of Home
// const DashboardHome = ({ userData }) => {
//   return (
//     <div className="dashboard-home">
//       <h1>Bienvenue sur votre Dashboard</h1>
//       {userData && (
//         <div className="user-info">
//           <h2>{userData.name}</h2>
//           <p>Email: {userData.email}</p>
//           <p>Rôle: {userData.role}</p>
//         </div>
//       )}
//     </div>
//   );
// };

