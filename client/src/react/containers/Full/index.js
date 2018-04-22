import React, {Component} from 'react';
import {Link, Switch, Route, Redirect} from 'react-router-dom';
import {connect}  from 'react-redux'
import {Container} from 'reactstrap';

import Header from 'ayla-client/react/components/Header';
import Sidebar from 'ayla-client/react/components/Sidebar';

import Orders, {WeekOrders} from 'ayla-client/react/views/Orders';
import Clients from 'ayla-client/react/views/Clients';
import Products from 'ayla-client/react/views/Products';

class Full extends Component {

  componentWillMount() {
    if (this.props.loggedIn)
      this.props.dispatch({type: 'PENDING_STORE'})
  }

  render() {
    return !this.props.loggedIn
    ? <Redirect to="/login" />
    : <div className="app">
        <Header />
        <div className="app-body">
          <Sidebar />
          <main className="main">
            <Container fluid className='pt-3'>
              <Switch>
                <Route path="/commandes" name="Orders" component={Orders}/>
                <Route path="/clients" name="Clients" component={Clients}/>
                <Route path="/commandes-semaine" name="WeekOrders" component={WeekOrders}/>
                <Route path="/produits-semaine" name="Products" component={Products}/>
                <Redirect from="*" to="/commandes"/>
              </Switch>
            </Container>
          </main>
        </div>
      </div>
    ;
  }
}


const mapState = ({user:{loggedIn}}, ownProps) => {
  ownProps = { ...ownProps, loggedIn }
  return ownProps
}

export default connect(mapState)(Full)
