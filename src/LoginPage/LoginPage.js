import React, { useState } from 'react';
import { connect } from 'react-redux';
import logo from '../resources/GMR_delhi_combine_logo.png';
import loginUsericon from '../resources/loginuserIcon.png';
import loginPasswordicon from '../resources/loginpasswordIcon.png';
import eyeIcon from '../resources/eyeIcon.png'; // Import the eye icon
import UsernameInput from './components/UsernameInput';
import SubmitButton from './components/SubmitButton';
import { useHistory } from 'react-router-dom';
import { setUsername, usertypeop } from '../store/actions/dashboardActions';
import { registerNewUser } from '../utils/wssConnection/wssConnection';
import './LoginPage.css';
import * as Service from '../utils/Service/Service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setUserSession } from '../utils/Service/Common';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import * as Services from '../utils/Service/Service';

const LoginPage = ({ saveUsername }) => {
  const [username, setUsername] = useState('');
  const [userPwd, setUserPwd] = useState(''); // State for the password
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State for password visibility

  const history = useHistory();

  const submitMessage = (val) => {
    confirmAlert({
      message: val,
      buttons: [
        {
          label: 'OK',
        }
      ]
    });
  };

  const handleSubmitButtonPressedold = () => {
    const userData = {
      username: username,
      usertype: usertypeop,
      userreason: null
    };
    registerNewUser(username, usertypeop);
    saveUsername(userData);
    history.push('/dashboard');
  };

  const handleForgotButtonPressed = () => {
    history.push('/forgot');
  };

  const handleSubmitButtonPressed = () => {
    const userData = {
      name: username,
      password: userPwd,
    };
    Service.fetchLoginPostData('login', userData).then((res) => {
      if (res.status >= 400) {
        res.json().then(data => {
          submitMessage("Please provide all the required and correct details to proceed with login.");
        });
      } else {
        res.json().then(data => {
          setUserSession('XYZtokenHardCoded?isAdmin=' + data.details[0].isAdmin, username);
          localStorage.setItem('userDetails', JSON.stringify(data.details[0]));
          handleSubmitButtonPressedold();
          Services.updateAgentCallStatus(data.details[0].userId, 'available', true);
        });
      }
    });    
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="align">
      <ToastContainer />
      <div className='col-12 row '>
        <div className='col-6 login-page_containers'>
          <img className='login-page_logo_image' src={logo} alt='VideoTalker' />
        </div>
        <div className='col-6 bg_color_login '>
          <div className='bg_color_login'>
            <div>
              <div className='input-wrapper'>
                <div className='input-icon'>
                  <img src={loginUsericon} alt='User Icon' style={{ width: '20px', height: '20px' }} />
                </div>
                <input 
                  type='email' 
                  placeholder='Enter your User Name'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className='login-input'
                />
              </div>
              <div className='input-wrapper'>
                <div className='input-icon'>
                  <img src={loginPasswordicon} alt='Password Icon' style={{ width: '15px', height: '23px' }} />
                </div>
                <div>
                  <input
                    type={isPasswordVisible ? 'text' : 'password'} // Toggle input type
                    placeholder='Enter your password'
                    value={userPwd}
                    onChange={(e) => setUserPwd(e.target.value)}
                    className='login-input'
                  />
                  <img src={eyeIcon} alt='Toggle Password Visibility' style={{ cursor: 'pointer', width: '25px', height: '20px', position: 'relative', right: '32px' }} onClick={togglePasswordVisibility} />
                </div>
              </div>
              <div className='login-btn'>
                <button
                  className='login-button'
                  onClick={handleSubmitButtonPressed}
                >
                  LOGIN
                </button>
              </div>
              <button
                className='forgot-password'
                onClick={handleForgotButtonPressed}
                style={{ display: 'none' }}
              >
                Forgot password?
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapActionsToProps = (dispatch) => {
  return {
    saveUsername: username => dispatch(setUsername(username))
  };
};

export default connect(null, mapActionsToProps)(LoginPage);
