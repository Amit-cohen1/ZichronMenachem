import React, { useState } from 'react';
import firebase from '../firebase';
import './MedicalStaffDashboard.css';
import Background from '../components/Background';
import 'firebase/firestore';

const searchPatientById = async (patientId) => {
  // try {
  //   const childrenRef = firebase.firestore().collection('children');
  //   const querySnapshot = await childrenRef.where('id', '==', patientId).get();

  //   if (!querySnapshot.empty) {
  //     // Patient found, handle the logic here (e.g., display patient details page)
  //     const patientData = querySnapshot.docs[0].data();
  //     console.log('Patient details:', patientData);
  //   } else {
  //     // Patient not found, handle the logic here (e.g., display an error message)
  //     console.log('Patient not found');
  //   }
  // } catch (error) {
  //   // Handle any errors that occur during the search
  //   console.error('Error searching for patient:', error);
  // }
};



const MedicalStaffDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleLogout = () => {
    // Implement your logout logic here
    // e.g., firebase.auth().signOut();
  };

  const handleSearch = () => {
    const patientId = 'ABC123';
    searchPatientById(patientId);
  };

  return (
    <Background>
    <div >
      <button className="logout-button" onClick={handleLogout}>התנתק</button>
      <h2 className="hello-doctor">שלום ישראל ישראלי</h2>
      <div className='container-SearchBox'>
      <button className='searchBarBtn' onClick={handleSearch}>חיפוש</button>
      <div >
      <input className="searchBar"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="חיפוש מטופל לפי תעודת זהות"
        />
      </div>
      </div>
      {/* Display search results here */}
    </div>
    </Background>
  );
};

export default MedicalStaffDashboard;