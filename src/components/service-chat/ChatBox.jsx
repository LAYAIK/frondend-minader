import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { Button, Form, ListGroup, Badge, Toast } from "react-bootstrap";
import usePushNotifications from "../../hooks/usePushNotifications";
import useNotifications from "../../hooks/useNotifications";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3003";

const ChatBox = ({ roomId, user }) => {
  const socketRef = useRef(null);


    const { notifications, subscribeToPush } = useNotifications(user?.id_utilisateur);

  useEffect(() => {
    subscribeToPush(); // Abonnement automatique aux push
  }, [subscribeToPush]);

  // States
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [notif, setNotif] = useState(null);
  const [showNotif, setShowNotif] = useState(false);

  // Hook custom (service worker push)
  const { isSubscribed, subscribe, unsubscribe } = usePushNotifications();

  // === 1. Connexion socket.io ===
  useEffect(() => {
    if (!user?.id_utilisateur) return;

    const s = io('ws://localhost:3003', {
      transports: ["websocket"],
      withCredentials: true,
      query: { userId: user.id_utilisateur },
    });

    socketRef.current = s;

    s.on("connect", () => {
      console.log("✅ Connecté au serveur socket", s.id);
      s.emit("joinUser", { userId: user.id_utilisateur });
      s.emit("joinRoom", roomId);
    });

    // Réception des messages
    s.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Réception des notifications
    s.on("notification", (n) => {
      console.log("🔔 Notification reçue:", n);
      setNotif(n);
      setShowNotif(true);
    });

    return () => {
      s.disconnect();
    };
  }, [roomId, user?.id_utilisateur]);

  // === 2. Envoi message ===
  const sendMessage = () => {
    if (content.trim() && socketRef.current) {
      socketRef.current.emit("sendMessage", {
        room: roomId,
        sender: user?.nom || "Anonyme",
        content,
        timestamp: Date.now(),
      });
      setContent("");
    }
  };

  // === 3. Auto-subscribe push notifications (service worker) ===
  useEffect(() => {
    if (user?.id_utilisateur) {
      subscribe({ userId: user.id_utilisateur, room: roomId }).catch((err) =>
        console.warn("Push subscribe failed:", err.message || err)
      );
    }
  }, [roomId, user?.id_utilisateur, subscribe]);

  return (
    <>
      <div>
        <h5>💬 Chat — Courrier {roomId}</h5>
        <ListGroup style={{ maxHeight: "300px", overflowY: "auto" }}>
          {messages.map((m, idx) => (
            <ListGroup.Item key={idx}>
              <strong>{m.sender}</strong>: {m.content}{" "}
              <Badge bg="secondary">
                {new Date(m.timestamp).toLocaleTimeString()}
              </Badge>
            </ListGroup.Item>
          ))}
        </ListGroup>

        <Form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="d-flex mt-2"
        >
          <Form.Control
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Écrire un message..."
          />
          <Button className="ms-2" variant="success" onClick={sendMessage}>
            Envoyer
          </Button>
        </Form>

        {/* Gestion des notifications push */}
        <div className="mt-2">
          {isSubscribed ? (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() =>
                unsubscribe({ userId: user?.id_utilisateur, room: roomId })
              }
            >
              Désactiver notifications
            </Button>
          ) : (
            <Button
              variant="outline-success"
              size="sm"
              onClick={() =>
                subscribe({ userId: user?.id_utilisateur, room: roomId })
              }
            >
              Activer notifications
            </Button>
          )}
        </div>
      </div>

      {/* Toast interne (affiché en haut à droite) */}
      <Toast
        onClose={() => setShowNotif(false)}
        show={showNotif}
        delay={4000}
        autohide
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          minWidth: "200px",
          zIndex: 9999,
        }}
      >
        <Toast.Header>
          <strong className="me-auto">{notif?.title || "Notification"}</strong>
        </Toast.Header>
        <Toast.Body>{notif?.message}</Toast.Body>
      </Toast>

          <div>
      <h2>💬 Chat & Notifications</h2>
      <ul>
        {notifications.map((n) => (
          <li key={n.id_notification}>
            <strong>{n.titre}</strong>: {n.message}
          </li>
        ))}
      </ul>
    </div>
    </>
  );
};

export default ChatBox;

