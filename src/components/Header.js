import React, { useState } from 'react';
import { Link } from "gatsby"
import 'assets/stylesheets/components/__components.scss';
import { Button } from 'reactstrap';

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavbarText
} from 'reactstrap';


//class Header extends React.component

 const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  return (
    <div>
      <Navbar fixed="top" color="dark" dark expand="lg">
        <NavbarBrand><Link to="/">Στατιστικά Camps Μεταναστών</Link></NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="container" navbar>
          <NavItem>
            <Link to="/capacity/">Χωρητικότητα Camps</Link>
            </NavItem>
            <NavItem>
            <Link to="/">Κρούσματα COVID19</Link>
            </NavItem>
            <NavItem>
            <Link to="/geolocate/">Πάω στην περιοχή μου</Link>
            </NavItem>
            <NavItem>
            <a style={{ color: 'greenyellow' }} href="https://virusnearby.com">ΤΕΣΤΣ ΠΟΥ ΕΓΙΝΑΝ</a>
            </NavItem>
          </Nav>
          <NavbarText><Button color="success" border-radius= "20" href="https://virusnearby.com/data-sources/" target="_blank">ΣΤΑΤΙΣΤΙΚΑ</Button>{''}</NavbarText>
        </Collapse>
      </Navbar>
    </div>
  );
 }

 export default Header;
