import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../Context/auth_context';
import { useNavigate } from 'react-router-dom';


export default function UserPage() {
  const { user, cookies, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
  });

    const navigate = useNavigate();

  useEffect(() => {
    console.log('user:', user);

    if (user && user.user.id) {
      getUser(user.user.id); // Pass the ID directly
    } else {
      console.log('User is not logged in or user data is not available.');
      // Optionally, redirect to login page or display a message
    }
  }, [user]);

  async function getUser(id) {
    try {
      const response = await fetch(`${import.meta.env.VITE_BE_URL}/users/user/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Include authentication headers if necessary
          // 'Authorization': `Bearer ${yourAuthToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('User data:', data);
      setUserData(data);
      setEditFormData({
        name: data.name || '',
        email: data.email || '',
      });
    } catch (error) {
      console.error('Get User error:', error);
      alert(`Get User failed: ${error.message}`);
    }
  }

  function handleEdit() {
    setIsEditing(true);
  }

  function handleCancel() {
    setIsEditing(false);
    // Reset form data to original user data
    setEditFormData({
      name: userData.name || '',
      email: userData.email || '',
    });
  }

  async function handleSave() {
    try {
      const response = await fetch(`${import.meta.env.VITE_BE_URL}/users/user/${user.user.id}`, {
        method: 'PUT', // or 'PATCH' based on your API
        headers: {
          'Content-Type': 'application/json',
          // Include authentication headers if necessary
          // 'Authorization': `Bearer ${yourAuthToken}`,
        },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedData = await response.json();
      console.log('Updated User data:', updatedData);
      setUserData(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error('Update User error:', error);
      alert(`Update User failed: ${error.message}`);
    }
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

    async function handleDelete() { 
    try {
      const response = await fetch(`${import.meta.env.VITE_BE_URL}/users/user/${user.user.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Include authentication headers if necessary
          // 'Authorization': `Bearer ${yourAuthToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert('User account has been deleted successfully!');
      // Optionally, log out the user after deleting the account
        logout();
      navigate('/landing');
    } catch (error) {
      console.error('Delete User error:', error);
      alert(`Delete User failed: ${error.message}`);
    }
    }

  return (
    <div>
      <h1>User Page</h1>
      {user ? (
        <div>
          {!isEditing ? (
            <>
              <p>Welcome, {userData.name}!</p>
              <p>Email: {userData.email}</p>
              <button onClick={handleEdit}>Edit</button>
              <button onClick={handleDelete}>Delete Account</button>
            </>
          ) : (
            <div>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={editFormData.name}
                onChange={handleInputChange}
              />
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={editFormData.email}
                onChange={handleInputChange}
              />
              <button onClick={handleSave}>Save</button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          )}
        </div>
      ) : (
        <p>Please log in to view your user page.</p>
      )}
    </div>
  );
}