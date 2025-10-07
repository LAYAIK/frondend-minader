import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { createGroup } from "../../actions/Notification";

export default function CreateGroupModal1({ show, onHide, onCreated }) {
  const [nom, setNom] = useState("");
  const [desc, setDesc] = useState("");

  const data = {nom, description: desc};
  const handleCreate = async () => {
    await createGroup(data);
    setNom(""); setDesc("");
    onCreated && onCreated();
    onHide();
  }
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton><Modal.Title>Create group</Modal.Title></Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-2">
          <Form.Label>Nom</Form.Label>
          <Form.Control value={nom} onChange={e => setNom(e.target.value)} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={3} value={desc} onChange={e=>setDesc(e.target.value)} />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Annuler</Button>
        <Button variant="primary" onClick={handleCreate}>Créer</Button>
      </Modal.Footer>
    </Modal>
  );
}
