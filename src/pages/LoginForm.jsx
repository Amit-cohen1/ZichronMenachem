import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import './Forms.css'
import GoogleLogin from '../components/GoogleLogin';

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
        navigate('/');
      } else {
        setError('Please verify your email before logging in.');
        sendEmailVerification(user);
      }
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className='center'>
      <div className='auth'>
        <h1>Log in</h1>
        {error && <div className='auth__error'>{error}</div>}
        <form onSubmit={login} name='login_form'>
          <input
            type='email'
            value={email}
            required
            placeholder='Enter your email'
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type='password'
            value={password}
            required
            placeholder='Enter your password'
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type='submit'>Login</button>
        </form>
        <p>
          Don't have an account? <Link to='/register'>Create one here</Link>
        </p>
        <p>
          <GoogleLogin />
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
