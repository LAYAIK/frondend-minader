// // src/components/NotificationsCenter.jsx
// import React, { useEffect, useState, useRef } from 'react';
// import { Toast, Button, ListGroup, Badge, Card } from 'react-bootstrap';
// import axios from 'axios';
// import io from 'socket.io-client';
// import { useNavigate } from "react-router";

const API_URL = (typeof globalThis !== 'undefined' && globalThis.process && globalThis.process.env && globalThis.process.env.REACT_APP_API_URL)
  ? globalThis.process.env.REACT_APP_API_URL
  : 'http://localhost:3003';
const SOCKET_URL = (typeof globalThis !== 'undefined' && globalThis.process && globalThis.process.env && globalThis.process.env.REACT_APP_SOCKET_URL)
  ? globalThis.process.env.REACT_APP_SOCKET_URL
  : API_URL;

// export default function NotificationsCenter({ currentUser }) {
//   const [notifications, setNotifications] = useState([]);
//   const [showToast, setShowToast] = useState(false);
//   const [toastData, setToastData] = useState(null);
//   const socketRef = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!currentUser) return;
//     // fetch stored notifications
//     axios.get(`${API_URL}/api/notifications/${currentUser.id_utilisateur}`)
//       .then(res => setNotifications(res.data))
//       .catch(err => console.warn('fetch notifications', err));
//   }, [currentUser, showToast]);

//   useEffect(() => {
//     if (!currentUser) return;
//     // init socket and listen for newNotification
//     socketRef.current = io(SOCKET_URL, { transports: ['websocket'] });
//     socketRef.current.emit('joinUser', { userId: currentUser.id_utilisateur });

//     socketRef.current.on('newNotification', ({ notif }) => {
//       setNotifications(prev => [notif, ...prev]);
//       setToastData(notif);
//       setShowToast(true);
//     });

//     return () => {
//       socketRef.current && socketRef.current.disconnect();
//     };
//   }, [currentUser, showToast]);

//   const markRead = async (id) => {
//     try {
//       await axios.post(`${API_URL}/api/notifications/${id}/read`);
//       setNotifications(prev => prev.map(n => n.id_notification === id ? { ...n, lu: true } : n));
//     } catch (err) {
//       console.warn('mark read', err);
//     }
//   };

//   const openNotification = (n) => {
//     if (n.url) navigate(n.url);
//     markRead(n.id_notification);
//   };

//   return (
//     <div>
//       <Card className="mb-3 mt-3">
//         <Card.Header>
//           Notifications <Badge bg="secondary">{notifications.filter(n=>!n.lu).length}</Badge>
//         </Card.Header>
//         <Card.Body style={{ maxHeight: '550px', overflowY: 'auto' }}>
//           <ListGroup variant="flush">
//             {notifications.length === 0 && <div className="text-muted p-3">Aucune notification</div>}
//             {notifications.map(n => (
//               <ListGroup.Item key={n.id_notification} className="d-flex justify-content-between align-items-start">
//                 <div onClick={() => openNotification(n)} style={{ cursor: 'pointer' }}>
//                   <div className="fw-bold">{n.titre}</div>
//                   <div className="small text-muted">{n.message}</div>
//                   <div className="small text-muted">{new Date(n.createdAt).toLocaleString()}</div>
//                 </div>
//                 <div>
//                   {!n.lu && <Badge bg="danger" className="me-2">Nouveau</Badge>}
//                   <Button size="sm" variant="outline-primary" onClick={() => openNotification(n)}>Ouvrir</Button>
//                 </div>
//               </ListGroup.Item>
//             ))}
//           </ListGroup>
//         </Card.Body>
//       </Card>

//       <Toast show={showToast} onClose={() => setShowToast(false)} delay={4000} autohide style={{ position: 'fixed', right: 20, bottom: 20, zIndex: 9999 }}>
//         <Toast.Header><strong className="me-auto">{toastData?.titre}</strong></Toast.Header>
//         <Toast.Body>{toastData?.message}</Toast.Body>
//       </Toast>
//     </div>
//   );
// }


