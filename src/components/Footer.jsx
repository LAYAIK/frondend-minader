import React from 'react'
import { Container,Navbar } from 'react-bootstrap'

export default function Footer() {

  return (
    <Container fluid className=''>

    <footer className="d-flex flex-wrap justify-content-between align-items-center py-2 container-fluid" style={{ backgroundColor: '#f8f9fa' }}>
    <small className="col text-muted justify-conten-start" style={{ textAlign: 'left' }}>© {new Date().getFullYear()} MINADER - Ministère de l'Agriculture et du Développement Rural</small>

    <small className="col text-muted justify-content-end" style={{ textAlign: 'right' }}> Système de Gestion Electronique du Courrier v1.0</small>
    </footer>

    </Container>

  )
}
