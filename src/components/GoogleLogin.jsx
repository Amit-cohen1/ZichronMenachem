import React from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { Navigate } from 'react-router-dom';
import GoogleLogo from '../pages/GoogleLogo.png';
import "./GoogleLogin.css"

const GoogleLogin = () => {
  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log("Success"+user);
        Navigate('/');
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        let email = '';
        if (error.customData && error.customData.email) {
          email = error.customData.email;
        }
        const credential = GoogleAuthProvider.credentialFromError(error);
        // Handle the error or display an appropriate message
      });
  };
 

  return (
    <button className='GoogleBtn' onClick={handleGoogleLogin}> התחבר עם גוגל  
    <img className='imageLogo' src={GoogleLogo} alt='GoogleLogo' /></button>
  );
};

export default GoogleLogin;
