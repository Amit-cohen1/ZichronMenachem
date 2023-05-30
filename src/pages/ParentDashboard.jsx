import React from 'react';
import {auth} from '../firebase'

const ParentDashboard = () => {
  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        console.log('User logged out successfully');
        // Perform any additional cleanup or redirection logic here
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  };
  // Content and functionality for the parent dashboard
  return (
    <div>
      <button className="logout-button" onClick={handleLogout}>התנתק</button>
      <h2>Welcome, Parent!</h2>
      {/* Parent-specific content */}
    </div>
  );
};

export default ParentDashboard;
