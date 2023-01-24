import React from 'react'

import 'bootstrap/dist/css/bootstrap.min.css'

import './App.css';

import { Container, Col, Row, Form, Button } from 'react-bootstrap'
import { Link, useHistory, withRouter } from 'react-router-dom';

const md5 = require('js-md5')

class NewChatRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: ""
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event) {
        this.setState({ name: event.target.value })
    }

    handleSubmit(event) {
        event.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: this.state.name, visibility: 0, maxusers: 8, connusers: 1, url: md5(this.state.name) })
        }

        alert('Le nom a été soumis : ' + this.state.name);
        var roomName = '/room/' + md5(this.state.name) + '?connected';

        fetch("http://localhost:9000/browser/", requestOptions)
            .then(async response => {
                const data = await response.json();

                // check for error response
                if (!response.ok) {
                    // get error message from body or default to response status
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }

                //this.setState({ postId: data.id })
            })
            .catch(error => {
                //this.setState({ errorMessage: error.toString() });
                console.error('There was an error!', error);
            });

        this.props.history.push(roomName);
    }

    render() {
        return (
            <div className="App-body">

                <Container>
                    <Row xs="1" md="3" lg="3">
                        <Col>
                        </Col >
                        <Col>

                            <Form onSubmit={this.handleSubmit}>
                                <Form.Group>
                                    <Form.Label id="name">Room Name</Form.Label>
                                    <Form.Control id="name" name="name" type="name" placeholder="Enter room name" value={this.state.name} onChange={this.handleChange} />
                                </Form.Group>
                                <Button variant="primary" type="submit" name="submit">
                                    Create Room
                                </Button>
                            </Form >

                        </Col>

                    </Row>

                </Container >

            </div >
        );
    }
}

export default withRouter(NewChatRoom)
