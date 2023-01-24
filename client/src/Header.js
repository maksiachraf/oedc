import React, { useState, useEffect } from 'react'
import ReactDOM, { render } from 'react-dom';
import { Link } from 'react-router-dom';

import { Image, Row, Col, Container, ButtonGroup, ToggleButton } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';

function Header(props) {
    const [link, setLink] = useState(window.location.pathname);

    const [pageDisplayed, setPageDisplayed] = useState('1');

    const pages = [
        { name: 'Login', link: "/", value: '1', },
        { name: 'Create a Room', link: "/newroom", value: '2' },
        { name: 'Join a Room', link: "/roomchoice", value: '3' },
    ]

    useEffect(() => {
        var switchPage = document.getElementById('Switch-pages');
        switchPage.click();
    }, [link])

    return (
        <div className="App-header">
            <Container>
                <Row>
                    <Col>
                        <Image className="Header-logo" src='logo_large.png' />
                    </Col>
                    <Col>
                        <Link to={link}>
                            <button id="Switch-pages" className="Switch-pages">
                            </button>
                        </Link>

                        <ButtonGroup size="lg" toggle>
                            {pages.map((page, idx) => (
                                <ToggleButton
                                    key={idx}
                                    type="radio"
                                    variant="outline-danger"
                                    value={page.value}
                                    checked={pageDisplayed === page.value}
                                    onChange={function (e) {
                                        setPageDisplayed(e.currentTarget.value);
                                        setLink(page.link);

                                    }}
                                >
                                    {page.name}
                                </ToggleButton>
                            ))
                            }
                        </ButtonGroup>
                    </Col>
                </Row>
            </Container>
        </div >
    )
}

export default Header
