import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { query, where, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase'; // Import your Firebase configuration

const AddMedicinePopup = ({ childID, onClose }) => {
  const [selectedMedicine, setSelectedMedicine] = useState('');
  const [selectedFrequency, setSelectedFrequency] = useState('');
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [medsOptions, setMedsOptions] = useState([]);

  const times = ['בוקר', 'צהריים', 'ערב'];

  useEffect(() => {
    fetchMedsOptions();
  }, []);

  const fetchMedsOptions = async () => {
    try {
      const medsSnapshot = await getDocs(collection(firestore, 'Medicines'));
      const medsData = medsSnapshot.docs.map((doc) => ({
        medID: doc.id,
        ...doc.data(),
      }));
      setMedsOptions(medsData);
    } catch (error) {
      console.error('Error fetching meds options:', error);
    }
  };

  const handleMedicineChange = (event) => {
    setSelectedMedicine(event.target.value);
  };

  const handleFrequencyChange = (event) => {
    setSelectedFrequency(event.target.value);
    setSelectedTimes(Array(Number(event.target.value)).fill([])); // Initiate times slots based on frequency
  };

  const handleTimeChange = (index, event) => {
    let newTimes = [...selectedTimes];
    newTimes[index] = Array.from(event.target.selectedOptions, (option) => option.value);
    setSelectedTimes(newTimes);
  };
  
  const handleAddMedicine = async () => {
    try {
      // Query the Childrens collection to find the Child document with the matching childID
      const childrensCollectionRef = collection(firestore, 'Childrens');
      const queryRef = query(childrensCollectionRef, where('id', '==', childID));
      const querySnapshot = await getDocs(queryRef);
  
      // Check if the Child document exists
      if (querySnapshot.empty) {
        console.log('Child document does not exist.');
        return;
      }
  
      const childDocRef = querySnapshot.docs[0].ref;
  
      // Check if MedicinesChart attribute exists, if not, create it
      const childDocSnapshot = await getDoc(childDocRef);
      if (!childDocSnapshot.exists()) {
        console.log('Child document does not exist.');
        return;
      }
  
      const childData = childDocSnapshot.data();
      if (!childData.MedicinesChart) {
        // Create MedicinesChart attribute with an empty array
        await updateDoc(childDocRef, {
          MedicinesChart: [],
        });
      }
  
      // Check if the medicine already exists in MedicinesChart
      const medicinesChart = childData.MedicinesChart;
      const medicineExists = medicinesChart.some(
        (medicine) => medicine.medicineName === selectedMedicine
      );
      if (medicineExists) {
        console.log('תרופה קיימת עבור מטופל');
        return;
      }
  
      // Create the new medicine object with days
      let newMedicine = {
        medicineName: selectedMedicine,
        days: {},
      };
  
      // Fill the days object based on the selected amount (frequency)
      for (let day = 1; day <= 15; day++) {
        newMedicine.days[`Day${day}`] = selectedTimes.map((time) => ({
          status: 'notGiven',
          time,
        }));
      }
  
      // Add the medicine to MedicinesChart array
      await updateDoc(childDocRef, {
        MedicinesChart: arrayUnion(newMedicine),
      });
  
      console.log('Medicine added successfully.');
  
      // Close the popup
      onClose();
    } catch (error) {
      console.error('Error adding medicine:', error);
    }
  };
  
  

  return (
    <div className="popupContainerAddMed">
      <div className="popupContentAddMed">
        <button className="close-btn" onClick={onClose}>
          סגור
        </button>
        <h2>הוספת תרופה</h2>
        <label htmlFor="medicine">תרופה:</label>
        <select id="medicine" value={selectedMedicine} onChange={handleMedicineChange}>
          <option value="">בחר תרופה</option>
          {medsOptions.map((medOption) => (
            <option key={medOption.medID} value={medOption.MedName}>
              {medOption.MedicineName}
            </option>
          ))}
        </select>
        <label htmlFor="frequency">כמה פעמים ביום:</label>
        <select id="frequency" value={selectedFrequency} onChange={handleFrequencyChange}>
          <option className="optionMed" value="">
            בחר תדירות
          </option>
          <option className="optionMed" value="1">
            פעם ביום
          </option>
          <option className="optionMed" value="2">
            פעמיים ביום
          </option>
          <option className="optionMed" value="3">
            3 פעמים ביום
          </option>
          {/* Add options for the frequency */}
        </select>
        {selectedTimes.map((_, i) => (
          <div key={i}>
            <label htmlFor={`time${i}`}>זמן {i + 1}:</label>
            <select id={`time${i}`} multiple={true} value={selectedTimes[i]} onChange={(e) => handleTimeChange(i, e)}>
              {times.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        ))}
        <button className="print-btn" onClick={handleAddMedicine}>
          הוסף
        </button>
      </div>
    </div>
  );
};

export default AddMedicinePopup;
