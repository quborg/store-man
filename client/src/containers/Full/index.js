import React, {Component} from 'react';
import {Link, Switch, Route, Redirect} from 'react-router-dom';
import {Container} from 'reactstrap';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Breadcrumb from '../../components/Breadcrumb/';
import Aside from '../../components/Aside/';

import Dashboard from '../../views/Dashboard/';

class Full extends Component {

  state = {
    loggedIn: false
  }

  componentWillMount() {
    this.setState({loggedIn: localStorage.getItem('loggedIn')})
  }

  render() {
    if (!this.state.loggedIn) {
      return <Redirect to="/login" />
    }
    return (
      <div className="app">
        <Header />
        <div className="app-body">
          <Sidebar {...this.props}/>
          <main className="main">
            <Breadcrumb />
            <Container fluid>
              <Switch>
                <Route path="/dashboard" name="Dashboard" component={Dashboard}/>
                <Redirect from="/" to="/dashboard"/>
              </Switch>
            </Container>
          </main>
          <Aside />
        </div>
      </div>
    )
  }
}

export default Full;
