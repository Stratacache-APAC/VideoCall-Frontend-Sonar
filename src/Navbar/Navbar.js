// import React, { useState } from 'react';
// import { Navbar } from 'react-bootstrap';
// import './Navbar.css';
// import logo from '../resources/STRATACACHE_logo.png';
// import { useHistory } from 'react-router-dom';
// import { Link } from 'react-router';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faUser } from '@fortawesome/free-solid-svg-icons'
// import { faFile } from '@fortawesome/free-solid-svg-icons'
// import { faPowerOff } from '@fortawesome/free-solid-svg-icons'
// import { faHeadphones } from '@fortawesome/free-solid-svg-icons'





// import * as common from '../utils/Service/Common';
// // import { checkActiveGroupCall } from '../utils/webRTC/webRTCGroupCallHandler';
// import * as webRTCGroupCallHandler from '../utils/webRTC/webRTCGroupCallHandler';

// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// import { confirmAlert } from 'react-confirm-alert'; 
// import 'react-confirm-alert/src/react-confirm-alert.css'; 

// const NavbarLocal = () => {

//   const history = useHistory();

//   const submitMessage = (val) => {
//     confirmAlert({
//       // title: 'Message',
//       message: val,
//       buttons: [
//         {
//           label: 'OK',
//         }
//       ]
//     });
//   };

//   const userName = common.getUser();
//   console.log('user data', userName);

//   const  handleonLogout = () => {
//     if(webRTCGroupCallHandler.checkActiveGroupCall()) {
//       // toast.warning("Please disconnect the active call");
//       submitMessage("Please disconnect the active call");

//     } else {
//       common.removeUserSession();
//       history.push('/login');
//       window.location.reload();
//     }
//   };

//   const navigateMenu = (path) => {
//     // check if in a call
//     if(webRTCGroupCallHandler.checkActiveGroupCall()) {
//       // toast.warning("Please disconnect the active call");
//       submitMessage("Please disconnect the active call");
//     } else {
//       history.push(path);
//     }
//   }


//   return (
//     <>
//     <ToastContainer />
//     <nav className="navbar navbar-expand-lg navbar-light navbar-bg">
//         {/* <img className='login-page_logo_image' src={logo} alt='' onClick={() => history.push('/dashboard')} /> */}
//         <a className="navbar-brand px-3 font_weight_500" onClick={() => history.push('/dashboard') }>VIRTUAL ASSISTANCE</a>
//         <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
//             <span className="navbar-toggler-icon"></span>
//         </button>
//         <div className="collapse navbar-collapse position-absolute right_0" style={{marginRight: "2%"}} id="navbarText">
//             <ul className="navbar-nav mr-auto">
//                 <li className="nav-item hand_cursor">
//                    { common.getToken().split('?')[1] === 'isAdmin=1' && <a className="nav-link" onClick={ e =>  navigateMenu('/operatorlist') }>
//                    <span><FontAwesomeIcon icon={faUser} /> Users</span>
//                      </a> }
//                    {/* { <a className="nav-link" onClick={() => history.push('/operatorlist') }>Admin</a> } */}
//                 </li>
//                 <li className="nav-item hand_cursor">
//                    { common.getToken().split('?')[1] === 'isAdmin=1' && <a className="nav-link" onClick={ e =>  navigateMenu('/Auditlist') }>
//                    <span><FontAwesomeIcon icon={faFile} /> Audits</span>
//                      </a> }
//                    {/* { <a className="nav-link" onClick={() => history.push('/Auditlist') }>Audits</a> } */}
//                 </li>
//                 <li className="nav-item hand_cursor">
//                    { common.getToken().split('?')[1] === 'isAdmin=1' && <a className="nav-link" onClick={ e =>  navigateMenu('/Auditlistinit') }>
//                    <span><FontAwesomeIcon icon={faHeadphones} /> Call Report</span>
//                      </a> }
//                 </li>
//                 <li className="nav-item active">
//                     <a className="nav-link font_weight_bold" onClick={handleonLogout}>
//                     <span><FontAwesomeIcon icon={faPowerOff} /> Logout</span>
//                       <span className="sr-only">({userName})</span></a>
//                 </li>
//                 <li className="nav-item active">
//                   <button className='btn btn current-user' style={{textTransform: 'capitalize'}}>
//                   Current User: {userName}
//                   </button>
//                 </li>
//             </ul>
//         </div>
//     </nav>
//     </>
//   );
// };

