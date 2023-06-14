import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import './Forms.css';
import { collection, query, where, getDocs, getFirestore, setDoc, doc } from "firebase/firestore";
import Background from '../components/Background';
import UserEmailContainer from '../components/UserEmailContainer';
import './AdminDashboard.css';
import LogoutButton from '../components/LogoutButton';

const AdminDashboard = () => {
  const [userEmails, setUserEmails] = useState([]);
  const [showUserEmail, setShowUserEmail] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [handleAlotClicked, setHandleAlotClicked] = useState(false);
  const db = getFirestore();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserName(user.displayName);
    }
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = async () => {
    const q = query(
      collection(db, "users"),
      where("email", "==", searchTerm)
    );
    const qs = await getDocs(q);
    const foundDocs = [];
    qs.forEach((doc) => {
      if (doc.exists) {
        console.log("success with finding user");
        console.log(doc.data());
        foundDocs.push(doc.data());
      }
    });
    if (foundDocs.length > 0) {
      setShowUserEmail(true);
      setUserEmail(foundDocs[0].email);
    }
  };
  
  
  const handleAlot = async () => {
    const emails = [];
    const q = query(
      collection(db, "users"),
      where("role", "==", "")
    );
    const qs = await getDocs(q);
    qs.forEach((doc) => {
      if (doc.exists) {
        console.log("success with finding user");
        console.log(doc.data());
        emails.push(doc.data().email);
      }
    });
    setUserEmails(emails);
    setHandleAlotClicked(true);
  };
  
  return (
    <Background>
      <div>
          <LogoutButton />
        
      <h2 className="beautyHeadLine">שלום {userName}</h2>
      <div className="containerMain">
        <div className="containerSearchBox">
          <input className='searchBarAdmin' type="text" placeholder="הכנס כתובת אימייל" value={searchTerm} onChange={handleSearchChange} />
          <button className='AdminBtn1' type="button" value={searchTerm} onClick={handleSearchSubmit}>חפש</button>
          {showUserEmail && <UserEmailContainer userEmail={userEmail} />}
        </div>

        <p/>
        <p className="displayBtn"> <button className='AdminBtn2' type="button" onClick={handleAlot}>הצג משתמשים חדשים</button></p>
        <h3 className="Headline">רשימת משתמשים חדשים</h3>
        <div id="userListContainer" className={`user-list-container ${handleAlotClicked ? 'show' : ''}`}>
         
          {handleAlotClicked && userEmails.length > 0 ? (
            <div className="user-list">
              {userEmails.map((email, index) => (
                <UserEmailContainer key={index} userEmail={email} />
              ))}
            </div>
          ) : (
            handleAlotClicked && userEmails.length === 0 && <p>No users found</p>
          )}
        </div>
      </div>
      </div>
    </Background>
  );
};

export default AdminDashboard;
