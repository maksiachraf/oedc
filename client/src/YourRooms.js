import React, {useEffect} from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';

import { Container, Col, Row, Form, Button, ButtonGroup, ToggleButton, Accordion, Card, Badge, ListGroup, ListGroupItem } from 'react-bootstrap'
import { Link } from 'react-router-dom';


function YourRooms({rooms}) {

    return (
        <div className="App-body">
            <Container>
                <Row>
                    <Col>
                    </Col>
                    <Col lg="10" >
                    <Card
                            bg="dark"
                            variant="primary">

                                <Card.Header>
                                    The rooms you're currently in:
                                </Card.Header>
                                <Card.Body>
                                <Row>
                                    <Col lg="3"><h3>name</h3></Col>
                                    <Col lg="1"><h3>id</h3></Col>
                                    <Col lg="2"><h3>privacy</h3></Col>
                                    <Col lg="3"><h3>password</h3></Col>
                                    <Col lg="2"><h3>users</h3></Col>
                                    <Col lg="1"></Col>

                                </Row>
            {
                rooms.map((room) => (
                    <Row>
                        <Col lg="3">{room.name}</Col>
                        <Col lg="1">{room.id}</Col>
                        <Col lg="2">{room.privacy}</Col>
                        <Col lg="3">{room.password}</Col>
                        <Col lg="2">nb users</Col>
                        <Col lg="1">
                            <Button variant="primary">Join</Button>
                        </Col>


                    </Row>
                ))
            }

                                </Card.Body>

                    </Card>
                    
                    
                    </Col>
                    <Col>
                    </Col>
                </Row>
            </Container>
            

        </div>
        

    )
}

export default YourRooms