// export default NavbarLocal;
import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faFile, faPowerOff, faHeadphones, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import * as common from '../utils/Service/Common';
import * as webRTCGroupCallHandler from '../utils/webRTC/webRTCGroupCallHandler';
import { confirmAlert } from 'react-confirm-alert';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './Navbar.css';
import DashboardIcon from '../resources/Dashboard.svg';
import LogsIcon from '../resources/Logs.svg';
import UsersIcon from '../resources/Users.svg';
import * as Services from '../utils/Service/Service';

const userDetails = JSON.parse(localStorage.getItem('userDetails'));

const NavbarLocal = () => {
  const history = useHistory();
  const location = useLocation();
  const [permissions, setPermissions] = useState([]);
  const userName = common.getUser();

  useEffect(() => {
    const fetchUserPermissions = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER}/api/user-permissions?username=${userName}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user permissions');
        }
        const data = await response.json();
        setPermissions(data);
      } catch (error) {
        console.error('Error fetching user permissions:', error);
      }
    };

    fetchUserPermissions();
  }, [userName]);

  const submitMessage = (val) => {
    confirmAlert({
      message: val,
      buttons: [{ label: 'OK' }],
    });
  };

  const handleonLogout = () => {
    if (webRTCGroupCallHandler.checkActiveGroupCall()) {
      submitMessage('Please disconnect the active call');
    } else {
      Services.updateAgentCallStatus(userDetails.userId, 'away', false);
      common.removeUserSession();
      history.push('/login');
      window.location.reload();
    }
  };

  const navigateMenu = (path) => {
    if (webRTCGroupCallHandler.checkActiveGroupCall()) {
      submitMessage('Please disconnect the active call');
    } else {
      history.push(path);
    }
  };

  const hasPermission = (permissionId) => {
    return permissions.includes(permissionId);
  };

  return (
    <>
      <ToastContainer />
      <div className="navbar-container">
        <nav className="navbar-bg">
          <ul className="nav flex-column">
            {/* New Dashboard Navigation Item */}
            <li
              className={`nav-item hand_cursor ${
                location.pathname === '/dashboard' ? 'active-nav-item' : ''
              }`}
            >
              <a className="nav-link" onClick={() => navigateMenu('/dashboard')}>
                <img className="navImage" src={DashboardIcon} alt="Dashboard" /> Dashboard
              </a>
            </li>
            {hasPermission(8) && (
            <li
              className={`nav-item hand_cursor ${
                location.pathname === '/Auditlist' ? 'active-nav-item' : ''
              }`}
            >
              <a className="nav-link" onClick={() => navigateMenu('/Auditlist')}>
                <img className="navImage" src={LogsIcon} alt="Call Logs" /> Call Logs
              </a>
            </li>
            )}
            {/* Conditional Nav Items */}
            {hasPermission(3) && (
              <li
                className={`nav-item hand_cursor ${
                  location.pathname === '/operatorlist' ? 'active-nav-item' : ''
                }`}
              >
                <a className="nav-link" onClick={() => navigateMenu('/operatorlist')}>
                  <img className="navImage" src={UsersIcon} alt="Users" /> Users
                </a>
              </li>
            )}
            {hasPermission(12) && (
              <li
                className={`nav-item hand_cursor ${
                  location.pathname === '/manage-roles' ? 'active-nav-item' : ''
                }`}
              >
                <a className="nav-link" onClick={() => navigateMenu('/manage-roles')}>
                  <FontAwesomeIcon style={{ marginRight: '20px' }} icon={faUser} /> Manage Roles
                </a>
              </li>
            )}
            {hasPermission(15) && (
              <li
                className={`nav-item hand_cursor ${
                  location.pathname === '/reports' ? 'active-nav-item' : ''
                }`}
              >
                <a className="nav-link" onClick={() => navigateMenu('/reports')}>
                  <FontAwesomeIcon style={{ marginRight: '20px' }} icon={faTachometerAlt} /> Reports
                </a>
              </li>
            )}
            {/* Logout and User Info */}
            <li className="nav-item hand_cursor">
              <a className="nav-link font_weight_bold" onClick={handleonLogout}>
                <FontAwesomeIcon style={{ marginRight: '20px' }} icon={faPowerOff} /> Logout
              </a>
            </li>
            <li className="nav-item">
              <button className="btn btn current-user" style={{ textTransform: 'capitalize' }}>
                Current User: {userName}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default NavbarLocal;