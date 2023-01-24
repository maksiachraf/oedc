import React from 'react'
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css'

import './App.css';

import { Container, Col, Row, Form, Alert, Button, FormControl, Image, Carousel, CarouselItem } from 'react-bootstrap'
import { Link } from 'react-router-dom';

function controlNickname() {

}

class DisplayImageAvatar extends React.Component {
    constructor(props) {
        super(props)
        this.numero = "2";
    }

    render() {
        return (
            <Image id='imageAvatar'
                src={'Zombies/PNG/ZOMBIE_FA_' + this.numero + '.png'}
            />
        )

    }

}

function DisplayNameAvatar(props) {
    const avatarName = 'Zombie number ' + props.numero
    return (
        <h3>avatarName</h3>

    );
}


class Nickname extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: '' };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        alert('Le nom a été soumis : ' + this.state.value);
        window.username = this.state.value;
        console.log(window.username);
    }

    render() {
        return (

            <Form onSubmit={this.handleSubmit}>
                <Form.Group>
                    <Form.Label>Nickname</Form.Label>
                    <Form.Control type="text" placeholder="Enter your nickname" value={this.state.value} onChange={this.handleChange} />
                    <Form.Text className="text-muted">
                        We'll never share your nickname with anyone else.
                    </Form.Text>
                </Form.Group>
                <Button variant="primary" type="submit" >
                    Submit
                </Button>
            </Form>
        );
    }
}


class BodyLogIn extends React.Component {
    constructor(props) {
        super(props)


    }
    render() {

        return (
            <div className="App-body" >
                <Container>
                    <Row>
                        <Col>
                            <Button>left</Button>
                        </Col>
                        <Col>
                            <DisplayImageAvatar />
                        </Col>
                        <Col>
                            <Button>right</Button>
                        </Col>


                    </Row>

                    <Row xs="1" md="3" lg="3">
                        <Col>
                        </Col >
                        <Col>
                            <Col>
                                <Nickname />
                                <Link to='/newroom'>
                                    <Button id="newroom">
                                        Generate new chat room
                                    </Button>
                                </Link>

                                <Link to='/roomselect'>
                                    <Button id="roomselect">
                                        Or join public chat room
                                    </Button>
                                </Link>

                                <div className=".Account"></div>


                            </Col>
                        </Col>


                    </Row >




                </Container >

            </div >






        )
    }

}

export default BodyLogIn







