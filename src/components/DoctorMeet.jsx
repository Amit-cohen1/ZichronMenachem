import React, { useState, useEffect } from 'react';
import { doc, setDoc, collection, onSnapshot, addDoc, getDoc, getFirestore, query, where } from 'firebase/firestore';
import { app } from '../firebase';
import './DoctorMeet.css';

const firestore = getFirestore(app);

const DoctorMeet = ({ userName, childID }) => {
  const [summary, setSummary] = useState('');
  const [prescription, setPrescription] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [childData, setChildData] = useState(null);
  const [locationToGo, setLocationToGo] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  
  useEffect(() => {
    const currentDate = new Date();
    setAppointmentDate(currentDate.toLocaleString('en-US'));
  }, []);

  useEffect(() => {
    const childRef = collection(firestore, 'Childrens');
    const queryRef = query(childRef, where('id', '==', childID.toString()));

    const unsubscribe = onSnapshot(queryRef, (snapshot) => {
      if (!snapshot.empty) {
        const locationToGo = snapshot.docs[0].id;
        const childData = snapshot.docs[0].data();
        setChildData(childData);
        setLocationToGo(locationToGo);
        console.log('Child Data:', childData);
      } else {
        console.log('Child document does not exist.');
      }
    });

    return () => unsubscribe();
  }, [childID]);

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Create a new document
    const newDocRef = await addDoc(collection(firestore, 'DoctorMeet'), {
      childID: childID,
      summary: summary,
      prescription: prescription,
      appointmentDate: appointmentDate,
    });
  
    console.log('New document created with ID:', newDocRef.id);
  
    // Update existing document
    const childRef = doc(firestore, 'Childrens', locationToGo);
    const childDoc = await getDoc(childRef);
    const existingMedicines = childDoc.data().medicines || [];
    const updatedMedicines = [...existingMedicines, prescription];
    const updatedData = {
      medicines: updatedMedicines,
    };
  
    try {
      await setDoc(childRef, updatedData, { merge: true });
      console.log('Document successfully updated!');
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  
    setSummary('');
    setPrescription('');
    setShowPopup(false);
  };
  

  return (
    <div className="doctor-meet-container">
      <div className="update-form">
        <button className="searchBarBtn smaller-btn" onClick={handleOpenPopup}>
          פגישת רופא
        </button>
        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <h3 className='to-center'>פגישת רופא</h3>
              <div className="patient-DoctorMeet">
                שם הרופא: {userName} <br />
                תעודת זהות ילד: {childData?.id} <br />
                תאריך פגישה: {appointmentDate} <br />
                </div>
              <form onSubmit={handleSubmit}>
                <div className='popup-content textarea,'>
                  <label htmlFor="summary">סיכום:</label>
                  <textarea
                    id="summary"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    required
                  />
                </div>
                <div className='popup-content textarea,'>
                  <label htmlFor="prescription">תרופות:</label>
                  <textarea
                    id="prescription"
                    value={prescription}
                    onChange={(e) => setPrescription(e.target.value)}
                    required
                  />
                </div>
                <div className="popup-buttons">
                  <button className='print-btn' type="submit">עדכן</button>
                  <button className='print-btn' type="button" onClick={handleClosePopup}>
                   ביטול
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorMeet;
