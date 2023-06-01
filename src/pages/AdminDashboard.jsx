import React, { useState } from 'react';
import firebase from '../firebase';
import firestore from '../firebase';
import { auth } from '../firebase';
import { BrowserRouter as Router, Route, Switch, Redirect, useNavigate } from 'react-router-dom';
import RegisterForm from './RegisterForm';
import './Forms.css'; // Import the CSS file
import { collection, query, where, getDocs, getFirestore, setDoc, doc } from "firebase/firestore";
import { Await } from 'react-router-dom/dist';
import Background from '../components/Background';
import userCard from '../components/UserEmailContainer'
import Dropdown from 'react-bootstrap/Dropdown';
import UserEmailContainer from '../components/UserEmailContainer';
const AdminDashboard = () => {

  // Content and functionality for the admin dashboard
  const [userEmails, setUserEmails] = useState([]);
  const [showUserEmail, setShowUserEmail] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const db = getFirestore();
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    console.log("the val is:", event.target.value)
    
  };
  const handleSearchSubmit = async (e) => {
    const q = query(
      collection(db,"Users"),
      where("email", "==", e.target.value)
    );
    const qs = await getDocs(q);
    qs.forEach((doc) => {
       if (doc.exists){
          console.log("success with finding user");
          console.log(doc.data());
          setShowUserEmail(true);
          setUserEmail(doc.data().email);
       }
       
    });
  };
  const handelAlot = async () => {
    const emails = [];
    const q = query(
      collection(db,"users"),
      where("role", "==","")
    );
    const qs = await getDocs(q);
    qs.forEach((doc) => {
       if (doc.exists){
          console.log("success with finding user");
          console.log(doc.data());
          emails.push(doc.data().email);
        }
       
    });
    setUserEmails(emails);
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
    <div className='container'>
      <h2>Welcome, Admin!</h2>
      {/* Admin-specific content */}
      <div className='adminContainer'>
        <input className='searchBar1' type="text" placeholder="הכנס מייל" value={searchTerm} onChange={handleSearchChange} />
        <button className='AdminBtn' type="button"  value= {searchTerm} onClick={handleSearchSubmit}>חפש</button>
          {showUserEmail && <UserEmailContainer userEmail={userEmail} />}
      </div>

      <br/><p/>
      <div className='container'>
        <h2> List of new users</h2>
        <div id = "1">
            <button className='AdminBtn' type="button" onClick={handelAlot}>נא לחץ כאן על מנת להציג</button>
            {userEmails.map((email, index) => (
          <UserEmailContainer key={index} userEmail={email} />
        ))}
        </div>      
    </div>

    
    
  );
  };

export default AdminDashboard;
