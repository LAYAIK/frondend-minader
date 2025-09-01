import React from 'react'
import { Container } from 'react-bootstrap';
import { Route, Routes } from 'react-router';
export default function MainContent() {
  return (
    <>
      <Route path="/" element={<h2>Bienvenue au tableau de bord</h2>} />
      <Route path="/courriers" element={<h2>Gestion des courriers</h2>} />
      <Route path="/archives" element={<h2>Archives des courriers</h2>} />
      <Route path="/rechercher" element={<h2>Rechercher des courriers</h2>} />
      <Route path="/utilisateurs" element={<h2>Gestion des utilisateurs</h2>} />
      <Route path="/workflows" element={<h2>Configuration des workflows</h2>} />
      <Route path="/structures" element={<h2>Gestion des structures</h2>} />
      <Route path="/chat" element={<h2>Discussion en temps réel</h2>} />
      <Route path="/parametres" element={<h2>Paramètres de l'application</h2>} />
      <Route path="/rapports" element={<h2>Génération de rapports</h2>} />
      <Route path="*" element={<h2>Page non trouvée</h2>} />
      
  </>
  )
}
