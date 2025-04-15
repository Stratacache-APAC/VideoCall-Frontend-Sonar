import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'





const UsernameInput = (props) => {
  const { username, setUsername, handleSubmitButtonPressed, handleForgotButtonPressed, getPassword, userPwd, setUserPwd } = props;

  return (
    <div>
      <div className='input-group'>
        {/* <span className='font_weight_500 p-1 text-light '>Username* :</span> */}
        <div className="input-group-prepend">
              <span className="form-control" ><FontAwesomeIcon icon={faUser} /></span>
        </div>
        <input
          type='text'
          value={username}
          onChange={(event) => { setUsername(event.target.value); }}
          className='form-control'
          placeholder="Enter User Name"
        />
      </div>
      <div className='input-group py-2'>
        {/* <span className='font_weight_500 p-1 text-light'>Password* :</span> */}
        <div className="input-group-prepend">
              <span className="form-control" ><FontAwesomeIcon icon={faKey} /></span>
        </div>
        <input
          type='password'
          value={userPwd}
          onChange={(event) => { getPassword(event.target.value); }}
          className='form-control'
          placeholder="Enter User Password"
        />
      </div>
      {/* <div className='p-0 text-center'>
          <button
          className='p-0 m-0 btn btn-link text-light'
          onClick={handleForgotButtonPressed}
            >
          Forgot Password ?
        </button>
      </div> */}
      <div className='p-2 text-center'>
          <button
          className='p-1 px-2 m-2 btn btn-light btn-outline-secondary'
          onClick={handleSubmitButtonPressed}>
          <span className="text-dark" ><FontAwesomeIcon icon={faArrowRight} /> LOGIN</span>
        </button>
      </div>
    </div>
  );
};

export default UsernameInput;
