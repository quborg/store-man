import React, {Component} from 'react'
import {
  Nav,
  NavbarToggler,
  NavbarBrand,
} from 'reactstrap'
import HeaderDropdown from './HeaderDropdown'


class Header extends Component {

  sidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-hidden');
  }

  sidebarMinimize(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-minimized');
  }

  mobileSidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-mobile-show');
  }

  render() {
    return (
      <header className="app-header navbar app-bar shadow">
        <NavbarToggler className="d-lg-none" onClick={this.mobileSidebarToggle}>
          <span className="navbar-toggler-icon"></span>
          <i className="fa fa-navicon burger-menu" />
        </NavbarToggler>
        <NavbarBrand href="#"></NavbarBrand>
        <NavbarToggler className="d-md-down-none mr-auto" onClick={this.sidebarToggle}>
          <i className="fa fa-navicon burger-menu" />
        </NavbarToggler>

        <Nav className="ml-auto pr-3" navbar>
          <HeaderDropdown/>
        </Nav>
      </header>
    );
  }
}

export default Header;
