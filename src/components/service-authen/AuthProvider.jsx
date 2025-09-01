// // context/AuthContext.js
// import React, { createContext, useState, useEffect } from 'react';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Vérifier si l'utilisateur est déjà connecté au chargement
//     const token = localStorage.getItem('token');
//     const userData = localStorage.getItem('user');
    
//     if (token && userData) {
//       setUser(JSON.parse(userData));
//     }
//     setLoading(false);
//   }, []);

//   const login = async (email, password) => {
//     try {
//       // Simulation d'une API call
//       const response = await fetch('/api/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         const userData = { 
//           id: data.user.id, 
//           email: data.user.email, 
//           name: data.user.name 
//         };
        
//         setUser(userData);
//         localStorage.setItem('token', data.token);
//         localStorage.setItem('user', JSON.stringify(userData));
        
//         return { success: true };
//       } else {
//         return { success: false, error: 'Identifiants incorrects' };
//       }
//     } catch (error) {
//       console.error(error);
//       return { success: false, error: 'Erreur de connexion' };
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//   };

//   const value = {
//     user,
//     login,
//     logout,
//     loading
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };