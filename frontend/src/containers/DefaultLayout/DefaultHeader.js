import React from 'react';
import {DropdownItem, DropdownMenu, DropdownToggle, Nav} from 'reactstrap';
import PropTypes from 'prop-types';

import {AppHeaderDropdown, AppSidebarToggler, AppNavbarBrand} from '@coreui/react';
import logo from '../../assets/img/brand/ON_POS_LOGO_BLUE_RGB.svg'
import sygnet from '../../assets/img/brand/ON_POS_LOGO_RGB_BLUE_NO_FONT_SPACED.svg'

import {AppBar, Toolbar} from '@material-ui/core';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

const AccountMenu = ({ onLogout }) => (
  <DropdownMenu right>
    <DropdownItem header tag="div" className="text-center">
      <strong>Account</strong>
    </DropdownItem>
    <DropdownItem onClick={onLogout}>
      <i className="fa fa-lock"/>
      Logout
    </DropdownItem>
  </DropdownMenu>
);

const AccountMenuToggle = () => (
  <DropdownToggle nav>
    <i className="mdi mdi-account mdi-36px"/>
  </DropdownToggle>
);

const AccountMenuContainer = ({ onLogout }) => (
  <AppHeaderDropdown direction="down">
    <AccountMenuToggle/>
    <AccountMenu onLogout={onLogout}/>
  </AppHeaderDropdown>
);

const AccountMenuNav = ({ onLogout }) => (
  <Nav className="ml-auto" navbar>
    <AccountMenuContainer onLogout={onLogout}/>
  </Nav>
);

const AppNavigation = ({ onLogout }) => (
  <Toolbar style={{minHeight: 55}}>
    <AppSidebarToggler className="d-lg-none" display="md" mobile/>
    <AppNavbarBrand
      full={{src: logo, height: 48, alt: 'MOH Logo'}}
      minimized={{src: sygnet, height: 48, alt: 'MOH Logo'}}
    />
    <AppSidebarToggler className="d-md-down-none" display="lg"/>
    <AccountMenuNav onLogout={onLogout}/>
  </Toolbar>
);

const DefaultHeader = ({ onLogout }) => (
  <AppBar style={{minHeight: 55}} color="default">
    <AppNavigation onLogout={onLogout}/>
  </AppBar>
);

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