import React, { useEffect, useState, useRef } from "react";
import {
  Toast,
  Button,
  ListGroup,
  Badge,
  Card,
  OverlayTrigger,
  Tooltip,
  Spinner,
} from "react-bootstrap";
import { Bell, CheckCircle, Clock, XCircle } from "react-bootstrap-icons";
import axios from "axios";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// const API_URL =
//   process.env.REACT_APP_API_URL || "http://localhost:3003";
// const SOCKET_URL =
//   process.env.REACT_APP_SOCKET_URL || API_URL;

export default function NotificationsCenter({ currentUser }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastData, setToastData] = useState(null);
  const socketRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Charger les notifications existantes
  useEffect(() => {
    if (!currentUser) return;

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/notifications/${currentUser.id_utilisateur}`
        );
        const sorted = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setNotifications(sorted);
      } catch (err) {
        console.warn("Erreur récupération notifications", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [currentUser]);

  // ✅ Connexion Socket.io temps réel
  useEffect(() => {
    if (!currentUser) return;

    socketRef.current = io(SOCKET_URL, { transports: ["websocket"] });
    socketRef.current.emit("joinUser", { userId: currentUser.id_utilisateur });

    socketRef.current.on("newNotification", ({ notif }) => {
      setNotifications((prev) => [notif, ...prev]);
      setToastData(notif);
      setShowToast(true);
    });

    return () => socketRef.current && socketRef.current.disconnect();
  }, [currentUser]);

  // ✅ Marquer comme lu
  const markRead = async (id) => {
    try {
      await axios.post(`${API_URL}/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id_notification === id ? { ...n, lu: true } : n
        )
      );
    } catch (err) {
      console.warn("Erreur marquage lu", err);
    }
  };

  // ✅ Ouvrir la notification (et marquer comme lue)
  const openNotification = (n) => {
    if (n.url) navigate(n.url);
    markRead(n.id_notification);
  };

  const unreadCount = notifications.filter((n) => !n.lu).length;

  return (
    <div>
      <Card className="shadow border-0 mt-3">
        <Card.Header className="d-flex justify-content-between align-items-center bg-success text-white">
          <div className="d-flex align-items-center gap-2">
            <Bell size={22} />
            <h5 className="mb-0">Centre de Notifications</h5>
          </div>
          <Badge bg="light" text="dark">
            {unreadCount} non lues
          </Badge>
        </Card.Header>

        <Card.Body style={{ maxHeight: "650px", overflowY: "auto" }}>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="text-muted mt-2">Chargement des notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center text-muted py-5">
              <XCircle size={40} className="text-primary mb-2" />
              <p>Aucune notification disponible.</p>
            </div>
          ) : (
            <ListGroup variant="flush">
              {notifications.map((n) => (
                <ListGroup.Item
                  key={n.id_notification}
                  className={`d-flex justify-content-between align-items-start rounded-3 mb-2 ${
                    !n.lu ? "bg-light border-start border-2 border-success" : ""
                  }`}
                  style={{ transition: "all 0.3s ease" }}
                >
                  <div
                    onClick={() => openNotification(n)}
                    style={{ cursor: "pointer", flex: 1 }}
                  >
                    <div className="fw-bold text-primary">{n.titre}</div>
                    <div className="text-muted small">{n.message}</div>
                    <div className="text-secondary small d-flex align-items-center gap-1">
                      <Clock size={14} />{" "}
                      {new Date(n.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="text-end">
                    {!n.lu && (
                      <Badge bg="danger" className="me-2">
                        Nouveau
                      </Badge>
                    )}
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Ouvrir la notification</Tooltip>}
                    >
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => openNotification(n)}
                      >
                        Voir
                      </Button>
                    </OverlayTrigger>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>

      {/* ✅ Toast élégant pour nouvelles notifications */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={5000}
        autohide
        className="border-0 shadow-lg"
        style={{
          position: "fixed",
          right: 20,
          bottom: 20,
          zIndex: 9999,
          minWidth: "280px",
          background: "#f8f9fa",
        }}
      >
        <Toast.Header closeButton={true}>
          <CheckCircle
            className="text-success me-2"
            size={18}
          />
          <strong className="me-auto">{toastData?.titre}</strong>
          <small className="text-muted">Nouvelle notification</small>
        </Toast.Header>
        <Toast.Body>{toastData?.message}</Toast.Body>
      </Toast>
    </div>
  );
}
