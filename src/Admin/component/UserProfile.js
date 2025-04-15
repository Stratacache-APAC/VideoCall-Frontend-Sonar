import React, { useState, useEffect } from 'react';
import axios from 'axios';
import userProfile from '../../resources/userProfile.png';
import Swal from 'sweetalert2'; // Import SweetAlert2
import * as common from '../../utils/Service/Common';  // Import the common utility for getting the username
import './UserProfile.css';  // Import the CSS file for styling
import * as Services from '../../utils/Service/Service'

const UserProfile = () => {
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '********',
        status: ''
    });

    const [editableData, setEditableData] = useState({
        firstName: '',
        lastName: '',
        password: ''
    });

    // Get username from common utility
    const username = common.getUser();

    const userDetails = JSON.parse(localStorage.getItem('userDetails'));

    useEffect(() => {
      Services.updateAgentCallStatus(userDetails.userId, 'available', true);
      return () => {
      };
    }, []);

    // Fetch user data from the backend API
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                // Fetch user profile data by username
                const response = await axios.get(`${process.env.REACT_APP_SERVER}/getUserProfile?username=${username}`);
                const { firstName, lastName, userName, emailAddress, status } = response.data;

                // Set fetched user data
                setUserData({
                    firstName,
                    lastName,
                    username: userName,
                    emailAddress,
                    password: '********',  // Keep password masked
                    status
                });

                // Set editable data for first name, last name, and password
                setEditableData({
                    firstName,
                    lastName,
                    password: ''
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (username) {
            fetchUserProfile();  // Call the function to fetch user profile
        }
    }, [username]);

    // Handle input changes for editable fields (first name, last name, password)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditableData({ ...editableData, [name]: value });
    };

    const handleBack = () => {
        window.history.back();
    };
    
    // Handle form submission to update user data
    const handleSubmit = async () => {
        // Show confirmation popup
        Swal.fire({
            title: 'Are you sure you want to update your profile?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, update it!',
            cancelButtonText: 'No, cancel',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const updatedData = {
                        firstName: editableData.firstName,
                        lastName: editableData.lastName,
                        password: editableData.password ? editableData.password : null, // Ensure password is passed correctly
                    };

                    // Send updated data to the backend
                    await axios.put(`${process.env.REACT_APP_SERVER}/updateUserProfile`, {
                        username: userData.username,
                        ...updatedData
                    });

                    // Show success popup
                    Swal.fire({
                        title: 'Updated!',
                        text: 'Your profile has been updated successfully.',
                        icon: 'success',
                    });

                } catch (error) {
                    console.error('Error updating user profile:', error);
                    Swal.fire({
                        title: 'Error!',
                        text: 'Failed to update profile.',
                        icon: 'error',
                    });
                }
            }
        });
    };

    return (
        <div>
            <div className="top-image-container-userprofile">
                {/* <img src={LogoImage} alt="GMR Delhi Logo" className="logo-image" /> */}
            </div>
            <div className="user-profile-container">
                <div className="user-profile-header">
                <img style={{width: '26px', marginRight: '14px'}} src={userProfile} />
                    <h2 style={{fontWeight:'900'}}> User Profile</h2>
                </div>
                <div className="user-profile-form">
                    <div className="form-section">
                        <label>First Name</label>
                        <input 
                            type="text" 
                            name="firstName"
                            value={editableData.firstName} 
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-section ">
                        <label>Email Address</label>
                        <input style={{backgroundColor:'#D9D9D9'}} type="email" value={userData.emailAddress} readOnly />
                    </div>
                    <div className="form-section">
                        <label>Last Name</label>
                        <input 
                            type="text" 
                            name="lastName"
                            value={editableData.lastName} 
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-section">
                        <label>Password</label>
                        <div className="password-section">
                            <input 
                                type="password" 
                                name="password"
                                value={editableData.password} 
                                onChange={handleChange}
                                placeholder="New Password"
                            />
                            <button>Reset</button>
                        </div>
                    </div>
                    <div className="form-section">
                        <label>Username</label>
                        <input style={{backgroundColor:'#D9D9D9'}} type="text" value={userData.username} readOnly />
                    </div>
                    <div className="form-section">
                        <label>Status</label>
                        <input style={{backgroundColor:'#D9D9D9'}} type="text" value={userData.status} readOnly />
                    </div>
                </div>
                <div className="user-profile-actions">
                <button className="back-btn" onClick={handleBack}>Back</button>
                    <button className="save-btn" onClick={handleSubmit}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
