import React from 'react';
import { Card,Button,ButtonGroup, Container , Row, Col} from 'react-bootstrap'; 
import { useNavigate } from 'react-router';

export default function Workflow() {
const navigate = useNavigate();

const handleEntrant = async () => {
  const userConfirmed = window.confirm("Vous etes sur de vouloir voir le workflow des courrier entrant ?");
        if(userConfirmed){
            navigate('/courrier-entrant');
        } 
};

const handleSortant = async () => {
  const userConfirmed = window.confirm("Vous etes sur de vouloir voir le workflow des courrier sortant ?");
        if(userConfirmed){
            navigate('/courrier-sortant');
        } 
};

const handleAutre = async () => {
  const userConfirmed = window.confirm("Vous etes sur de vouloir voir le workflow des autres courrier ?");
        if(userConfirmed){
            navigate('/courrier-autres');
        } 
};
return (
<Container >
  <Row className='container-fluid'>
  <Col>
  <Card border="primary" bg='' style={{ width: '18rem' }} className='mt-2'>
        <Card.Header>Courrier</Card.Header>
        <Card.Body>
          <Card.Title>Workflow des Courrier</Card.Title>
          <ButtonGroup className="" aria-label="First group">
            <Button variant="secondary" onClick={handleEntrant}>Entrant</Button>
            <Button variant="secondary" onClick={handleSortant}>Sortant</Button>
            <Button variant="secondary" onClick={handleAutre}>Autre</Button>
          </ButtonGroup>
        </Card.Body>
      </Card>
    </Col>
    <Col>
      <Card border="primary" bg='' style={{ width: '18rem' }} className='mt-2'>
        <Card.Header>UTILISATEURS</Card.Header>
        <Card.Body>
          <Card.Title>Workflow des Utilisateur</Card.Title>
          <ButtonGroup className="" aria-label="First group">
          <Button variant="secondary">Entrant</Button>
          <Button variant="secondary">Sortant</Button>
        </ButtonGroup>
        </Card.Body>
      </Card>
    </Col>
    <Col>
      <Card border="primary" bg='' style={{ width: '18rem' }} className='mt-2'>
        <Card.Header>Courrier</Card.Header>
        <Card.Body>
          <Card.Title>Workflow des Courrier</Card.Title>
          <ButtonGroup className="" aria-label="First group">
          <Button variant="secondary">Entrant</Button>
          <Button variant="secondary">Sortant</Button>
        </ButtonGroup>
        </Card.Body>
      </Card>
    </Col>
  </Row>
  <Row className='container-fluid'>
  <Col>
  <Card border="primary" bg='' style={{ width: '18rem' }} className='mt-2'>
        <Card.Header>Courrier</Card.Header>
        <Card.Body>
          <Card.Title>Workflow des Courrier</Card.Title>
          <ButtonGroup className="" aria-label="First group">
          <Button variant="secondary">Entrant</Button>
          <Button variant="secondary">Sortant</Button>
        </ButtonGroup>
        </Card.Body>
      </Card>
    </Col>
    <Col>
      <Card border="primary" bg='' style={{ width: '18rem' }} className='mt-2'>
        <Card.Header>Courrier</Card.Header>
        <Card.Body>
          <Card.Title>Workflow des Courrier</Card.Title>
          <ButtonGroup className="" aria-label="First group">
          <Button variant="secondary">Entrant</Button>
          <Button variant="secondary">Sortant</Button>
        </ButtonGroup>
        </Card.Body>
      </Card>
    </Col>
    <Col>
      <Card border="primary" bg='' style={{ width: '18rem' }} className='mt-2'>
        <Card.Header>Courrier</Card.Header>
        <Card.Body>
          <Card.Title>Workflow des Courrier</Card.Title>
          <ButtonGroup className="" aria-label="First group">
          <Button variant="secondary">Entrant</Button>
          <Button variant="secondary">Sortant</Button>
        </ButtonGroup>
        </Card.Body>
      </Card>
    </Col>
  </Row>

</Container>

  )
}

