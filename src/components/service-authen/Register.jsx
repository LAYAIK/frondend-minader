import React from 'react'
import { NavLink } from 'react-router'

export default function Register() {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="card p-4 shadow-sm access-request-card">
            <div className="text-center mb-4">
                <h1 className="h3 mb-4 text-uppercase fw-bold">TENA <span className="text-success">MAIL</span></h1>
                <p className="text-muted fw-bold mb-0 h3">Demande d'accès</p>
                <p className="text-muted small">Remplissez ce formulaire pour demander un accès à Tena Mail.</p>
            </div>

            <form>
                <div className="mb-3">
                    <label htmlFor="fullName" className="form-label fw-bold">Nom complet <span className="text-danger fw-bold">*</span></label>
                    <div className="input-group">
                        <span className="input-group-text"><i className="fas fa-user"></i></span>
                        <input type="text" className="form-control" id="fullName" value="ZE AKONO LUIS" required/>
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="professionalEmail" className="form-label fw-bold">Email professionnel <span className="text-danger fw-bold"> * </span></label>
                    <div className="input-group">
                        <span className="input-group-text"><i className="fas fa-envelope"></i></span>
                        <input type="email" className="form-control" id="professionalEmail" value="ze.akono@minader.cm" required/>
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="direction" className="form-label fw-bold">Direction <span className="text-danger fw-bold">*</span></label>
                    <select className="form-select" id="direction" required>
                        <option selected disabled value=""> <span className="text-muted">Sélectionner une option</span></option>
                        <option>Direction Générale</option>
                        <option>Département Commercial</option>
                        <option>Département Finance</option>
                        <option>Service Informatique</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="position" className="form-label fw-bold">Poste / Fonction <span className="text-danger fw-bold">*</span></label>
                    <input type="text" className="form-control" id="position" placeholder="Directeur, Chef de service, etc." required/>
                </div>

                <div className="mb-4">
                    <label htmlFor="justification" className="form-label fw-bold">Justification de la demande <span className="text-danger fw-bold">*</span></label>
                    <textarea className="form-control" id="justification" rows="3"
                        placeholder="Expliquez brièvement pourquoi vous avez besoin d'un accès à l'application"
                        required></textarea>
                </div>

                <button type="submit" className="btn btn-primary w-100 py-2">Envoyer la demande</button>
            </form>

            <div className="text-center mt-4">
                Vous avez déjà un compte ? <NavLink to="/login" className="text-decoration-none">Se connecter</NavLink>
            </div>
        </div>
    </div>
  )
}
