import React, { useEffect, useState, useRef } from "react";
import { Card, ListGroup, Form, Button, InputGroup } from "react-bootstrap";
import useSocket from "../../hooks/useSocket";
import { listeMessageGroup, createMessage } from "../../actions/Notification";

export default function Chat1({ user, group }) {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const socketRef = useSocket(user?.id);
  const messagesRef = useRef();

  useEffect(() => {
    if (!group) return;
    (async () => {
      const data = await listeMessageGroup(group.id_group);
      console.log('data message 1',data);
      setMessages(data);
    })();

    // join room on socket
    const socket = socketRef.current;
    if (socket) {
      socket.emit("joinRoom", group.id_group);
      const handleReceive = ({ message }) => {
        setMessages(prev => [...prev, message]);
      };
      socket.on("receiveMessage", handleReceive);
    }

    return () => {
      if (socket) {
        socket.emit("leaveRoom", group.id_group);
        socket.off("receiveMessage");
      }
    };
  }, [group, socketRef]);
  console.log('message 1', messages);

  useEffect(()=> { messagesRef.current?.scrollTo(0, 99999) }, [messages]);

  const send = async () => {
    if (!content.trim()) return;
    const payload = { id_group: group.id_group, senderId: user.id_utilisateur, content };
    // optimistic UI if socket present
    if (socketRef.current) {
      socketRef.current.emit("sendMessage", payload);
      setContent("");
    } else {
      const data  = await createMessage(payload);
      console.log('data message 2',data);
      setMessages(prev => [...prev, data]);
      setContent("");
    }
  };

  return (
    <Card className="h-100">
      <Card.Header><strong>{group?.nom}</strong></Card.Header>
      <Card.Body style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div ref={messagesRef} style={{ overflowY: "auto", maxHeight: 400, flex: 1 }}>
          <ListGroup variant="flush">
            {messages.map(m => (
              <ListGroup.Item key={m.id_message}>
                <div><strong>{m.senderId}</strong> <span className="text-muted small">({new Date(m.createdAt).toLocaleTimeString()})</span></div>
                <div>{m.content}</div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>

        <InputGroup>
          <Form.Control value={content} onChange={e=>setContent(e.target.value)} placeholder="Écrire un message..." onKeyDown={(e)=>e.key==='Enter' && send()} />
          <Button onClick={send}>Envoyer</Button>
        </InputGroup>
      </Card.Body>
    </Card>
  );
}

