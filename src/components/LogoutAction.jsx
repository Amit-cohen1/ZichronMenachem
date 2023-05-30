import React, { useEffect } from 'react';
import { auth } from '../firebase';

const LogoutAction = ({ onLogout }) => {
  useEffect(() => {
    auth.signOut()
      .then(() => {
        // Logout successful
        console.log('User logged out successfully');
        onLogout(); // Call the provided onLogout callback
      })
      .catch((error) => {
        // An error occurred while logging out
        console.error('Error logging out:', error);
        // Handle the error, display a message, etc.
      });
  }, [onLogout]);

  return null; // Since this is not a visual component, return null or an empty fragment
};

export default LogoutAction;
