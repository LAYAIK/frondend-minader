import React, { useState } from "react";
import GroupList1 from "./GroupList1";
import Chat1 from "./Chat1";
import { Container, Row, Col, Alert } from "react-bootstrap";

export default function AppChat1() {
  const [selectedGroup, setSelectedGroup] = useState(null);
  // const [user, setUser] = useState(null);
  const user = JSON.parse(localStorage.getItem("user")); 

  return (
    <Container fluid>
      <Row className="py-3">
        <Col md={4}>
          <GroupList1 user={user} onSelect={(g) => setSelectedGroup(g)} />
        </Col>
        <Col md={8}>
          {selectedGroup ? (
            <Chat1 user={user} group={selectedGroup} />
          ) : (
            <Alert variant="info" className="text-center">
              📌 Sélectionne un groupe pour démarrer la discussion
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
}

