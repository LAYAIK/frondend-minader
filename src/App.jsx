import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import Login from './components/service-authen/Login.jsx';
import Home from './components/Home.jsx';
import Rapports from './components/Rapports.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Register from './components/service-authen/Register.jsx';
import RegisterCourrier from './components/service-courrier/RegisterCourrier.jsx';
import ListeCourrier from './components/service-courrier/ListeCourrier.jsx';

// Composant pour gérer la redirection basée sur l'authentification
const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading">Chargement de l'application...</div>;
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
      
      <Route path="/rapports"  element={ <PrivateRoute> <Rapports /> </PrivateRoute> } />
      
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
