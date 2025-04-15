import React, { useState, useEffect } from "react";
import NavbarLocal from '../Navbar/Navbar';
import './Operator.css';
import { useParams,useHistory } from 'react-router-dom';
import LogoImage from '../resources/GMR_delhi_combine_logo.png'; // Update the path
import Swal from 'sweetalert2';

const EditRole = () => {
  const history = useHistory();
  const { roleName: selectedRole } = useParams();
  const [permissions, setPermissions] = useState({});
  const [permissionIds, setPermissionIds] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state
  
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      history.push("/login"); // Redirect to login if token is missing
    }
  }, [history]);
  
  useEffect(() => {
    fetchData();
  }, [selectedRole]); // Add selectedRole as dependency

  const fetchData = async () => {
    setLoading(true);
    try {
        const permissionsData = await fetch(`${process.env.REACT_APP_SERVER}/api/permissions`).then(res => res.json());
        const rolePermissionsData = await fetch(`${process.env.REACT_APP_SERVER}/api/rolePermissions/${selectedRole}`).then(res => res.json());

        if (permissionsData && permissionsData.permissions && permissionsData.permissionIds) {
            let initialPermissions = permissionsData.permissions;
            const currentPermissionIds = permissionsData.permissionIds; // Corrected line

            if (rolePermissionsData && rolePermissionsData.permissionIds) {
                rolePermissionsData.permissionIds.forEach(permissionId => {
                    Object.keys(currentPermissionIds).forEach(category => { // Corrected line
                        Object.keys(currentPermissionIds[category]).forEach(perm => { // Corrected line
                            if (currentPermissionIds[category][perm] === permissionId) { // Corrected line
                                initialPermissions = {
                                    ...initialPermissions,
                                    [category]: {
                                        ...initialPermissions[category],
                                        [perm]: true,
                                    },
                                };
                            }
                        });
                    });
                });
            }
            setPermissions(initialPermissions);
            setPermissionIds(permissionsData.permissionIds);
        } else {
            console.error("Invalid API response format:", permissionsData);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch permissions. Invalid API response.',
            });
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to fetch data. Please try again.',
        });
    } finally {
        setLoading(false);
    }
};

  const handleCheckboxChange = (category, permission) => {
    setPermissions((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [permission]: !prev[category][permission],
      },
    }));
  };

  const updateRole = async () => {
    if (!permissions) {
      console.error("Permissions data is not available.");
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Permissions data is not available.',
      });
      return;
    }

    const selectedPermissionIds = [];

    Object.keys(permissions).forEach((category) => {
      if (permissions[category]) {
        Object.keys(permissions[category]).forEach((perm) => {
          if (permissions[category][perm]) {
            selectedPermissionIds.push(permissionIds[category][perm]);
          }
        });
      }
    });

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER}/api/updateRolePermissions/${selectedRole}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedPermissionIds }),
      });

      if (!response.ok) {
        throw new Error('Failed to update role');
      }

      console.log("Role:", selectedRole);
      console.log("Selected Permission IDs:", selectedPermissionIds);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Role updated successfully!',
      });
    } catch (error) {
      console.error('Error updating role:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update role. Please try again.',
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return (
    <div className="container-fluid edit-user">
      <div className="row">
        <div className="col-md-2">
          <NavbarLocal />
        </div>
        <div className="col-md-9">
        <div className="top-image-container" style={{ top: '-45px', left: '20px' }}></div>
          <div className="container mt-1 p-3 border rounded bg-white" style={{position:'relative', top:'-50px'}}>
          <h2>Assign Permission: <span style={{ textDecoration: 'underline' }}>{selectedRole}</span></h2> 
            <div className="row" style={{marginBottom:'0px'}}>
              {Object.keys(permissions).map((category) => (
                <div className="col-md-4" key={category}>
                  <h5>{category.charAt(0).toUpperCase() + category.slice(1)}</h5>
                  {permissions[category] && Object.keys(permissions[category]).map((perm) => (
                    <div key={perm}>
                      <input
                        type="checkbox"
                        checked={permissions[category][perm]}
                        onChange={() => handleCheckboxChange(category, perm)}
                      />
                      <label className="ms-2">{perm.charAt(0).toUpperCase() + perm.slice(1)}</label>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <button className="btn btn-primary mt-4" onClick={updateRole}>
              Update Role
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRole;