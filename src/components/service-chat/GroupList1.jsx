import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { Card, ListGroup, Button, InputGroup, FormControl } from "react-bootstrap";
import CreateGroupModal1 from "./CreateGroupModal1";
import { getGroups } from "../../actions/Notification";

export default function GroupList1({ user, onSelect }) {
  const [groups, setGroups] = useState([]);
  const [q, setQ] = useState("");
  const [showCreate, setShowCreate] = useState(false);

   const DataData = async () => {
      try {
           const response = await getGroups();
           setGroups(response);
          } catch (err) {
              console.error(err);
          }
      };
      useEffect(() => {
          DataData();
      }, []);

  const filtered = groups.filter(g => g.nom.toLowerCase().includes(q.toLowerCase()));

  const fetch = async () => {
    try {
      const response = await getGroups();
      setGroups(response);
    } catch (err) {
      console.error("Erreur lors du fetch des groupes:", err);
    }
  };

  return (
    <>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <strong>Groups</strong>
          <div>
            <Button size="sm" onClick={() => setShowCreate(true)}>Nouveau</Button>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          <InputGroup className="p-2">
            <FormControl placeholder="Search groups..." value={q} onChange={e => setQ(e.target.value)} />
          </InputGroup>
          <ListGroup variant="flush">
            {filtered.map(g => (
              <ListGroup.Item as='div' key={g.id_group} onClick={() => onSelect(g)}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{g.nom}</strong>
                    <div className="text-muted small">{g.description}</div>
                  </div>
                  <div><Button size="sm" variant="outline-primary">Ouvrir</Button></div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>

      <CreateGroupModal1 show={showCreate} onHide={() => setShowCreate(false)} onCreated={fetch} />
    </>
  );
}
