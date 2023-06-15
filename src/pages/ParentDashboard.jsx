import React, { useState, useEffect, useRef } from 'react';
import { Link, Router, Routes, Route, useNavigate } from 'react-router-dom';
import { doc, onSnapshot, setDoc, addDoc, updateDoc, collection, query, where, getDocs, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import {auth} from '../firebase';
import Background from '../components/Background';
import '../pages/ParentDashboard.css'
import LogoutButton from '../components/LogoutButton';
import UploadDocuments from './UploadDocuments';
import DoctorMeet from '../components/DoctorMeet';




const checkChildId=false;



// component of the profile fields- gets the label (such as first name), its name
const ProfileField = ({ label, name, profileData, handleInputChange, isEditing, error }) => {
  return (
    <div className= "field-wrapper">
      <label className='label-parent'>
        {label}:
        <input
          className='input-parent'
          type="text"
          name={name}
          value={profileData[name]}
          onChange={(e) => handleInputChange(e, name)}
          disabled={!isEditing}
        />
      </label>
      {error && <div className="error-input-message">{error}</div>}
    </div>
  );
};

// component of the additional comments and medicines fields, using textarea
const TextAreaField = ({ label, name, profileData,handleInputChange, isEditing }) => {
  return (
    <label className='label-parent'>
      {label}:
      <textarea 
        name={name}
        value={profileData[name]}
        onChange={handleInputChange}
        disabled={!isEditing}
      />
    </label>
  );
};

  

const ParentDashboard = () => {

  const [userName, setUserName] = useState('');
  const [childID, setChildID] = useState('');

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserName(user.displayName);
      console.log("ID:"+user.displayName);
    }
  }, []);
  
 

  
  

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
<<<<<<< HEAD
 
      
 
=======

  // state to store validation errors
  const [errors, setErrors] = useState({});

  const validatePhoneNumber = (value) => /^\d{9,10}$/.test(value);

  //the fields validation
  const validationFunctions = {
      id: { 
        validate: (value) => value.length === 9,
        errorMessage: 'מספר תעודת הזהות לא תקין. הכנס מספר בעל 9 ספרות.',
      },
      momPhoneNumber: {
        validate: validatePhoneNumber,
        errorMessage: 'מספר הטלפון לא תקין. הכנס מספר בעל 9 או 10 ספרות.',
      },
      dadPhoneNumber: {
        validate: validatePhoneNumber,
        errorMessage: 'מספר הטלפון לא תקין. הכנס מספר בעל 9 או 10 ספרות.',
      },
      momWorkPhone: {
        validate: validatePhoneNumber,
        errorMessage: 'מספר הטלפון לא תקין. הכנס מספר בעל 9 או 10 ספרות.',
      },
      dadWorkPhone: {
        validate: validatePhoneNumber,
        errorMessage: 'מספר הטלפון לא תקין. הכנס מספר בעל 9 או 10 ספרות.',
      },
      homePhoneNumber: {
        validate: validatePhoneNumber,
        errorMessage: 'מספר הטלפון לא תקין. הכנס מספר בעל 9 או 10 ספרות.',
      },
      docPhoneNumber: {
        validate: validatePhoneNumber,
        errorMessage: 'מספר הטלפון לא תקין. הכנס מספר בעל 9 או 10 ספרות.',
      },
      email: { 
        validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        errorMessage: 'כתובת המייל שהכנסת אינה תקינה.',
      },
      birthDate: {
        validate: (value) => /^\d{1,2}[./-]\d{1,2}[./-]\d{2}(\d{2})?$/.test(value),//(value) => !isNaN(Date.parse(value)),
        errorMessage: 'התאריך שהכנסת אינו תקין.',
      },
      endActiveTreatment: {
        validate: (value) => /^\d{1,2}[./-]\d{1,2}[./-]\d{2}(\d{2})?$/.test(value),
        errorMessage: 'התאריך שהכנסת אינו תקין.',
      },
      postalCode: {
        validate: (value) => value.length === 7,
        errorMessage: 'המיקוד שהכנסת אינו תקין. הכנס מספר בעל 7 ספרות.',
      },
    };


