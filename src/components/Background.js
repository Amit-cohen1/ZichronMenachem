import React from 'react';
import './Background.css'; // Import the CSS file

const Background = ({ children }) => {
    return (
      <div className="background-container">
        <div className="background-image"></div>
        <header className="header">
        </header>
        <div className="content">{children}</div>
      </div>
    );
  };

export default Background;