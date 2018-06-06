import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {connect}  from 'react-redux'
import {login} from 'ayla-client/redux/actions/api'
import {Container, Row, Col,
        CardGroup, Card, CardBody,
        Button, Input, InputGroup, InputGroupAddon, InputGroupText,
        Alert} from 'reactstrap'

const FAILURE_MSG = 'Echec d\'obtenir une session.'


class Login extends Component {

  state = {
    failure: false
  }

  componentWillReceiveProps({failure}) {
    this.setState({failure})
  }

  nameHandler = e => {
    this.setState({
      username: e.target.value,
      failure: false
    })
  }

  passHandler = e => {
    this.setState({
      password: e.target.value,
      failure: false
    })
  }

  onSubmit = e => {
    e.preventDefault();
    this.setState({failure: false})
    const { username, password } = this.state;
    this.props.dispatch(login(username, password))
  }

  render() {
    const [{ nameHandler, passHandler, onSubmit }
        , { loggedIn, dispatch }] = [this, this.props]

    return loggedIn
    ? <Redirect to="/commandes"/>
    : <div className="app flex-row align-items-center fixed animated fadeIn">
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
                      <Input type="text" placeholder="Email" onChange={nameHandler}/>
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" placeholder="mot de pass" onChange={passHandler}/>
                    </InputGroup>
                    <Row>
                      <Col xs="4">
                        <Button color="primary" className="px-4"
                          onClick={onSubmit}>
                          Login
                        </Button>
                      </Col>
                      <Col xs="8" className="text-right fx fx-ac fx-je">
                        {
                          this.state.failure &&
                          <div className="text-danger font-xs align-middle h-100" style={{lineHeight:'2.5'}}>
                            { FAILURE_MSG }
                          </div>
                        }
                        {
                          this.props.isFetching && <i className="fa fa-spinner fa-spin font-2xl" />
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
