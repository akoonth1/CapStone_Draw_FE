import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../Context/auth_context';
import { useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import BookGrid from '../components/BookGrid';
//import ChangePassword from '../components/UpdatePassword';

export default function UserPage() {
  const { user, cookies, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
  });

  const {id} = useParams();

    const navigate = useNavigate();



console.log('userid:', id);



    
  useEffect(() => {
    console.log('user:', user);

    if (user && user.user.id) {
      getUser(user.user.id); // Pass the ID directly
    } else {
      console.log('User is not logged in or user data is not available.');
                //navigate('/landing');
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
    window.location.reload();
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

          // 'Authorization': `Bearer ${yourAuthToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert('User account has been deleted successfully!');
  
        logout();
      navigate('/landing');
    } catch (error) {
      console.error('Delete User error:', error);
      alert(`Delete User failed: ${error.message}`);
    }
    }



async function UserBookList(id){   
    
    try{ const response = await fetch(`${import.meta.env.VITE_BE_URL}/books/book/by/${id}`)
    const BookList = await response.json();
    console.log('BookList:', BookList);
      }catch (error) {
        console.error('Error fetching images:', error);

}}



UserBookList(id);



async function UserPageList(id){   
    
    try{ 
        const response = await fetch(`${import.meta.env.VITE_BE_URL}/api/blobslist/${id}`)
    const PageList = await response.json();
    console.log('PageList:', PageList);
    console.log('PageList:', PageList[0]);
    
    }catch (error) {
        console.error('Error fetching images:', error);


}}



UserPageList(id);








  return (
    <>
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
                {/* <ChangePassword /> */}
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
      <br />
        <h2>Book List</h2>
        
<BookGrid />
    </>
  );
}