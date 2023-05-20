import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import './Forms.css'

function RegisterForm() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const register = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("has succeded");
      await updateProfile(user, {
        displayName: displayName
      });


      navigate('/AfterReg'); // Redirect to the dashboard page after successful registration
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className='center'>
      <div className='auth'>
        <h1>Register</h1>
        {error && <div className='auth__error'>{error}</div>}
        <form onSubmit={register} name='register_form'>
          <input
            type='text'
            value={displayName}
            required
            placeholder='Enter your display name'
            onChange={(e) => setDisplayName(e.target.value)}
          />

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

          <button type='submit'>Register</button>
        </form>
        <p>
          Already have an account? <Link to='/login'>Log in here</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterForm;
