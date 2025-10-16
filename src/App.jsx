import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Spinner } from 'react-bootstrap';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import Login from './components/service-authen/Login.jsx';
import Home from './components/Home.jsx';
import Rapports from './components/Rapports.jsx';
import Workflows from './components/Workflows.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Register from './components/service-authen/Register.jsx';
import RegisterCourrier from './components/service-courrier/RegisterCourrier.jsx';
import ListeCourrier from './components/service-courrier/ListeCourrier.jsx';
import TransfertCourrier from './components/service-courrier/TransfertCourrier.jsx'
import ModifierCourrier from './components/service-courrier/ModifierCourrier.jsx';
import ListeArchive from './components/service-courrier/ListeArchive.jsx';
import CourrierEntrant from './components/workflow/CourrierEntrant.jsx';
import CourrierSortant from './components/workflow/CourrierSortant.jsx';
import CourrierAutres from './components/workflow/CourrierAutres.jsx';
import ListeStructure from './components/service-structure-perso/ListeStructure.jsx';
import AjouterStructure from './components/service-structure-perso/AjouterStructure.jsx';
import DetailCourrier from './components/service-courrier/DetailCourrier.jsx';
import ListeUtilisateur from './components/service-authen/ListeUtilisateur.jsx';
import NotificationsCenter from './components/service-chat/NotificationsCenter.jsx';
import AppChat1 from './components/service-chat/AppChat1.jsx';
import Parametres from './components/Parametres.jsx';
import Rechercher from './components/Rechercher.jsx';
import ModifierUtilisateur from './components/service-authen/ModifierUtilisateur.jsx';
import VoirUtilisateiur from './components/service-authen/VoirUtilisateur.jsx'
import VoirUtilisateur from './components/service-authen/VoirUtilisateur.jsx';


// currentUser minimal mock — remplace par ton auth context
const currentUser = JSON.parse(localStorage.getItem('user') || 'null');

// Composant pour gérer la redirection basée sur l'authentification
const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Routes>
      {/* Route publique - Login */}
      <Route path="/login" element={ isAuthenticated ? <Navigate to="/home" replace /> : <Login /> } />
      <Route path="/register" element={ isAuthenticated ? <Navigate to="/home" replace /> : <Register /> } />
      
      {/* Routes protégées */}
      <Route path="/home/*" element={ <PrivateRoute> <Home /> </PrivateRoute> } />
     
      <Route path="/register-courrier" element={ <PrivateRoute> <RegisterCourrier /> </PrivateRoute> } />
      <Route path="/liste-courrier" element={ <PrivateRoute> <ListeCourrier /> </PrivateRoute> } />
      <Route path="/transfert-courrier/:id" element={ <PrivateRoute> <TransfertCourrier /> </PrivateRoute> } />
      <Route path="/modifier-courrier/:id" element={ <PrivateRoute> <ModifierCourrier /> </PrivateRoute> } />
      <Route path="/liste-archive" element={ <PrivateRoute> <ListeArchive /> </PrivateRoute> } />
      <Route path="/detail-courrier/:id" element={ <PrivateRoute> <DetailCourrier/> </PrivateRoute>}/>
      
      <Route path="/rapports"  element={ <PrivateRoute> <Rapports /> </PrivateRoute> } />
      <Route path="/workflow"  element={ <PrivateRoute> <Workflows /> </PrivateRoute> } />
      <Route path="/courrier-entrant"  element={ <PrivateRoute> <CourrierEntrant /> </PrivateRoute> } />
      <Route path="/courrier-sortant"  element={ <PrivateRoute> <CourrierSortant /> </PrivateRoute> } />
      <Route path="/courrier-autres"  element={ <PrivateRoute> <CourrierAutres /> </PrivateRoute> } />
      <Route path="/liste-structure"  element={ <PrivateRoute> <ListeStructure /> </PrivateRoute> } />
      <Route path='/ajouter-structure' element={ <PrivateRoute> <AjouterStructure /> </PrivateRoute> } />
      <Route path='/liste-utilisateur' element={ <PrivateRoute> <ListeUtilisateur /> </PrivateRoute> } />
      <Route path='/app-chat1' element={ <PrivateRoute> <AppChat1 /> </PrivateRoute> } />
      <Route path='/notifications' element={ <PrivateRoute> <NotificationsCenter currentUser={currentUser} /> </PrivateRoute> } />
      <Route path='/parametres'  element={ <PrivateRoute> <Parametres/> </PrivateRoute> } />
      <Route path='/rechercher'  element={ <PrivateRoute> <Rechercher /> </PrivateRoute> } />
      <Route path='/modifier-utilisateur/:id'  element={ <PrivateRoute> <ModifierUtilisateur /> </PrivateRoute> } />
      <Route path='/voir-utilisateur/:id'  element={ <PrivateRoute> <VoirUtilisateur /> </PrivateRoute> } />
      {/* Route par défaut */}
      <Route path="/"  element={ isAuthenticated ?  <Navigate to="/home" replace /> :  <Navigate to="/login" replace />  } />
      
      {/* Route 404 */}
      <Route path="*" element={<div>Page non trouvée</div>} />
    </Routes>
  );
};

function App() {
  
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <AppRoutes />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
