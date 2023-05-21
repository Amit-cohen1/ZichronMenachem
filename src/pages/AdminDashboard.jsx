import React, { useState } from 'react';
import firebase from '../firebase';
import firestore from '../firebase';
import { auth } from '../firebase';
import { BrowserRouter as Router, Route, Switch, Redirect, useNavigate } from 'react-router-dom';
import RegisterForm from './RegisterForm';
import './Forms.css'; // Import the CSS file
import { collection, query, where, getDocs, getFirestore, setDoc, doc } from "firebase/firestore";
import { Await } from 'react-router-dom/dist';
const AdminDashboard = () => {

  // Content and functionality for the admin dashboard
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
          console.log(doc.data())

       }
       
    });
  };


  return (
    <div className='container'>
      <h2>Welcome, Admin!</h2>
      {/* Admin-specific content */}
      <label>
        Search:
       <input type="text" placeholder="Search" value={searchTerm} onChange={handleSearchChange} />
      </label>
      <button type="button"  className="button" value= {searchTerm} onClick={handleSearchSubmit}>Submit</button>
      <br/><p/>
      <div className='container'>
        <h2> List of new users</h2>
        <div id = "1">

        </div>

      </div>
    </div>

    
    
  );
  };

export default AdminDashboard;
