import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {connect}  from 'react-redux'
import {login} from 'ayla-client/react/actions'
import {Container, Row, Col,
        CardGroup, Card, CardBody,
        Button, Input, InputGroup, InputGroupAddon, InputGroupText,
        Alert} from 'reactstrap'

const MSG_ERROR_LOGIN = 'Informations non valides.'


class Login extends Component {

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

  onSubmit = e => {
    e.preventDefault();
    const { username, password } = this.state;
    this.props.dispatch(login(username, password))
  }

  render() {
    const [{ nameHandler, passHandler, onSubmit }
        , { loggedIn, error, dispatch }] = [this, this.props]

    return loggedIn
    ? <Redirect from="/" to="/dashboard"/>
    : <div className="app flex-row align-items-center fixed animated fadeOut">
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
                      <Input type="text" placeholder="bensaadat.amine@gmail.com" onChange={nameHandler}/>
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" placeholder="12345678" onChange={passHandler}/>
                    </InputGroup>
                    <Row>
                      <Col xs="4">
                        <Button color="primary" className="px-4"
                          onClick={onSubmit}>
                          Login
                        </Button>
                      </Col>
                      <Col xs="8" className="text-right">
                        {
                          error &&
                          <div className="text-danger align-middle h-100" style={{lineHeight:'2.5'}}>
                            { error }
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

const mapState = ({user}, ownProps) => {
  ownProps = { ...ownProps, ...user }
  return ownProps
}

export default connect(mapState)(Login)
