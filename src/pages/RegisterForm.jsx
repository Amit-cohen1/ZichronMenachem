import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, firestore } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import './Forms.css'
import Background from '../components/Background';
import { collection, addDoc } from 'firebase/firestore';

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
  
      console.log("Registration succeeded");
      await updateProfile(user, {
        displayName: displayName
      });
  
      // Send email verification
      await sendEmailVerification(user);
  
      // Write user details to Firestore
      const usersCollectionRef = collection(firestore, 'users');
      const userDocRef = await addDoc(usersCollectionRef, {
        displayName: displayName,
        email: email,
        roll: '',
        childId: '',
        // Add additional user details as needed
      });
  
      console.log("User details written to Firestore with ID:", userDocRef.id);
  
      // Navigate to After Register page 
      navigate('/AfterReg'); // Redirect to the dashboard page after successful registration
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Background>
    <div className='center'>
      <div className='container'>
        <h1>הירשם</h1>
        {error && <div className='auth__error'>{error}</div>}
        <form onSubmit={register} name='register_form'>
          <input
            type='text'
            value={displayName}
            required
            placeholder='שם פרטי ושם משפחה'
            onChange={(e) => setDisplayName(e.target.value)}
          />

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
            placeholder='הכנס סיסמה'
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type='submit'>הירשם</button>
        </form>
        <p>
          כבר נרשמת בעבר? <Link to='/login'>התחבר כאן</Link>
        </p>
      </div>
    </div>
    </Background>
  );
}

export default RegisterForm;
