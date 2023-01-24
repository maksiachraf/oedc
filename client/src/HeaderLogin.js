import React from 'react'
import ReactDOM, { render } from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css'

import './App.css';

import { Image, Row, Col, Container } from 'react-bootstrap'


function UserInfo(props) {
    if (props.registered == false) {
        return (
            <div className="UserInfo">
                <Image className="Profile-Picture-Header"
                    src='pp.png' />
            </div>
        );

    }
    else {
        return (
            <div className="UserInfo">
                <Image className="Profile-Picture-Header"
                    src={props.src} />
            </div>
        );

    }

}

function HeaderLogin(props) {
    return (
        <div className='App-header' >
            <Container>
                <Row>
                    <Col lg="2">
                        <Image src='logo_large.png' fluid />
                    </Col>
                    <Col>
                        <h1>An Online Ephemeral Decentralized Chat</h1>
                    </Col>
                    <Col lg="2">
                        <UserInfo nickname={props.nickname} src={props.src} registered={props.registered} />
                    </Col>
                </Row>
            </Container >
        </div>


    )



}

export default HeaderLogin
