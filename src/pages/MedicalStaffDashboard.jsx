import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../firebase';
import './MedicalStaffDashboard.css';
import Background from '../components/Background';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const searchPatientById = async (patientId, setSearchResults) => {
  try {
    const childRef = collection(firestore, 'Childrens');
    const querySnapshot = await getDocs(query(childRef, where('id', '==', patientId)));

    if (!querySnapshot.empty) {
      const patientData = querySnapshot.docs[0].data();
      console.log('Patient details:', patientData.id, 'Patient additional Data: ' + patientData.FirstName);
      setSearchResults([patientData]);
    } else {
      setSearchResults([]);
    }
  } catch (error) {
    console.error('Error searching for patient:', error);
  }
};

const handleLogout = () => {
  auth.signOut()
    .then(() => {
      console.log('User logged out successfully');
    })
    .catch((error) => {
      console.error('Error logging out:', error);
    });
};

const MedicalStaffDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserName(user.displayName);
    }
  }, []);

  const handleSearch = () => {
    searchPatientById(searchQuery, setSearchResults);
  };

  return (
    <Background>
      <div>
        <button className="logout-button" onClick={handleLogout}>התנתק</button>
        <h2 className="hello-doctor">שלום {userName}</h2>
        <div className='container-SearchBox'>
          <div className="search-Bar">
            <input
              className="searchBar"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="חיפוש מטופל לפי תעודת זהות"
            />
            <button className='searchBarBtn' onClick={handleSearch}>חיפוש</button>
          </div>
        </div>

        {/* Display search results */}
        {searchResults.length === 0 && <h3>Patient not found</h3>}
        {searchResults.length > 0 && (
          <div>
            <h3>Patient Details:</h3>
            {searchResults.map((patient) => (
              <div key={patient.id}>
                <p>{patient.id}</p>
                {/* Display other patient details */}
              </div>
            ))}
          </div>
        )}
      </div>
    </Background>
  );
};

export default MedicalStaffDashboard;
