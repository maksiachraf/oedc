import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

import React from 'react'
import { Container, Col, Row, Form, Alert, Button, FormControl, Image, Carousel, CarouselItem, Card } from 'react-bootstrap'
import { withRouter, Link } from 'react-router-dom';

const passwordHash = require('password-hash')

class JoinChatRoom extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            rooms: [{}],
            searchTerm: ""
        }

        this.setSearchState = this.setSearchState.bind(this)
    }

    componentDidMount() {
        // Fetch the list of available rooms
        fetch(process.env.REACT_APP_API_BR_URL)
            .then((response) => {
                return response.json()  // Convert the response object to JSON data
            })
            .then((res) => {            // Get the result of JSON response data
                this.setState({ rooms: res })
            })
    }

    convertPrivacy(p) {
        if (p === 0)
            return "Private"
        else
            return "Public"
    }

    roomRedirect(e, pass, url) {
        e.preventDefault()
        if (pass === "")
            this.props.history.push('/rooms/' + url)
        else {
            var passRoom = prompt("Please enter the password", "")

            while (passwordHash.verify(passRoom, pass) === false) {
                if (passRoom === null) {
                    return
                } else {
                    passRoom = prompt("Incorrect password, please try again!", "")
                }
            }
            this.props.history.push('/rooms/' + url)
        }
    }

    setSearchState(e) {
        e.preventDefault()
        this.setState({ searchTerm: e.target.value })
    }

    render() {
        return (
            <div className="App-body">

                <Container>
                    <Col>
                        <Form>
                            <input type="text" placeholder="Search a room..." onChange={this.setSearchState} />

                            <Image src="imgLoupe.jpg" rounded />


                        </Form>

                        <Card style={{ color: "#000" }}>

                            <Card.Title>
                                Choose a room
              </Card.Title>


                            {
                                this.state.rooms.map((val) => {
                                    if (val.visibility === 0) {
                                        var showStruct = (<Card.Text id={val._id}>{val.title + " | " + this.convertPrivacy(val.privacy) + " | " + val.userList.length + "/" + val.maxusers + " users "}{(val.userList.length < val.maxusers) ? <Button onClick={(e) => this.roomRedirect(e, val.password, val.url)} variant="secondary">Join!</Button> : <a><Button disabled>Room is full!</Button></a>}</Card.Text>)
                                        if (val.userList.length <= 0) {
                                            fetch(process.env.REACT_APP_API_BR_URL + val._id, { method: 'DELETE' }) // Remove the document in DB
                                            return
                                        } else {
                                            if (this.state.searchTerm == "") {
                                                return showStruct
                                            }
                                            else if (val.title.toLowerCase().includes(this.state.searchTerm.toLowerCase())) {
                                                return showStruct
                                            }
                                        }
                                    }
                                }).map((item) => (item))
                            }
                        </Card>
                    </Col>
                </Container>
            </div>
        )
    }
}

export default withRouter(JoinChatRoom)