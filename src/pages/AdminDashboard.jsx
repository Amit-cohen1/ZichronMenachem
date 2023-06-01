import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import './Forms.css'; // Import the CSS file
import { collection, query, where, getDocs, getFirestore, setDoc, doc } from "firebase/firestore";
import Background from '../components/Background';
import UserEmailContainer from '../components/UserEmailContainer';
import './AdminDashboard.css';
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
    <Background>
    
    <button className="logout-button" onClick={handleLogout}>התנתק</button>
        <h2 className="hello-doctor">שלום {userName}</h2>
      {/* Admin-specific content */}
      <div className="containerMain">
      <div className="containerSearchBox">
        <input className='searchBarAdmin' type="text" placeholder="הכנס כתובת אימייל" value={searchTerm} onChange={handleSearchChange} />
        <button className='AdminBtn1' type="button"  value= {searchTerm} onClick={handleSearchSubmit}>חפש</button>
          {showUserEmail && <UserEmailContainer userEmail={userEmail} />}
      </div>

      <br/><p/>
      
        <h3 className="Headline"> רשימת משתמשים חדשים</h3>
        <div id = "1">
          <p> <button className='AdminBtn1' type="button" onClick={handelAlot}>נא לחץ כאן על מנת להציג</button></p>
           
            {userEmails.map((email, index) => (
          <UserEmailContainer key={index} userEmail={email} />
        ))}
        </div>      
    </div>
</div>
    
    
  );
  };

export default AdminDashboard;
