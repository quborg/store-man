import React, {Component} from 'react';
import {Link, Switch, Route, Redirect} from 'react-router-dom';
import {connect} from 'react-redux'
import {Container} from 'reactstrap';

import Header  from 'store-man-client/react/components/Header';
import Sidebar from 'store-man-client/react/components/Sidebar';

import Clients  from 'store-man-client/react/views/Clients';
import Products from 'store-man-client/react/views/Products';
import Bags     from 'store-man-client/react/views/Bags';
import Baskets  from 'store-man-client/react/views/Baskets';
import Orders   from 'store-man-client/react/views/Orders';
import WeekOrders from 'store-man-client/react/views/Orders/WeekOrders';

import LoadingBar from 'store-man-client/react/plugins/loadingBar'


class Full extends Component {

  componentWillMount() {
    if (this.props.loggedIn)
      this.props.dispatch({type: 'PENDING_STORE'})
  }

  render() {
    return !this.props.loggedIn
    ? <Redirect to="/login" />
    : <div className="app">
        <LoadingBar className="loading-bar" scope='default'/>
        <Header />
        <div className="app-body">
          <Sidebar />
          <main className="main">
            <Container fluid className='pt-3'>
              <Switch>
                <Route path="/clients" name="Clients" component={Clients} />
                <Route path="/produits" name="Products" component={Products} />
                <Route path="/embalages" name="Bags" component={Bags} />
                <Route path="/paniers" name="Baskets" component={Baskets} />
                <Route path="/commandes" name="Orders" component={Orders} />
                <Route path="/commandes-semaine" name="WeekOrders" component={WeekOrders} />
                <Redirect from="*" to="/commandes-semaine" />
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
