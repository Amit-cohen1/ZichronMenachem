import React, { useEffect } from 'react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const LogoutAction = () => {
  const navigate = useNavigate();

  useEffect(() => {
    auth.signOut()
      .then(() => {
        // Logout successful, redirect or handle accordingly
        console.log('User logged out successfully');
        navigate('/login');
      })
      .catch((error) => {
        // An error occurred while logging out
        console.error('Error logging out:', error);
        // Handle the error, display a message, etc.
      });
  }, [navigate]);

  return null; // Since this is not a visual component, return null or an empty fragment
};

export default LogoutAction;
