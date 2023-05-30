import React, { useState } from 'react';
import { auth, firestore } from '../firebase';
import './MedicalStaffDashboard.css';
import Background from '../components/Background';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import LogoutAction from '../components/LogoutAction';

const searchPatientById = async (patientId, setSearchResults) => {
  try {
    const childRef = collection(firestore, 'Childrens'); // Use 'collection' method
    const querySnapshot = await getDocs(query(childRef, where('id', '==', patientId))); // Use 'query' and 'getDocs' methods

    if (!querySnapshot.empty) {
      // Patient found, handle the logic here (e.g., display patient details page)
      const patientData = querySnapshot.docs[0].data();
      console.log('Patient details:', patientData.id, 'Patient additional Data: '+ patientData.FirstName);
      // Update searchResults state with the found patient
      setSearchResults([patientData]);
    } else {
      // Patient not found, handle the logic here (e.g., display an error message)
      console.log('Patient not found');
      // Clear searchResults state
      setSearchResults([]);
    }
  } catch (error) {
    // Handle any errors that occur during the search
    console.error('Error searching for patient:', error);
  }
};

const handleLogout = () => {
 <LogoutAction />
};

const MedicalStaffDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

 
  const handleSearch = () => {
    // Trigger searchPatientById with the searchQuery and setSearchResults
    searchPatientById(searchQuery, setSearchResults);
  };

  return (
    <Background>
      <div>
        <button className="logout-button" onClick={handleLogout}>התנתק</button>
        <h2 className="hello-doctor">שלום ישראל ישראלי</h2>
        <div className='container-SearchBox'>
          <button className='searchBarBtn' onClick={handleSearch}>חיפוש</button>
          <div>
            <input
              className="searchBar"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="חיפוש מטופל לפי תעודת זהות"
            />
          </div>
        </div>
        {/* Display search results here */}
        <div>
          {searchResults.map((patient) => (
            <div key={patient.id}>
              {/* Display patient details */}
              <p>{patient.id} {patient.FirstName}</p>
            </div>
          ))}
        </div>
      </div>
    </Background>
  );
};

export default MedicalStaffDashboard;
