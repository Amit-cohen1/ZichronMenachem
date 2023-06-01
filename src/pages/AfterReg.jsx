import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendEmailVerification } from 'firebase/auth';
import firebase , { auth } from '../firebase';

const AfterReg = () => {
  const [resendDisabled, setResendDisabled] = React.useState(false);
  const [countdown, setCountdown] = React.useState(60);
  const [error, setError] = useState('');

  const handleResend = async () => {
    setError('');
  
    try {
      const user = auth.currentUser;
  
      // Send email verification
      await sendEmailVerification(user);
  
      console.log("Verification email sent successfully.");
  
      // Disable the button and start the countdown timer
      setResendDisabled(true);
      startCountdown();
    } catch (error) {
      setError(error.message);
    }
  };
  
  
  

  const startCountdown = () => {
    setResendDisabled(true);
    setCountdown(60);
  
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 1) {
          clearInterval(timer);
          setResendDisabled(false);
        }
        return prevCountdown - 1;
      });
    }, 1000);
  };
  

  return (
    <div className="container-message">
      <h2>תודה שנרשמת! בבקשה אשר את המייל שנשלח אלייך ועבור לעמוד התחברות</h2>
      <p>לא קיבלת מייל אישור ? לשליחה חוזרת לחץ שלח</p>
      <p>
      <button className='resendBtn' onClick={handleResend} disabled={resendDisabled}>
        {resendDisabled ? `שלח (${countdown})` : 'שלח'}
      </button>
      </p>
      <p><Link to='/login'>מעבר לעמוד התחברות</Link></p>
    </div>
  );
};

export default AfterReg;
