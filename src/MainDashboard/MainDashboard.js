import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import logo from '../resources/logo.png';
import UsernameInput from './components/UsernameInput';
import SubmitButton from './components/SubmitButton';
import { useHistory } from 'react-router-dom';
import { setUsername, usertypemc, userreasonmc } from '../store/actions/dashboardActions';
import { registerNewUser } from '../utils/wssConnection/wssConnection';
import * as webRTCGroupCallHandler from '../utils/webRTC/webRTCGroupCallHandler';
import './MainDashboard.css';
import { setUserSession } from '../utils/Service/Common';


import {
  useParams
} from 'react-router-dom';


const MainDashboard = ({ saveUsername }) => {
  const [username, setUsername] = useState('');

  const history = useHistory();

    let { userid } = useParams();
    let { userreason } = useParams();
    let { kioskSessionId } = useParams();

    // let { kioskID } = useParams();

    // console.log('up',kioskID);
  
    const handleSubmitButtonPressed = () => {
      const userData = {
        username: userid,
        usertype: usertypemc,
        kioskSessionId:kioskSessionId,
        userreason: userreasonmc[userreason],
        // kioskID: kiosk[kioskID],
      };
      const terminalPrefix = userid.substring(0, 2);
      const terminalNumber = parseInt(terminalPrefix.replace('T', ''), 10);
  
      if (!isNaN(terminalNumber)) {
        userData.terminal = `Terminal ${terminalNumber}`;
      } else {
        userData.terminal = "Unknown Terminal"; //Or some default Value
      }
  
      // Store the updated userData object in localStorage
      localStorage.setItem('userData', JSON.stringify(userData));
      console.log('oa',userData);
      // localStorage.setItem('KioskID',userData.kioskID);
  
      registerNewUser(userid, usertypemc, kioskSessionId)
      .then((socketId) => {
          console.log("Socket ID available:", socketId);
          
          // Now safe to execute saveUsername and createNewGroupCall
          saveUsername(userData);
          webRTCGroupCallHandler.createNewGroupCall();
          setUserSession('tokenformachinelogin?isAdmin=0', username);
          history.push('/dashboard');
  
      })
      .catch((error) => {
          console.error("Error registering new user:", error);
      });
    };

  useEffect(() =>{
    setTimeout(() => handleSubmitButtonPressed(), -100);
  })


  return (
    // <div className='login-page_container bg_color_theme'>
    //   <div className='login-page_login_box background_secondary_color'>
        <div className='login-page_container bg_color_theme'>
      <div className=''>
        {/* <div className='login-page_logo_container'>
          <img className='login-page_logo_image' src={logo} alt='VideoTalker' />
        </div> */}
        {/* <div className='login-page_title_container'>
          <h2>Click Here to Talk to Operator</h2>
        </div> */}
        {/* <UsernameInput username={username} setUsername={setUsername} /> */}
        {/* <SubmitButton handleSubmitButtonPressed={handleSubmitButtonPressed} /> */}
      </div>
    </div>
  );
};

const mapActionsToProps = (dispatch) => {
  return {
    saveUsername: userData => dispatch(setUsername(userData)),
  };
};

export default connect(null, mapActionsToProps)(MainDashboard);
