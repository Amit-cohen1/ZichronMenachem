import React, { useState } from 'react';
import { firestore } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import './DefineTrip.css';

const DefineTrip = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [date, setDate] = useState('');
  const [name, setName] = useState('');

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = async () => {
    if (date && name) {
      const futureDate = new Date(date) > new Date();

      if (futureDate) {
        const tripsCollectionRef = collection(firestore, 'Trips');

        const newTripRef = await addDoc(tripsCollectionRef,{
          DateOfTrip: date,
          NameOfTrip: name,
        });

        console.log("User details written to Firestore with ID:", newTripRef.id);
      } else {
        console.error('Invalid date. Please select a future date.');
        // Handle the error or display an error message
      }
    } else {
      console.error('Please fill in all the fields.');
      // Handle the error or display an error message
    }
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div>
      <button className="print-btn" onClick={togglePopup}>
        הגדר טיול חדש
      </button>
      {showPopup && (
        <div className="popupTrip">
          
          <div className="popup-contentTrip">
            <div className="popup-content textarea,">
              <input
              className='input-register'
                type="date"
                value={date}
                onChange={handleDateChange}
                placeholder="תאריך הטיול"
              />
              <input
              className='input-register'
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="שם הטיול"
              />
            </div>
            <button className="btnClose" onClick={handleSubmit}>
              צור טיול
            </button>
            <button className="btnClose" onClick={togglePopup}>
            סגור
          </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DefineTrip;
