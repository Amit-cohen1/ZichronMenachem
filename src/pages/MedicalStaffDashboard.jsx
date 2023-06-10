import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../firebase';
import './MedicalStaffDashboard.css';
import Background from '../components/Background';
import { collection, query, where, getDocs } from 'firebase/firestore';
import LogoutButton from '../components/LogoutButton';
import UploadDocuments from './UploadDocuments';
import DoctorMeet from '../components/DoctorMeet';


const searchPatientById = async (patientId, setSearchResults, setInitialLoad) => {
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
    setInitialLoad(false);
  } catch (error) {
    console.error('Error searching for patient:', error);
  }
};

const MedicalStaffDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [userName, setUserName] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserName(user.displayName);
    }
  }, []);

  const handleSearch = () => {
    searchPatientById(searchQuery, setSearchResults, setInitialLoad);
  };

  return (
    <Background>
      <div>
          <LogoutButton />
        <h2 className="beautyHeadLine">שלום {userName}</h2>
        <div className='container-SearchBox'>
          <div className="search-Bar">
            <input
              className="searchBar"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="חיפוש מטופל לפי תעודת זהות"
            />
          </div>
          <button className='searchBarBtn' onClick={handleSearch}>חיפוש</button>
        </div>

        {/* Display search results */}
        {!initialLoad && searchResults.length === 0 && <h3 className='beautyHeadLine'>מטופל לא נמצא</h3>}
        {!initialLoad && searchResults.length > 0 && (
          <div className="results">
            <div className="Buttones">
               <UploadDocuments userId={searchResults[0].id} />
              <button className="searchBarBtn smaller-btn">היסטוריה רפואית</button>
              <DoctorMeet userName={userName} childID={searchResults[0].id}/>
            </div>

            <h3 className="beautyHeadLine">פרטי מטופל:</h3>
            {searchResults.map((patient) => (
              <div className="patient-details" key={patient.id}>
                <div className="patient-detail">
                  <span className="detail-label">תעודת זהות:</span>
                  <span className="detail-value">{patient.id}</span>
                </div>
                <div className="patient-detail">
                  <span className="detail-label">שם פרטי:</span>
                  <span className="detail-value">{patient.firstName}</span>
                </div>
                <div className="patient-detail">
                  <span className="detail-label">שם משפחה:</span>
                  <span className="detail-value">{patient.lastName}</span>
                </div>
                <div className="patient-detail">
                  <span className="detail-label">תאריך לידה:</span>
                  <span className="detail-value">{patient.birthDate}</span>
                </div>
                <div className="patient-detail">
                  <span className="detail-label">גיל:</span>
                  <span className="detail-value">{patient.age}</span>
                </div>
                <div className="patient-detail">
                  <span className="detail-label">מין:</span>
                  <span className="detail-value">{patient.gender}</span>
                </div>
                <div className="patient-detail">
                  <span className="detail-label">כתובת:</span>
                  <span className="detail-value">
                    {patient.street}, {patient.houseNum}, {patient.city}, {patient.postalCode}
                  </span>
                </div>
                <div className="patient-detail">
                  <span className="detail-label">מספר טלפון בית:</span>
                  <span className="detail-value">{patient.homePhoneNumber}</span>
                </div>
                <div className="patient-detail">
                  <span className="detail-label">מספר טלפון פרטי:</span>
                  <span className="detail-value">{patient.momPhoneNumber}</span>
                </div>
                <div className="patient-detail">
                  <span className="detail-label">מספר טלפון עבודה של האם:</span>
                  <span className="detail-value">{patient.momWorkPhone}</span>
                </div>
                <div className="patient-detail">
                  <span className="detail-label">מספר טלפון פרטי של האב:</span>
                  <span className="detail-value">{patient.dadPhoneNumber}</span>
                </div>
                <div className="patient-detail">
                  <span className="detail-label">מספר טלפון עבודה של האב:</span>
                  <span className="detail-value">{patient.dadWorkPhone}</span>
                </div>
                <div className="patient-detail">
                  <span className="detail-label">שם הרופא:</span>
                  <span className="detail-value">{patient.doctor}</span>
                </div>
                <div className="patient-detail">
                  <span className="detail-label">מספר טלפון הרופא:</span>
                  <span className="detail-value">{patient.docPhoneNumber}</span>
                </div>
                <div className="patient-detail">
                  <span className="detail-label">המדריך:</span>
                  <span className="detail-value">{patient.guide}</span>
                </div>
                <div className="patient-detail">
                  <span className="detail-label">סיום טיפול פעיל:</span>
                  <span className="detail-value">{patient.endActiveTreatment}</span>
                </div>
                <div className="patient-detail">
                  <span className="detail-label">המקום בבית החולים:</span>
                  <span className="detail-value">{patient.hospital}</span>
                </div>
                <div className="patient-detail">
                  <span className="detail-label">סוג הטיפול:</span>
                  <span className="detail-value">{patient.diagnosis}</span>
                </div>
                <div className="patient-detail">
                  <span className="detail-label">תרופות:</span>
                  <span className="detail-value">{patient.medicines}</span>
                </div>
                <div className="patient-detail">
                  <span className="detail-label">אלרגיות:</span>
                  <span className="detail-value">{patient.allergies}</span>
                </div>
                <div className="patient-detail">
                  <span className="detail-label">HMO:</span>
                  <span className="detail-value">{patient.hmo}</span>
                </div>
                <div className="patient-detail">
                  <span className="detail-label">הערות:</span>
                  <span className="detail-value">{patient.comments}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Background>
  );
};

export default MedicalStaffDashboard;
