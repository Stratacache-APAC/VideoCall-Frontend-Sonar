import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import NavbarLocal from '../Navbar/Navbar';
import './ManageRoles.css';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as common from '../utils/Service/Common';

const ManageRoles = () => {
  const history = useHistory();
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState('');
  const [permissions, setPermissions] = useState([]);
  const userName = common.getUser();

  useEffect(() => {
    fetchRoles();
    fetchUserPermissions();
  }, []);

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

  const hasPermission = (permissionId) => {
    return permissions.includes(permissionId);
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER}/getRoles`);
      if (!response.ok) {
        throw new Error('Failed to fetch roles');
      }
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleEdit = (roleName) => {
    if (hasPermission(10)) {
      history.push(`/editRole/${roleName}`);
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Permission Denied',
        text: 'You do not have permission to edit roles. Please contact an admin for access.',
      });
    }
  };

  const handleDelete = async (roleId, roleName) => {
    if (hasPermission(11)) {
      Swal.fire({
        title: 'Are you sure?',
        text: `You are about to delete the role: ${roleName}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await fetch(`${process.env.REACT_APP_SERVER}/deleteRole/${roleId}`, {
              method: 'DELETE',
            });
            if (!response.ok) {
              throw new Error('Failed to delete role');
            }
            fetchRoles();
            Swal.fire('Deleted!', 'Your role has been deleted.', 'success');
          } catch (error) {
            console.error('Error deleting role:', error);
          }
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Permission Denied',
        text: 'You do not have permission to delete roles. Please contact an admin for access.',
      });
    }
  };

  const handleAddRole = async () => {
    if (hasPermission(9)) {
      if (!newRole.trim()) return;

      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER}/addRole`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ roleName: newRole }),
        });

        if (response.status === 409) {
          Swal.fire({
            icon: 'error',
            title: 'Role Already Exists',
            text: 'A role with that name already exists.',
          });
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to add role');
        }

        setNewRole('');
        fetchRoles();
        Swal.fire('Added!', 'Your role has been added.', 'success');
      } catch (error) {
        console.error('Error adding role:', error);
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Permission Denied',
        text: 'You do not have permission to add roles. Please contact an admin for access.',
      });
    }
  };

  return (
    <div className="manage-roles-page">
      <div className="sidebar">
        <NavbarLocal />
      </div>
      <div className="manage-roles-container">
        <div className="top-image-container" style={{ top: '-45px', left: '-45px' }}></div>
        <div className="header-container">
          <h2 className="manage-roles-title">Manage Roles</h2>
          {hasPermission(9) && (
            <div className="add-role-container">
              <input
                type="text"
                placeholder="Enter new role name"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
              />
              <button className="add-role-button" onClick={handleAddRole}>
                <FontAwesomeIcon icon={faPlus} /> Add Role
              </button>
            </div>
          )}
        </div>
        <div className="roles-table-container">
          <table className="roles-table">
            <thead>
              <tr>
                <th>Role Name</th>
                <th style={{ paddingLeft: '350px' }}>Actions</th>
              </tr>
            </thead>
            <tbody className="roles-table-body">
              {roles.map((role) => (
                <tr key={role.id}>
                  <td>{role.role_name}</td>
                  <td className="actions-cell">
                    <div className="action-buttons-row">
                      <button
                        className="action-button edit-button"
                        onClick={() => handleEdit(role.role_name)}
                        title="Edit"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        className="action-button delete-button"
                        onClick={() => handleDelete(role.id, role.role_name)}
                        title="Delete"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageRoles;