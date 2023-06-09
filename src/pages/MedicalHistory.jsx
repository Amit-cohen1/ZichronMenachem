import React, { useState, useEffect } from 'react';
import Background from '../components/Background';
import { getDoc } from 'firebase/firestore';
import { collection, query, where, getDocs, getFirestore, updateDoc } from "firebase/firestore";
const db = getFirestore();

const MedicalHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserName(user.displayName);
    }
  }, []);
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const handlehistory = async (event) => {
    const q = query(
      collection(db, "Childrens"),
      where("id", "==", event.target.value)
    );
    const qs = await getDocs(q);
    qs.forEach(async (doc) => {
      if (doc.exists) {
        console.log(doc.data)
    }});
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
    
      <div>
        <div className="logout-container">
          <LogoutButton />
        </div>
        <h2>Medical History</h2>
        {/* Add content for the medical history page */}

        <div className="containerSearchBox">
          <input className='searchBarAdmin' type="text" placeholder="חפש לפי תעודת זהות" value={searchTerm} onChange={handleSearchChange} />
          <button className='AdminBtn1' type="button" value={searchTerm} onClick={handlehistory}>חפש</button>
        </div>

      </div>
    );
};
}
export default MedicalHistory;
