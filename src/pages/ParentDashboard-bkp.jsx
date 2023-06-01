/*import React from 'react'; */
/*import React, { useState, useEffect } from 'react';*/
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
//import { ref, onValue, off, set } from 'firebase/database';
//import { database } from '../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import Background from '../components/Background';

const ParentDashboard = () => {
  // Content and functionality for the parent dashboard


  //
  //fake data for trial
  //
  /*const [profileData, setProfileData] = useState({
    firstName: 'Israel',
    lastName: 'Israeli',
    id:'123456789',
    doctor: 'Dr. Israel Israeli',
    hmo: 'Clalit',
    motherName: 'Israela Israeli',
    fatherName: 'Israel Israeli',
    birthDate: '01-01-2000',
    guide: 'Madrich',
    gender: 'male',
    card: '123456',
    age: '5.5',
    momPhoneNumber: '123-456-7890',
    dadPhoneNumber: '123-456-7890',
    email: 'abcdefg@gmail.com',
    city: 'Jerusalem',
    street: 'street street',
    houseNum: '2',
    postalCode: '123456',
    hospital: 'ABC Hospital',
    endActiveTreatment: '01-01-2000',
    diagnosis: 'Some diagnosis',
    catheter: 'yes',
    docPhoneNumber: '123-456-7890',
    hebrewBirthDate: 'כה באייר',
    homePhoneNumber: '02-1234567',
    momWorkPhone: '02-1234567',
    dadWorkPhone: '02-1234567',
    allergies: 'Allergy 1, Allergy 2',
    medicines: 'Medicine 1, Medicine 2',
    comments: 'Some additional comments',
  });
  */

  //State for profile data and editing mode
  const[profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    id:'',
    doctor: '',
    hmo: '',
    motherName: '',
    fatherName: '',
    birthDate: '',
    guide: '',
    gender: '',
    card: '',
    age: '',
    momPhoneNumber: '',
    dadPhoneNumber: '',
    email: '',
    city: '',
    street: '',
    houseNum: '',
    postalCode: '',
    hospital: '',
    endActiveTreatment: '',
    diagnosis: '',
    catheter: '',
    docPhoneNumber: '',
    hebrewBirthDate: '',
    homePhoneNumber: '',
    momWorkPhone: '',
    dadWorkPhone: '',
    allergies: '',
    medicines: '',
    comments: '',
  })

  const [isEditing, setIsEditing] = useState(false);

  // fetch patient data on component mount
  /*useEffect(() => {
    const patientRef = ref(database, 'patients/123');

    const fetchPatientData = () => {
      //listen for changes in the patient data
      onValue(patientRef, (snapshot) => {
        const data = snapshot.val();
        setProfileData(data);
      });
    };

    fetchPatientData();

    return () => {
      // clean up the event listener when component unmounts
      off(patientRef);
    };

  }, []);*/

  // fetch patient data on component mount
  useEffect(() => {
    const fetchPatientData = () => {
      const patientDoc = doc(firestore, 'Childrens', 'pUitCjO9ClIFIRDVrA8G');
      onSnapshot(patientDoc, (docSnapshot) => {
        if (docSnapshot.exists()) {
          setProfileData(docSnapshot.data());
        }
      });
    };

    fetchPatientData();

    return () => {
      // clean up the snapshot listener
      const patientDoc = doc(firestore, 'Childrens', 'pUitCjO9ClIFIRDVrA8G');
      // unsubscribe the listener
      const unsubscribe = onSnapshot(patientDoc, () => {});
      unsubscribe();
    };
  }, []);


  // Handle click event for Edit button
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Handle clock event for Save button
  /*const handleSaveClick = () => {
    try {
      //save the updated profileData to the database
      const patientRef = ref(database, 'patients/123');
      //set(ref(database, 'patiennts/123'), profileData);
      set(patientRef, profileData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };*/

  const handleSaveClick = async () => {
    try {
      const patientDoc = doc(firestore, 'Childrens', 'pUitCjO9ClIFIRDVrA8G');
      await setDoc(patientDoc, profileData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };


  // Handle input change event
 /* const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };*/

  // Handle input change event
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log(`name: ${name}`)
    console.log(`value: ${value}`)

      setProfileData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };

  //const [focusedField, setFocusedField] = useState(null);

  // component of the profile fields- gets the label (such as first name) and its name
  const ProfileField = ({ label, name }) => {

    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = () => {
      setIsFocused(false);
    };

    return (
      <label>
        {label}:
        <input
          type="text"
          key={name}
          name={name}
          value={profileData[name]}
          // onChange={handleInputChange}
          onChange={(e) => handleInputChange(e, name)}
          //disabled={!isEditing} // set disabled to true when not in editing mode
          //disabled={!isEditing || !isFocused}
         // readOnly={!isEditing || !isFocused}
          readOnly={!isEditing}
          //onFocus={handleFocus}
          //onBlur={handleBlur}
          //onBlur={() => setFocusedField(null)}
          //style={{ background: isFocused ? 'yellow' : 'white'}}
        />
      </label>
    );
  };

  const TextAreaField = ({ label, name }) => {
    return (
      <label>
        {label}:
        <textarea
          name={name}
          key={name}
          value={profileData[name]}
          onChange={handleInputChange}
          //onChange={(e) => handleInputChange(e, name)}
          disabled={!isEditing}
        />
      </label>
    );
  };


  //const [profileData, setProfileData] = useState(null);
 // const [isEditing, setIsEditing] = useState(false);



// component for the option below the patient details. takes to other pages.
 const Square = ({ text, to }) => (
  <div>
    <h5>{text}</h5>
    <Link to={to}>
      <button>Click here</button>
    </Link>
  </div>
  );

  return (
    <Background>
    <div>
      <h2>Welcome, Parent!</h2>
      {/* Parent-specific content */}
      <div>
        <h4>פרופיל ילד</h4>
        <form>
          <ProfileField label="First Name" name="firstName" />
          <ProfileField label="Last Name" name="lastName" />
          <ProfileField label="ID" name="id" />
          <ProfileField label="Doctor" name="doctor" />
          <ProfileField label="Kupat Holim" name="hmo" />
          <ProfileField label="Mother's Name" name="motherName" />
          <ProfileField label="Father's Name" name="fatherName" />
          <ProfileField label="Date of Birth" name="birthDate" />
          <ProfileField label="Guide" name="guide" />
          <ProfileField label="Gender" name="gender" />
          <ProfileField label="Card" name="card" />
          <ProfileField label="Age" name="age" />
          <ProfileField label="Mother's Phone Number" name="momPhoneNumber" />
          <ProfileField label="Father's Phone Number" name="dadPhoneNumber" />
          <ProfileField label="Email" name="email" />
          <ProfileField label="City" name="city" />
          <ProfileField label="Street" name="street" />
          <ProfileField label="House's number" name="houseNum" />
          <ProfileField label="Postal Code" name="postalCode" />
          <ProfileField label="Hospital" name="hospital" />
          <ProfileField label="End Date of Active Treatment" name="endActiveTreatment" />
          <ProfileField label="Diagnosis" name="diagnosis" />
          <ProfileField label="Catheter" name="catheter" />
          <ProfileField label="Doctor's Phone Number" name="docPhoneNumber" />
          <ProfileField label="Hebrew Date of Birth" name="hebrewBirthDate" />
          <ProfileField label="Home Phone Number" name="homePhoneNumber" />
          <ProfileField label="Mother's Work Phone Number" name="momWorkPhone" />
          <ProfileField label="Father's Work Phone Number" name="dadWorkPhone" />
          <ProfileField label="Allergies" name="allergies" />
          {/*<label>
            Name:
            <input 
              type="text" 
              name="name"
              value={profileData.name} 
              onChange={handleInputChange}
              disabled={!isEditing} 
            />
          </label>
          <lable>
            ID:
            <input 
            type="text" 
            name="id"
            value={profileData.id} 
            onChange={handleInputChange}
            disabled={!isEditing} 
            />
          </lable>
          <lable>
            Doctor:
            <input 
            type="text" 
            name="doctor"
            value={profileData.doctor} 
            onChange={handleInputChange}
            disabled={!isEditing} 
            />
          </lable>
          <lable>
            Mother's Name:
            <input 
            type="text" 
            name="motherName"
            value={profileData.motherName} 
            onChange={handleInputChange}
            disabled={!isEditing} 
            />
          </lable>
          <lable>
            Father's Name:
            <input 
            type="text" 
            name="fatherName"
            value={profileData.fatherName} 
            onChange={handleInputChange}
            disabled={!isEditing} 
            />
          </lable>
          <lable>
            Date of Birth:
            <input 
            type="text" 
            name="birthDate"
            value={profileData.birthDate} 
            onChange={handleInputChange}
            disabled={!isEditing} 
            />
          </lable>
          <lable>
            Phone Number:
            <input 
            type="text" 
            name="phoneNumber"
            value={profileData.phoneNumber} 
            onChange={handleInputChange}
            disabled={!isEditing} 
            />
          </lable>
          <lable>
            Hospital:
            <input 
            type="text" 
            name="hospital"
            value={profileData.hospital} 
            onChange={handleInputChange}
            disabled={!isEditing} 
            />
          </lable>
          <lable>
            Diagnosis:
            <input 
            type="text" 
            name="diagnosis"
            value={profileData.diagnosis} 
            onChange={handleInputChange}
            disabled={!isEditing} 
            />
          </lable>
          <lable>
            Allergies:
            <input 
            type="text" 
            name="allergies"
            value={profileData.allergies} 
            onChange={handleInputChange}
            disabled={!isEditing} 
            />
          </lable>*/}

        </form>
      </div>

      <div>
        <form>
          <TextAreaField label="Medicines" name="medicines" />
          <TextAreaField label="Additional Comments" name="comments" />
          {/*<label>
            Medicines:
            <textarea 
            name="medicines"
            value={profileData.medicines} 
            onChange={handleInputChange}
            disabled={!isEditing} 
            />
          </label>
          <label>
            Additional Comments:
            <textarea 
            name="comments"
            value={profileData.comments} 
            onChange={handleInputChange}
            disabled={!isEditing} 
            />
          </label>*/}
        </form>
      </div>

     {/* <div>
        <button type="button" onClick={isEditing ? handleSaveClick : handleEditClick}>
          {isEditing? 'Save' : 'Edit'}
        </button>
        </div> */}
      <div>
      {isEditing ? (
      <button type="button" onClick={handleSaveClick}> Save </button>
      ) : (
      <button type="button" onClick={handleEditClick}> Edit </button>
      )}
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {/*<div>
            <h5>Medical History</h5>
            <Link to="/medical-history">
              <button>Click here</button>
            </Link>
          </div>
          <div>
            <h5>Camp Registration Form</h5>
            <Link to="/camp-registration">
              <button>Click here</button>
            </Link>
          </div>
          <div>
            <h5>Uploading Documents</h5>
            <Link to="/upload-documents">
              <button>Click here</button>
            </Link>
          </div>*/}
      
          <Square text="Medical History" to="/medical-history" />
          <Square text="Camp Registration Form" to="/camp-registration" />
          <Square text="Uploading Documents" to="/upload-documents" />
        </div>
      </div>

    </div>
    </Background>
  );
};



export default ParentDashboard;
