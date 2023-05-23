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
import Form from 'react-bootstrap/Form';


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

      if (user.emailVerified()) {
        navigate('/');
      } else {
        setError('Please verify your email before logging in.');
        sendEmailVerification(user);
      }
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  // Google Login button 

  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
  
        // Check if the user is new (registered for the first time)
        if (result.additionalUserInfo.isNewUser()) {
          // Write user details to Firestore
          const usersCollectionRef = collection(firestore, 'users');
          const userDocRef = await addDoc(usersCollectionRef, {
            displayName: user.displayName,
            email: user.email,
            roll: '',
            childId: '',
            // Add additional user details as needed
          });  
          // Send email verification
          await sendEmailVerification(user);
          
          console.log("User details written to Firestore with ID:", userDocRef.id);
        }
  
        console.log("Success", user);
        // Check if the user's email is verified
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
        <Form>
        <form onSubmit={login} name='login_form'>
          <input
            type='email'
            value={email}
            required
            placeholder='הכנס את המייל'
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type='password'
            value={password}
            required
            placeholder='הכנס את הסיסמה'
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type='submit'>התחבר</button>
        </form>
        </Form>
        <p>
          אין לך חשבון? <Link to='/register'>צור חשבון כאן</Link>
        </p>
        <p>
        <button className='GoogleBtn' onClick={handleGoogleLogin}> התחבר עם גוגל  
    <img className='imageLogo' src={GoogleLogo} alt='GoogleLogo' /></button>
        </p>
      </div>
    </div>
    </Container>
    </Background>
  );
}

export default LoginForm;
