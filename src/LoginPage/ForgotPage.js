import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

// import * as Service from '../utils/Service/Service';
// import './Operator.css';
// import { AuditTableList } from './component/AuditTableList'

// import NavbarLocal from '../Navbar/Navbar';
import './LoginPage.css';
import * as Service from '../utils/Service/Service';
import { ToastContainer, toast } from 'react-toastify';

import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 


const ForgotPage = () => {
  

  let [email, setEmail] = useState(null);
  let [userName, setuserName] = useState(null);


const history = useHistory();

const submitMessage = (val) => {
  confirmAlert({
    // title: 'Message',
    message: val,
    buttons: [
      {
        label: 'OK',
      }
    ]
  });
};

const routeToLogin = () => {
    history.push('/login');
}

const handleForgot = () => {
    console.log("get the details and pass it to server");
    const userData = {
        name: userName,
        email: email,
      };
    Service.fetchLoginPostData('forgotPassword',userData).then( 
        (res) => {
        if(res.status >= 400) {
          const json =  res.json()
          .then( data => {
            console.log(data);
            // toast.error(data.result);
      submitMessage(data.result);

          } );
        } else {
          // write logic to enable
      submitMessage("Email Sent Successful");
      // toast.success("Email Sent Successful");
        }
      });
}
  
    return (
        <div>
            <ToastContainer />
        <div class="form-gap"></div>
        <div className='container'>
            <div className="row justify-content-center">
                <div className="col-md-4">
                  <div className="panel-body">
                    <div className="text-center">
                      <h3><i className="fa fa-lock fa-4x"></i></h3>
                      <h2 className="text-center">Forgot Password?</h2>
                      <p>You can reset your password here.</p>
                      <div>
                          <div className=" ">
                            <div className="input-group p-2">
                              <span className="input-group-addon"><i className="glyphicon glyphicon-envelope color-blue"></i></span>
                              <input id="email" name="email" placeholder="Email Address" className="form-control"  type="email" value={email} 
                              onChange={(event) => { setEmail(event.target.value);}}
                              />
                            </div>
                            <div className="input-group p-2">
                              <span className="input-group-addon"><i className="glyphicon glyphicon-envelope color-blue"></i></span>
                              <input id="name" name="name" placeholder="User Name" className="form-control"  type="name"  value={userName} 
                              onChange={(event) => { setuserName(event.target.value);}}
                              />
                            </div>
                          </div>
                          <div className="form-group d-flex p-1">
                            <input  className="btn bg_color_theme btn-block text-light p-1 m-1" value="Reset Password" onClick={handleForgot} />
                            <input className="btn bg_color_theme btn-block text-light p-1 m-1" value="Back" onClick={routeToLogin}/>
                          </div>
                      </div>
                    </div>
                  </div>
              </div>
        </div>
    </div>
    </div>
    );
  };
  
  export default ForgotPage;