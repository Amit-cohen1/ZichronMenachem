import React from 'react';
import { auth } from '../firebase';
import './LogoutButton.css';

const LogoutButton = () => {
  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        console.log('User logged out successfully');
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      התנתק
    </button>
  );
};

export default LogoutButton;