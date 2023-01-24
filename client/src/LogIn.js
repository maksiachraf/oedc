import React, { useState, useRef } from 'react'

import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

import { Container, Col, Row, Form, Alert, Button, FormControl, Image, Carousel, CarouselItem, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom';

function loadImage(e) {
    var input = document.getElementById('inputImage');
    input.click();
}

function SrcForm({ onSrcSubmit }) {

    function imageHandler(e) {
        const reader = new FileReader();

        reader.onload = () => {
            if (reader.readyState == 2) {
                onSrcSubmit(reader.result);
            }
        }

        reader.readAsDataURL(e.target.files[0])
    }

    return (
        <>

            <input className="inputFile" id='inputImage' type="file" accept="image/*" onChange={imageHandler} />
            <br />

            <Button variant="primary" onClick={loadImage}>Choose a photo</Button>


        </>

    )

}

function NameForm({ onNicknameSubmit }) {
    const nicknameRef = useRef();

    function handleSubmit(e) {
        e.preventDefault()
        window.username = nicknameRef.current.value
        localStorage.setItem('Username', nicknameRef.current.value)
        onNicknameSubmit(nicknameRef.current.value)
    }

    return (
        <>
            <Form>
                <Form.Group>
                    <Form.Label>Nickname</Form.Label>
                    <Form.Control type="text" placeholder="Choose a Nickname" ref={nicknameRef} required />
                    <Form.Text className="text-muted">
                        We will never share your nickname.
                </Form.Text>
                </Form.Group>
                <Button variant="primary" onClick={handleSubmit}>
                    Submit
                </Button>
            </Form >

        </>
    )

}
function LogIn({ nickname, src, setNickname, setSrc }) {

    return (
        <div className='App-body'>
            <Container>
                <Row>
                    <Col>
                    </Col>
                    <Col xl="4" lg="6" md ="8" sm="8" xs="9">
                        <Card
                            bg="dark"
                            variant="primary">
                            <Card.Header>Let's get started!</Card.Header>
                            <Card.Body>
                                <Card.Title>Create your profile</Card.Title>
                                <Card.Text>
                                    <NameForm onNicknameSubmit={setNickname} />
                                    <br />
                                </Card.Text>
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

export default LogIn
