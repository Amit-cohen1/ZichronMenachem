/*import React from 'react'; */
/*import React, { useState, useEffect } from 'react';*/
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
//import { ref, onValue, off, set } from 'firebase/database';
//import { database } from '../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import Background from '../components/Background';

// component of the profile fields- gets the label (such as first name), its name
 const ProfileField = ({ label, name, profileData, handleInputChange, isEditing }) => {

    return (
      <label>
        {label}:
        <input
          type="text"
          //key={name}
          name={name}
          value={profileData[name]}
          onChange={(e) => handleInputChange(e, name)}
          disabled={!isEditing}
        />
      </label>
    );
  };

  const TextAreaField = ({ label, name, profileData,handleInputChange, isEditing }) => {
    return (
      <label>
        {label}:
        <textarea
          name={name}
          //key={name}
          value={profileData[name]}
          onChange={handleInputChange}
          disabled={!isEditing}
        />
      </label>
    );
  };


const ParentDashboard = () => {
  // Content and functionality for the parent dashboard

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


  // Handle click event for Save button
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
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log(`name: ${name}`)
    console.log(`value: ${value}`)

      setProfileData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };



// component for the options below the patient details. takes to other pages.
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
          <ProfileField label="First Name" name="firstName" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing} />
          <ProfileField label="Last Name" name="lastName" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing} />
          <ProfileField label="ID" name="id" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Doctor" name="doctor" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Kupat Holim" name="hmo" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Mother's Name" name="motherName" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Father's Name" name="fatherName" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Date of Birth" name="birthDate" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Guide" name="guide" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Gender" name="gender" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Card" name="card" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Age" name="age" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Mother's Phone Number" name="momPhoneNumber" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Father's Phone Number" name="dadPhoneNumber" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Email" name="email" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="City" name="city" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Street" name="street" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="House's number" name="houseNum" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Postal Code" name="postalCode" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Hospital" name="hospital" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="End Date of Active Treatment" name="endActiveTreatment" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Diagnosis" name="diagnosis" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Catheter" name="catheter" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Doctor's Phone Number" name="docPhoneNumber" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Hebrew Date of Birth" name="hebrewBirthDate" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Home Phone Number" name="homePhoneNumber" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Mother's Work Phone Number" name="momWorkPhone" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Father's Work Phone Number" name="dadWorkPhone" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="Allergies" name="allergies" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>

        </form>
      </div>

      <div>
        <form>
          <TextAreaField label="Medicines" name="medicines" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <TextAreaField label="Additional Comments" name="comments" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
        </form>
      </div>

      <div>
      {isEditing ? (
      <button type="button" onClick={handleSaveClick}> Save </button>
      ) : (
      <button type="button" onClick={handleEditClick}> Edit </button>
      )}
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>   
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
