import React, {Component} from 'react'
import {connect}  from 'react-redux'
import {Redirect} from 'react-router-dom'
import {logout} from 'ayla-client/react/actions'
import {
  Badge,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Dropdown
} from 'reactstrap';

class HeaderDropdown extends Component {

  state = {
    dropdownOpen: false
  }

  toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  goto(path) {
    this.props.dispatch(logout())
    return <Redirect to="/login"/>
  }

  render() {
    return <Dropdown nav isOpen={this.state.dropdownOpen} toggle={this.toggle}>
      <DropdownToggle nav>
        <img src={'img/avatars/6.jpg'} className="img-avatar" />
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem onClick={() => this.goto('/logout')}><i className="fa fa-lock"></i> Logout</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  }
}

export default connect()(HeaderDropdown)
