import React, { useState, useEffect } from 'react';
import NavbarLocal from '../Navbar/Navbar';
import * as Service from '../utils/Service/Service';
import { useHistory } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LogoImage from '../resources/GMR_delhi_combine_logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faPhone } from '@fortawesome/free-solid-svg-icons'
import { faEnvelopeOpen } from '@fortawesome/free-solid-svg-icons';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { faUserCog } from '@fortawesome/free-solid-svg-icons'
import Select from "react-select";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Swal from 'sweetalert2';
import './Operator.css';
import {
  useParams
} from 'react-router-dom';
import axios from 'axios';
import * as common from '../utils/Service/Common';


const OperatorEdit = () => {

  let { userid } = useParams();
  let [operators, setOperator] = useState(null);

  let [userName, setuserName] = useState(null);
  let [userEmail, setuserEmail] = useState(null);
  let [userPwd, setuserPwd] = useState(null);
  let [userAdmin, setuserAdmin] = useState("");

  let [isUpdate, setisUpdate] = useState(null);
  let [userConfirmPwd, setuserConfirmPwd] = useState(null);

  let [firstName, setFirstName] = useState(null);
  let [lastName, setLastName] = useState(null);
  let [contactNumber, setContactNumber] = useState(null);
  let [status, setStatus] = useState(null);

  let [terminals, setTerminals] = useState([]);
  let [selectedTerminals, setSelectedTerminals] = useState([]);

  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');

  const [permissions, setPermissions] = useState([]);


  useEffect(() => {
    loadData();
    loadTerminals();

  }, []);

   useEffect(() => {
      const fetchUserPermissions = async () => {
          const userName = common.getUser();
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

    const hasPermission = (permissionId) => {
      return permissions.includes(permissionId);
    };
  
  useEffect(() => {
    const fetchRoles = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_SERVER}/api/roles`);
            setRoles(response.data);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    fetchRoles();
}, []);

  const loadData = () => {
    // Reset fields directly using setters
    setuserName("");
    setuserEmail("");
    setuserPwd("");
    setuserAdmin("");
    setFirstName("");
    setLastName("");
    setContactNumber("");
    setSelectedTerminals([]);
    setStatus("");
    setSelectedRole("")
  
    if (userid) {
      Service.fetchData('getAllUsers').then(res => {
        const operatorData = res.find(result => result.userId == userid);
        if (operatorData) {
          setuserName(operatorData.userName);
          setuserEmail(operatorData.emailAddress);
          setuserPwd('');
          setuserAdmin(operatorData.isAdmin);
          setFirstName(operatorData.firstName);
          setLastName(operatorData.lastName);
          setContactNumber(operatorData.contactNumber);
          setStatus(operatorData.status);
          setisUpdate(true);
          setSelectedRole(operatorData.role);
      
          let formattedSelectedTerminals = [];
      
          if (typeof operatorData.terminal === 'string' && operatorData.terminal.length > 0) {
              // Split the comma-separated string into an array of strings
              const terminalArray = operatorData.terminal.split(',').map(term => term.trim());
      
              // Format each terminal into an object for react-select
              formattedSelectedTerminals = terminalArray.map(term => ({
                  value: term,
                  label: term
              }));
          } else if (Array.isArray(operatorData.terminal)) {
              //If it is already an array, then format it.
              formattedSelectedTerminals = operatorData.terminal.map(term => ({
                  value: term,
                  label: term,
              }));
          } else if (operatorData.terminal) {
              console.warn("operatorData.terminal is not a string or array:", operatorData.terminal);
          }
      
          setSelectedTerminals(formattedSelectedTerminals);
          console.log("Terminals:", formattedSelectedTerminals);
      }
      }).catch(err => {
        console.error('Error fetching data:', err);
        // Optional: notify user of error
      });
    } else {
      setisUpdate(false);
    }
  };
  
  const loadTerminals = async () => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER}/terminals`);
        const formattedTerminals = response.data.map(terminal => ({
            value: terminal.terminal,
            label: terminal.terminal
        }));
        setTerminals(formattedTerminals);
    } catch (error) {
        console.error("Error fetching terminals:", error);
    }
};
const handleTerminalChange = (selectedOptions) => {
  setSelectedTerminals(selectedOptions);
};


  const history = useHistory();

  // const submitMessage = (val) => {
  //   confirmAlert({
  //     // title: 'Message',
  //     message: val,
  //     buttons: [
  //       {
  //         label: 'OK',
  //       }
  //     ]
  //   });
  // };

  const validateEmail = (email) => {
    // Regular expression for email validation
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateContactNumber = (number) => {
    // Regular expression for contact number validation (example: 10 digits)
    const re = /^[0-9]{10}$/;
    return re.test(number);
  };
  const validateUserRole = (role) => {
    // Validate if the role is selected (it shouldn't be empty or null)
    return role !== '' && role !== null;
  };
  
  const validateAgentStatus = (status) => {
    // Validate if the status is selected (it shouldn't be empty or null)
    return status !== '' && status !== null;
  };
  const validateTerminal = (selectedTerminals) => {
    return Array.isArray(selectedTerminals) && selectedTerminals.length > 0;
  };
  const userPwdStatus = (status) => {
    // Validate if the status is selected (it shouldn't be empty or null)
    return userPwd !== '' && userPwd !== null;
  };
  const handleSubmitButtonPressed = () => {
    console.log('handleSubmitButtonPressed utton clicked');
    console.log('Validation:', {
      userName, userEmail, userPwd, userAdmin, firstName, lastName, contactNumber, status, selectedTerminals
    });

    if (!validateEmail(userEmail)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Email',
        text: 'Please enter a valid email address.',
      });
      return;
    }
    if (!validateUserRole(userAdmin)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Email',
        text: 'Please Select the user role.',
      });
      return;
    }
    if (!validateAgentStatus(status)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Email',
        text: 'Select the user status.',
      });
      return;
    }
    if (!validateTerminal(selectedTerminals)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Terminal Selection',
        text: 'Please select at least one terminal.',
      });
      return;
    }

    if (!validateContactNumber(contactNumber)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Contact Number',
        text: 'Please enter a valid contact number (10 digits).',
      });
      return;
    }
    if (!userPwdStatus(userPwd)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Contact Number',
        text: 'Please enter a valid contact number (10 digits).',
      });
      return;
    }
    // if (!userName || !userEmail || !userPwd || !userAdmin || !firstName || !lastName || !contactNumber || !status) {
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Validation Error',
    //     text: 'Please fill in all fields.',
    //   });
    //   return;
    // }
    const terminalValues = selectedTerminals.map(term => term.value);
    console.log("Sending terminals:", terminalValues);

    const opratorData = {
      name: userName,
      email: userEmail,
      password: userPwd,
      isAdmin: userAdmin,
      firstName: firstName,
      lastName: lastName,
      contactNumber: contactNumber,
      status: status,
      terminals: terminalValues,
      role: selectedRole
    };

    Service.fetchPostData('createUser', opratorData).then(res => {
      console.log('API response:', res);  // Add this log
      if (res.error) {
        Swal.fire({
          icon: 'error',
          title: 'User Exists',
          text: 'User Already Exists',
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Created Successfully',
          text: 'User has been created successfully.',
        });
        history.push('/operatorlist');
      }
    }).catch(err => {
      console.error('API Error:', err); // Handle and log any errors
    });    
  };


  const handleDelete = () => {
    // Show confirmation popup first
    Swal.fire({
      title: 'Are you sure?',
      text: "You are about to delete this operator.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with deletion only if user confirms
        console.log("delete done ....");
        const operatorData = {
          name: userName,
        };
        console.log("handle calleddddd");
        console.log(operatorData);
        
        // Proceed with API call for deletion
        Service.fetchLoginPostData('deleteUser', operatorData).then(res => {
          console.log("res", res);
          if (res.status === 409) {
            // Use SweetAlert2 for error case
            Swal.fire({
              icon: 'error',
              title: 'Deletion Error',
              text: 'Cannot Delete Admin',
            });
          } else if (res.status >= 400) {
            res.json().then(data => {
              console.log(data);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.result,
              });
            });
          } else {
            // Use SweetAlert2 for success case
            Swal.fire({
              icon: 'success',
              title: 'Deleted Successfully',
              text: 'User has been deleted successfully.',
            }).then(() => {
              history.push('/operatorlist');
            });
          }
        });
      } else {
        // If the user cancels, show a cancellation message (optional)
        Swal.fire('Cancelled', 'The operator was not deleted.', 'info');
      }
    });
  };
  

  const handleUpdate = () => {
    if (userName === '' || userEmail === '' || userPwd === '' || userAdmin === '' || firstName === '' || lastName === '' || contactNumber === '' || status === '' || selectedTerminals.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all fields.',
      });
      return;
    }

    if (isChecked && userPwd !== userConfirmPwd) {
      Swal.fire({
        icon: 'error',
        title: 'Password Mismatch',
        text: 'Password and Confirm Password do not match.',
      });
      return;
    }

    if (!validateEmail(userEmail)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Email',
        text: 'Please enter a valid email address.',
      });
      return;
    }

    if (!validateContactNumber(contactNumber)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Contact Number',
        text: 'Please enter a valid contact number (10 digits).',
      });
      return;
    }

    const operatorData = {
      name: userName,
      email: userEmail,
      password: userPwd,
      isAdmin: userAdmin,
      confirmPassword: userConfirmPwd,
      firstName: firstName,
      lastName: lastName,
      contactNumber: contactNumber,
      status: status,
      role: selectedRole ,
      terminals: selectedTerminals.map(term => term.value)
    };

    Service.fetchPostData('updateUser', operatorData).then(res => {
      Swal.fire({
        icon: 'success',
        title: 'Updated Successfully',
        text: 'User details have been updated successfully.',
      });
      history.push('/operatorlist');
    });
  };


  const [isChecked, setIsChecked] = React.useState(false)
  console.log('cccclllicked', isChecked);

  return (
    <div className="row">
      <div className="col-md-2">
        <ToastContainer />
        <NavbarLocal />
      </div>
      <div className="col-md-10">
          <div className='m-2 p-3 bg-clr operatorEdit'>
            <div className="top-image-container-operatoredit">
          </div>
            <div className='frame_table_border'>
              <div className=' bg_color p-2 d-flex'>
                <div className=''>
                  <span className='text-light font_weight_500 font_size_large'>Add Operator</span>
                </div>
              </div>
              <div className='container width_50  mainContainer'>
                <div className='bg-light p-2 m-1 rounded'>
                  <div className="input-group mb-3" style={{ position: 'relative' }}>
                    <div className="input-group-prepend">
                      <span className="form-control" ><FontAwesomeIcon icon={faUser} /></span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter User Name"
                      aria-label="Username"
                      value={userName}
                      onChange={(event) => { setuserName(event.target.value); }}
                    />
                    <div className="tooltip">Enter the username</div>
                  </div>
                </div>
  
                <div className='bg-light p-2 m-1 rounded'>
                  <div className="input-group mb-3" style={{ position: 'relative' }}>
                    <div className="input-group-prepend">
                      <span className="form-control"><FontAwesomeIcon icon={faEnvelopeOpen} /></span>
                    </div>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter User Email"
                      aria-label="User Email"
                      value={userEmail}
                      onChange={(event) => { setuserEmail(event.target.value); }}
                    />
                    <div className="tooltip">Enter the email address</div>
                  </div>
                </div>
  
                <div className='bg-light p-2 m-1 rounded'>
                  <div className="input-group mb-3" style={{ position: 'relative' }}>
                    <div className="input-group-prepend">
                      <span className="form-control"><FontAwesomeIcon icon={faUserCog} /></span>
                    </div>
                    <select
                    className="form-control"
                    value={selectedRole}
                    onChange={(event) => {
                      const selected = event.target.value;
                      setSelectedRole(selected);
                      setuserAdmin(selected === "Admin"); // if admin, set to true.
                    }}
                >
                    <option value="" disabled>Select the user role</option>
                    {roles.map((role) => (
                        <option key={role} value={role}>{role}</option>
                    ))}
                </select>
                    <div className="tooltip">Select the user role</div>
                  </div>
                </div>
  
                <div className='bg-light p-2 m-1 rounded'>
                  <div className="input-group mb-3" style={{ position: 'relative' }}>
                    <div className="input-group-prepend">
                      <span className="form-control"><FontAwesomeIcon icon={faKey} /></span>
                    </div>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter User Password"
                      aria-label="User Password"
                      value={userPwd}
                      onChange={(event) => { setuserPwd(event.target.value); }}
                    />
                    <div className="tooltip">Enter the password</div>
                  </div>
                </div>
  
                <div className='bg-light p-2 m-1 rounded'>
                  <div className="input-group mb-3" style={{ position: 'relative' }}>
                    <div className="input-group-prepend">
                      <span className="form-control"><FontAwesomeIcon icon={faUser} /></span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter First Name"
                      value={firstName}
                      onChange={(event) => { setFirstName(event.target.value); }}
                    />
                    <div className="tooltip">Enter the first name</div>
                  </div>
                </div>
  
                <div className='bg-light p-2 m-1 rounded'>
                  <div className="input-group mb-3" style={{ position: 'relative' }}>
                    <div className="input-group-prepend">
                      <span className="form-control"><FontAwesomeIcon icon={faUser} /></span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Last Name"
                      value={lastName}
                      onChange={(event) => { setLastName(event.target.value); }}
                    />
                    <div className="tooltip">Enter the last name</div>
                  </div>
                </div>
  
                <div className='bg-light p-2 m-1 rounded'>
                  <div className="input-group mb-3" style={{ position: 'relative' }}>
                    <div className="input-group-prepend">
                      <span className="form-control"><FontAwesomeIcon icon={faPhone} /></span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Contact Number"
                      value={contactNumber}
                      onChange={(event) => { setContactNumber(event.target.value); }}
                    />
                    <div className="tooltip">Enter contact number</div>
                  </div>
                </div>
  
                <div className='bg-light p-2 m-1 rounded'>
                  <div className="input-group mb-3" style={{ position: 'relative' }}>
                    <div className="input-group-prepend">
                      <span className="form-control"><FontAwesomeIcon icon={faUserCog} /></span>
                    </div>
                    <select
                      className="form-control"
                      value={status} // Bind status here
                      onChange={(event) => { setStatus(event.target.value); }} // Update status based on user input
                    >
                       <option value="" disabled>Select the user status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <div className="tooltip">Select the user status</div>
                  </div>
                </div>

                <div className='bg-light p-2 m-1 rounded' >
                <div className="input-group mb-3" style={{ position: 'relative', height:'40px' }}>
                    <div className="input-group-prepend">
                        <span className="form-control" style={{height:'53px' }}><FontAwesomeIcon icon={faUserCog} /></span>
                    </div>
                    <Select
                        options={terminals}
                        value={selectedTerminals}
                        onChange={handleTerminalChange}
                        isMulti
                        placeholder="Select terminals..."
                        className="form-control"
                        styles={{
                          menu: (provided, state) => ({
                              ...provided,
                              zIndex: 99,
                          }),
                        }}
                    />
                </div>
        </div>
         <div>
                  {isUpdate && <input type="checkbox" id="mpCheckbox" className='checkbox' onChange={(e) => setIsChecked(e.target.checked)} />}
                  {isUpdate && <label className='change-pwd-title'>Change Password</label>}
                </div>
                {isUpdate && <div className='bg-light p-2 m-1 rounded'>
                  <div className="input-group mb-3" style={{ position: 'relative' }}>
                    <div className="input-group-prepend">
                      <span className="form-control"><FontAwesomeIcon icon={faKey} /></span>
                    </div>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Confirm Password"
                      aria-label="User Password"
                      value={userConfirmPwd} disabled={!isChecked}
                      onChange={(event) => { setuserConfirmPwd(event.target.value); }}
                    />
                    <div className="tooltip">Confirm the password</div>
                  </div>
                </div>}
  
                <div className='bg-light p-2 m-1 rounded'>
                  <div className="input-group mb-3">
                    <div className="input-group-prepend"></div>
                    {isUpdate && hasPermission(4) && (<button type="button" className="btn btn-danger p-1 m-1 border_radius_btn" onClick={handleDelete}>
                      <span><FontAwesomeIcon icon={faTrash} /> Delete</span>
                    </button>)}
                    {isUpdate && hasPermission(2) && (<button type="button" className="btn btn-success p-1 m-1 border_radius_btn" onClick={handleUpdate}>
                      <span><FontAwesomeIcon icon={faSave} /> Update</span>
                    </button>)}
                    {!isUpdate && <button type="button" className="btn btn-primary p-1 m-1 border_radius_btn" onClick={handleSubmitButtonPressed}>
                      <span><FontAwesomeIcon icon={faSave} /> Create Operator</span>
                    </button>}
                    <button type="button" className="btn btn-secondary p-1 m-1 border_radius_btn" onClick={() => history.push('/operatorlist')}>
                      <span><FontAwesomeIcon icon={faWindowClose} /> Cancel</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
  
};

export default OperatorEdit;