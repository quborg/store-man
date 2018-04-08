import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

import {Container, Row, Col, CardGroup, Card, CardBody, Button, Input, InputGroup, InputGroupAddon, InputGroupText, Alert} from 'reactstrap';

const MSG_ERROR_LOGIN = 'Informations non valides.'

class Login extends Component {

  state = {
    loggedIn: false,
    error: false
  }

  componentWillMount() {
    this.setState({'loggedIn': localStorage.getItem('loggedIn')})
  }

  onSubmit = e => {
    e.preventDefault();
    const { username, password } = this.state;

    if (username === 'bensaadat.amine@gmail.com' && password === '12345678') {
      this.setState({loggedIn: true})
      localStorage.setItem('loggedIn', true);
    }
    else {
      this.setState({error: MSG_ERROR_LOGIN})
    }
  }

  nameHandler = e => {
    this.setState({
      username: e.target.value,
      error: false
    })
  }

  passHandler = e => {
    this.setState({
      password: e.target.value,
      error: false
    })
  }

  render() {
    return this.state.loggedIn
    ? <Redirect from="/" to="/dashboard"/>
    : <div className="app flex-row align-items-center fixed">
        <Container>
          <Row className="justify-content-center">
            <Col md="4">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <h1>Authentification</h1>
                    <p className="text-muted">Connectez-vous à votre compte</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" placeholder="bensaadat.amine@gmail.com" onChange={this.nameHandler}/>
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" placeholder="12345678" onChange={this.passHandler}/>
                    </InputGroup>
                    <Row>
                      <Col xs="4">
                        <Button color="primary" className="px-4"
                          onClick={this.onSubmit}>
                          Login
                        </Button>
                      </Col>
                      <Col xs="8" className="text-right">
                        {
                          this.state.error &&
                          <div className="text-danger align-middle h-100" style={{lineHeight:'2.5'}}>
                            { this.state.error }
                          </div>
                        }
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    ;
  }
}

export default Login;
