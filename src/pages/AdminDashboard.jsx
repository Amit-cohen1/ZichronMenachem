import React, { useState, useEffect } from 'react';
import firebase from '../firebase';
import firestore from '../firebase';
import { auth } from '../firebase';
import { BrowserRouter as Router, Route, Switch, Redirect, useNavigate } from 'react-router-dom';
import RegisterForm from './RegisterForm';
import './Forms.css'; // Import the CSS file
import { collection, query, where, getDocs, getFirestore, setDoc, doc } from "firebase/firestore";
import { Await } from 'react-router-dom/dist';
import Background from '../components/Background';
const AdminDashboard = () => {

  // Content and functionality for the admin dashboard
  const [searchTerm, setSearchTerm] = useState('');
  const [userName, setUserName] = useState(''); // Initialize with a default username

  // Fetch the username from Firebase auth when the component mounts
  useEffect(() => {
      const user = auth.currentUser;
      if (user) {
        setUserName(user.displayName);
      }
  }, []);

  const db = getFirestore();
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    console.log("the val is:", event.target.value)
    
  };

  const handleSearchSubmit = async (e) => {
    const q = query(
      collection(db,"users"),
      where("email", "==", e.target.value)
    );
    const qs = await getDocs(q);
    qs.forEach((doc) => {
       if (doc.exists){
          console.log(doc.data())

       }
       
    });
  };
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


  return (
    <Background>
    
    <button className="logout-button" onClick={handleLogout}>התנתק</button>
    <div className='container2'>
      <h2>ברוך הבא {userName}</h2>
      {/* Admin-specific content */}
      <div className='adminContainer'>
      <input className='searchBar1' type="text" placeholder="הכנס מייל" value={searchTerm} onChange={handleSearchChange} />
      <button className='AdminBtn' type="button"  value= {searchTerm} onClick={handleSearchSubmit}>חפש</button>
      </div>

      <br/><p/>
      
        <h3> רשימת משתמשים חדשים</h3>
        <div id = "1">

        </div>

      
    </div>
    </Background>
    
    
  );
  };

export default AdminDashboard;