>>>>>>> master
  // fetch patient data on component mount
  useEffect(() => {

    const fetchPatientData = async () => {
      try {
        const userQuery = query(collection(firestore, 'users'), where('email', '==', auth.currentUser.email));
        const userSnapshot = await getDocs(userQuery);
        console.log("flag1");
        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          const userData = userDoc.data();
          const childId= userData.childId;
          setChildID(childId);
          console.log(childID);
          if (childId) { // if it's not a new user and has a childId
            const childQuery = query(collection(firestore, 'Childrens'), where('id', '==', childId));
            onSnapshot(childQuery, (querySnapshot) => {
              querySnapshot.forEach((docSnapshot => {
                if (docSnapshot.exists()) {
                  setProfileData(docSnapshot.data());
                }
              })
              )
            });
          } 
        }else{
          
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    if (auth.currentUser) {
      fetchPatientData();
    }   
  }, []);


  // Handle click event for Edit button
  const handleEditClick = () => {
    setIsEditing(true);
  };
  
  // Handle click event for Save button
  const handleSaveClick = async () => {
    // perform validation for each field
    const newErrors = {};
    Object.entries(validationFunctions).forEach(([name, { validate, errorMessage }]) => {
      const value = profileData[name];
      const isValid = validate(value);
      if (!isValid && value) {
        newErrors[name] = errorMessage;
      }
    });
    
    //update the errors object
    setErrors(newErrors);
    
    // save the data if the form is valid
    if (Object.keys(newErrors).length === 0){
    try {
      const userQuery = query(collection(firestore, 'users'), where('email', '==', auth.currentUser.email));
      const userSnapshot = await getDocs(userQuery);
      if(!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        const userData = userDoc.data();
        if (userData.childId) { // if it's not a new user, save the changes
          const childQuery = query(collection(firestore, 'Childrens'), where('id', '==', userData.childId));
          const querySnapshot = await getDocs(childQuery);
          const childDocRef = querySnapshot.docs[0].ref;
          await updateDoc(childDocRef, profileData);
        } else { // new user, create a new doc in firestore and save changes
          const newChildDocRef = await addDoc(collection(firestore, 'Childrens'), profileData);
          const childSnapshot = await getDoc(newChildDocRef);
          //test
          console.log('child reference:', newChildDocRef);
          console.log('childData:', childSnapshot);
          //
          const idForUpdate= profileData.id;
          await updateDoc(userDoc.ref, { childId: idForUpdate });
          //test
          console.log('profile data:', profileData);
        }
        setIsEditing(false);
<<<<<<< HEAD
        
       
=======
        setErrors({});
>>>>>>> master
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
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

    
    // const [flag, setFlag] = useState(true);
    // const useCheckIfDataFull = () => {
    //   const [isDataFull, setIsDataFull] = useState(false);
    
    
    //   useEffect(() => {
    //     const fetchData = async () => {
    //       try {
    //         const userQuery = query(collection(firestore, 'users'), where('email', '==', auth.currentUser.email));
    //         const userSnapshot = await getDocs(userQuery);
    //         if (!userSnapshot.empty) {
    //           const userDoc = userSnapshot.docs[0];
    //           const userData = userDoc.data();
    //           const childId = userData.childId;
    //           console.log('User data:', userData);
    
    //           const isDataFull = !!childId && childId.length > 0;
    //           console.log('Is data full:', isDataFull);
    //           setIsDataFull(isDataFull);
    
    //           if (!isDataFull) {
    //             setFlag(false);
    //             console.log('Flag:', flag);
    //           }
    //         }
    //       } catch (error) {
    //         console.log('Error fetching data:', error);
    //       }
    //     };
    
    //     fetchData();
    //   }, []);
    
    //   return isDataFull;
    // };

    // useCheckIfDataFull();
    

    // const handleFlag = () => {
    //   if (!flag) {
    //     handleEditClick(); // Call handleFlag only if flag is false
    //   }
    // };

  // console.log("HERE:"+flag)
  return (
<<<<<<< HEAD
    <Background >
    <LogoutButton   />
      <h2 className='beautyHeadLine'>שלום {userName}</h2>
      <div className='patientDetails'>
      <div >  
      {isEditing  ? (
        
  <button className="searchBarBtn smaller-btn" type="button" onClick={handleSaveClick}>שמור</button>
) : (
  <button className="searchBarBtn smaller-btn" type="button" onClick={handleEditClick}>ערוך</button>
)}
      </div>
=======
    <Background>
    <div className='container-Parent'>
      <button className="logout-button" onClick={handleLogout}>התנתק</button> 
      <h2>Welcome, Parent!</h2>
>>>>>>> master
      <div>
        <h4 className='beautyHeadLine'>פרופיל ילד</h4>
        <form className='parent-form'>
          <div className="form-container">
            <div className="form-group">
            <div className="field-row">
<<<<<<< HEAD
            <ProfileField label="תעודת זהות" name="id" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing} />
=======
              <ProfileField label="תעודת זהות" name="id" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing} error={errors.id}/>
>>>>>>> master
              <ProfileField label="שם פרטי" name="firstName" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing} />
              <ProfileField label="שם משפחה" name="lastName" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing} />
              </div>
              <div className="field-row">
              <ProfileField label="תאריך לידה" name="birthDate" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing} error={errors.birthDate}/>
              <ProfileField label="תאריך לידה עברי" name="hebrewBirthDate" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
              <ProfileField label="גיל" name="age" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
              <ProfileField label="מין" name="gender" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          </div>
          </div>
          <div className="form-group">
          <div className="field-row">
            <ProfileField label="רופא מטפל" name="doctor" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
            <ProfileField label="טלפון רופא" name="docPhoneNumber" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing} error={errors.docPhoneNumber}/>
            </div>
            <div className="field-row">
            <ProfileField label="קופת חולים" name="hmo" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
            <ProfileField label="בית חולים" name="hospital" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
            </div>
          </div>
          <div className="form-group">
          <div className="field-row">
          <ProfileField label="שם האם" name="motherName" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="טלפון אם" name="momPhoneNumber" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing} error={errors.momPhoneNumber}/>
          <ProfileField label="טלפון עבודה אם" name="momWorkPhone" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing} error={errors.momWorkPhone}/>
          </div>
          <div className="field-row">
          <ProfileField label="שם האב" name="fatherName" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="טלפון אב" name="dadPhoneNumber" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing} error={errors.dadPhoneNumber}/>
          <ProfileField label="טלפון עבודה אב" name="dadWorkPhone" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing} error={errors.dadWorkPhone}/>
          </div>
          <div className="field-row">
          <ProfileField label="טלפון בבית" name="homePhoneNumber" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing} error={errors.homePhoneNumber}/>
          <ProfileField label="מייל" name="email" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing} error={errors.email}/>
          </div>
          </div>
          <div className="form-group">
          <div className="field-row">
          <ProfileField label="מדריך אחראי" name="guide" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="כרטיס" name="card" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          </div>
          </div>
          <div className="form-group">
          <div className="field-row">
          <ProfileField label="עיר" name="city" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="רחוב" name="street" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="מספר בית" name="houseNum" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="מיקוד" name="postalCode" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing} error={errors.postalCode}/>
          </div>
          </div>
          <div className="form-group">
          <div className="field-row">
          <ProfileField label="תאריך סיום טיפול אקטיבי" name="endActiveTreatment" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing} error={errors.endActiveTreatment}/>
          <ProfileField label="סוג אבחנה" name="diagnosis" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <ProfileField label="צנתר" name="catheter" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          </div>
          <div className="field-row">
          <ProfileField label="רגישויות" name="allergies" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          </div>
          </div>
          </div>
        </form>
      </div>

      <div>
        <form className="textArea-field">
          <TextAreaField label="תרופות" name="medicines" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
          <TextAreaField label="הערות נוספות" name="comments" profileData={profileData} handleInputChange={handleInputChange} isEditing={isEditing}/>
        </form>
      </div>
      <div className="Buttones-parent" >
      
  
    <UploadDocuments userId={"123"} />
    <button className="searchBarBtn smaller-btn">היסטוריה רפואית</button>
    <Link to = {"/camp-registration"}>
    <button className="searchBarBtn smaller-btn">הרשמה למחנה</button>
    </Link>
    
  
    </div>

    </div>
<<<<<<< HEAD
   </Background>
=======
    </Background>
>>>>>>> master
  );
};



export default ParentDashboard;
