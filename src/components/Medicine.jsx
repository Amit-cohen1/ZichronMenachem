import React, { useState } from 'react';
import AddMedicinePopup from './AddMedicinePopup';
import MedicinesChartPopup from './MedicinesChartPopup';
import './Medicine.css';

const Medicine = ({ childID }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedOption('');
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };
  

  return (
    <div>
      <button className="searchBarBtn smaller-btn" onClick={handleOpenPopup}>תרופות</button>

      {showPopup && (
        <div className="popupContainerMeds">
          <div className="popupContent">
            <button className='close-btn' onClick={handleClosePopup}>
             סגור
            </button>
            <h2>עמוד תרופות</h2>
            <button className='print-btn' onClick={() => handleOptionClick('הוסף תרופה')}>הוסף תרופה למטופל</button>
            <button className='print-btn' onClick={() => handleOptionClick('טבלת תרופות')}>טבלת תרופות</button>
            {selectedOption === 'הוסף תרופה' && (
              <AddMedicinePopup childID={childID} onClose={handleClosePopup} />
            )}
            {selectedOption === 'טבלת תרופות' && (
              <MedicinesChartPopup childID={childID} onClose={handleClosePopup} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Medicine;