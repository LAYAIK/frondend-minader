// src/components/NotificationsCenter.jsx
import React, { useEffect, useState, useRef } from 'react';
import { Toast, Button, ListGroup, Badge, Card } from 'react-bootstrap';
import axios from 'axios';
import io from 'socket.io-client';

const API_URL = (typeof globalThis !== 'undefined' && globalThis.process && globalThis.process.env && globalThis.process.env.REACT_APP_API_URL)
  ? globalThis.process.env.REACT_APP_API_URL
  : 'http://localhost:3003';
const SOCKET_URL = (typeof globalThis !== 'undefined' && globalThis.process && globalThis.process.env && globalThis.process.env.REACT_APP_SOCKET_URL)
  ? globalThis.process.env.REACT_APP_SOCKET_URL
  : API_URL;

export default function NotificationsCenter({ currentUser }) {
  const [notifications, setNotifications] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastData, setToastData] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!currentUser) return;
    // fetch stored notifications
    axios.get(`${API_URL}/api/notifications/${currentUser.id_utilisateur}`)
      .then(res => setNotifications(res.data))
      .catch(err => console.warn('fetch notifications', err));
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    // init socket and listen for newNotification
    socketRef.current = io(SOCKET_URL, { transports: ['websocket'] });
    socketRef.current.emit('joinUser', { userId: currentUser.id_utilisateur });

    socketRef.current.on('newNotification', ({ notif }) => {
      setNotifications(prev => [notif, ...prev]);
      setToastData(notif);
      setShowToast(true);
    });

    return () => {
      socketRef.current && socketRef.current.disconnect();
    };
  }, [currentUser]);

  const markRead = async (id) => {
    try {
      await axios.post(`${API_URL}/api/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id_notification === id ? { ...n, lu: true } : n));
    } catch (err) {
      console.warn('mark read', err);
    }
  };

  const openNotification = (n) => {
    if (n.url) window.open(n.url, '_blank');
    markRead(n.id_notification);
  };

  return (
    <div>
      <Card className="mb-3">
        <Card.Header>
          Notifications <Badge bg="secondary">{notifications.filter(n=>!n.lu).length}</Badge>
        </Card.Header>
        <Card.Body style={{ maxHeight: '320px', overflowY: 'auto' }}>
          <ListGroup variant="flush">
            {notifications.length === 0 && <div className="text-muted p-3">Aucune notification</div>}
            {notifications.map(n => (
              <ListGroup.Item key={n.id_notification} className="d-flex justify-content-between align-items-start">
                <div onClick={() => openNotification(n)} style={{ cursor: 'pointer' }}>
                  <div className="fw-bold">{n.titre}</div>
                  <div className="small text-muted">{n.message}</div>
                  <div className="small text-muted">{new Date(n.createdAt).toLocaleString()}</div>
                </div>
                <div>
                  {!n.lu && <Badge bg="danger" className="me-2">Nouveau</Badge>}
                  <Button size="sm" variant="outline-primary" onClick={() => openNotification(n)}>Ouvrir</Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>

      <Toast show={showToast} onClose={() => setShowToast(false)} delay={4000} autohide style={{ position: 'fixed', right: 20, bottom: 20, zIndex: 9999 }}>
        <Toast.Header><strong className="me-auto">{toastData?.titre}</strong></Toast.Header>
        <Toast.Body>{toastData?.message}</Toast.Body>
      </Toast>
    </div>
  );
}
