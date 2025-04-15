import React, { useState } from 'react';
import { Navbar } from 'react-bootstrap';
import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logo from '../resources/GMR_delhi_combine_logo.png';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router';


import * as common from '../utils/Service/Common';

const NavbarMachine = () => {

  const history = useHistory();

  const userName = common.getUser();

  const  handleonLogout = () => {
    common.removeUserSession();
    history.push('/login');
  };


  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-lightpy-1">
        <img className='login-page_logo_image' src={logo} alt='' />
        <a className="navbar-brand px-3 font_weight_500" href="#">VIRTUAL ASSISTANCE</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse position-absolute right_0" id="navbarText">
            {/* <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                   { common.getToken().split('?')[1] === 'isAdmin=1' && <a className="nav-link" onClick={() => history.push('/operatorlist') }>Admin</a> }
                   { <a className="nav-link" onClick={() => history.push('/operatorlist') }>Admin</a> }
                </li>
                <li className="nav-item">
                   { common.getToken().split('?')[1] === 'isAdmin=1' && <a className="nav-link" onClick={() => history.push('/operatorlist') }>Admin</a> }
                   { <a className="nav-link" onClick={() => history.push('/Auditlist') }>Audits</a> }
                </li>
                <li className="nav-item active">
                    <a className="nav-link font_weight_bold" onClick={handleonLogout}>Logout <span className="sr-only">({userName})</span></a>
                </li>
            </ul> */}
        </div>
    </nav>
  );
};

export default NavbarMachine;
