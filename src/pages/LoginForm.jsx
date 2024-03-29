import React, { useState } from 'react';
import { Link, useNavigate, Navigate} from 'react-router-dom';
import { auth, firestore } from '../firebase';
import { signInWithEmailAndPassword, sendEmailVerification, getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import './Forms.css'
import GoogleLogin from '../components/GoogleLogin';
import { collection, addDoc } from 'firebase/firestore';
import Background from '../components/Background';
import GoogleLogo from '../pages/GoogleLogo.png';
import "../components/GoogleLogin.css"
import Container from 'react-bootstrap/Container';


function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  

  const login = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  

      if (user.emailVerified) {
        if(user)
        console.log("flag");
        navigate('/');
      } else {
        setError('Please verify your email before logging in.');
        sendEmailVerification(user)
          .then(() => {
            console.log('Email verification sent');
          })
          .catch((error) => {
            console.error('Error sending email verification:', error);
          });
      }
    } catch (error) {
      setError('Invalid email or password');
    }
  };
  

  // Google Login button 

  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
  
        if (result.additionalUserInfo.isNewUser) {
          const usersCollectionRef = collection(firestore, 'users');
          addDoc(usersCollectionRef, {
            displayName: user.displayName,
            email: user.email,
            role: '',
            childId: '',
          })
            .then(() => {
              console.log('User details written to Firestore');
            })
            .catch((error) => {
              console.error('Error writing user details to Firestore:', error);
            });
          sendEmailVerification(user)
            .then(() => {
              console.log('Email verification sent');
            })
            .catch((error) => {
              console.error('Error sending email verification:', error);
            });
        }
  
        console.log('Success', user);
        if (!user.emailVerified) {
          navigate('/AfterReg');
        } else {
          navigate('/');
        }
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
    <Background>
     <Container>
    <div className='center'>
      <div className='container1'>
        <h1>התחבר</h1>
        {error && <div className='auth__error'>{error}</div>}
        <form className='formLogin' onSubmit={login} name='login_form'>
          <input className='input-login'
            type='email'
            value={email}
            required
            placeholder='הכנס את המייל'
            onChange={(e) => setEmail(e.target.value)}
          />

          <input className='input-login'
            type='password'
            value={password}
            required
            placeholder='הכנס את הסיסמה'
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className='button-login' type='submit'>התחבר</button>
        </form>
        <p>
          אין לך חשבון? <Link to='/register'>צור חשבון כאן</Link>
        </p>
        {/* <p>
        <button className='GoogleBtn' onClick={handleGoogleLogin}> התחבר עם גוגל  
    <img className='imageLogo' src={GoogleLogo} alt='GoogleLogo' /></button>
        </p> */}
      </div>
    </div>
    </Container>
    </Background>
  );
}

export default LoginForm;
