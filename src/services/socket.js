// src/services/socket.js
import { io } from "socket.io-client";

// L'URL de votre serveur Node.js/Socket.IO
const SOCKET_SERVER_URL = "http://localhost:3003"; 

// Connexion et exportation de l'instance
export const socket = io(SOCKET_SERVER_URL);