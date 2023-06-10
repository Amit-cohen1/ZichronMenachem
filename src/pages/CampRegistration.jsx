import React, { useState, createContext, useContext, setFormData } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestore } from '../firebase';
import { doc, addDoc, collection } from 'firebase/firestore';
import Background from '../components/Background';
import './CampRegistration.css';


// the component renders a 'back' button- nevigated the user back to the parent dashboard page
// gets how many pages to go back
const BackToDashboardButton = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/");    
    };

    return (
        <button onClick={handleClick}>
            חזור לעמוד הבית
        </button>
    );
  };


// create a context to manage the form data
const FormDataContext = createContext();


// The component of Camp Registration form
const CampRegistration = () => {
    const [step, setStep] = useState(1);

    // define the state to store the form data
    const [formData, setFormData] = useState({});

    // handling moving to the next page of the form, and saving the filled fields
    const handleNext= (data) => {
        setFormData((prevData) =>({
            ...prevData,
            ...data,
        }));
        setStep(step + 1);
    };

    // handling moving to the previous page of the form, and saving the filled fields
    const handleBack = (data) => {
        setFormData((prevData) =>({
            ...prevData,
            ...data,
        }));
        setStep(step - 1);
    };

  
    return (
    /*<Background>*/
        <div>
            <h2>טופס רישום למחנה</h2>
            <FormDataContext.Provider value={{ formData }}> {/* provides the form data context to the components */}   
                {step === 1 && <PersonalDetails onNext={handleNext} />}
                {step === 2 && <MedicalDetails onBack={handleBack} onNext={handleNext} />}
                {step === 3 && <ConsentPage onBack={handleBack} onSubmit={handleNext} />}
                {step === 4 && <SuccessSubmitPage />}
            </FormDataContext.Provider>
        </div>
    /*</Background>*/
    );
};

// Personal details page
const PersonalDetails = ({ onNext }) => {
    const {formData } = useContext(FormDataContext);
    const [personalDetails, setPersonalDetails] = useState(formData.personalDetails || {});
    

    const handleFieldChange = (fieldName, value) => {
        setPersonalDetails((prevDetails) => ({
            ...prevDetails,
            [fieldName]: value,
        }));
    };

    const handleNext = (e) => {
        e.preventDefault();

        onNext({ personalDetails });
    };
    
    // personal details fields
    const personalDetailsFields = [
        [
            { label: 'שם משפחה', name: 'lastName' },
            { label: 'שם פרטי', name: 'firstName' },
            { label: 'תאריך לידה', name: 'dateOfBirth'},
            { label: 'מין', name: 'gender' },
            { label: 'תעודת זהות', name: 'id' },
        ],
        [
            { label: 'טלפון בבית', name: 'homePhoneNumber' },
            { label: 'פקס', name: 'fax' },
            { label: 'טלפון נייד ילד/ה', name: 'childPhoneNumber' },
            { label: 'דואר אלקטרוני', name: 'email' },
        ],
        [
            { label: 'רחוב', name: 'street' },
            { label: 'מספר בית', name: 'houseNumber' },
            { label: 'כניסה', name: 'entranceNumber' },
            { label: 'קומה', name: 'floor' },
            { label: 'דירה', name: 'apartment' },
            { label: 'שכונה', name: 'neighborhood' },
            { label: 'עיר', name: 'city' },
            { label: 'מיקוד', name: 'postalCode' },
            { label: 'ת.ד.', name: 'mailbox' },
        ],
        [
            {label: 'שם האב', name: 'fatherName'},
            {label: 'מקום עבודה', name: 'fatherWorkPlace'},
            {label: 'טלפון בעבודה', name: 'fatherWorkPhoneNumber'},
            {label: 'טלפון נייד', name: 'fatherPhoneNumber'},
        ],
        [
            {label: 'שם האם', name: 'motherName'},
            {label: 'מקום עבודה', name: 'motherWorkPlace'},
            {label: 'טלפון בעבודה', name: 'motherWorkPhoneNumber'},
            {label: 'טלפון נייד', name: 'motherPhoneNumber'},
        ],

      ];
  
    return (
      <form className="camp-reg-form">
        <h4>פרטים אישיים</h4>
        <div className="field-group">
            {personalDetailsFields.map((fieldGroup, index) => (
                <div key={index} className="field-group-inner">
                    {fieldGroup.map((field) => (
                        <CustomField
                            key={field.name}
                            label={field.label}
                            value={personalDetails[field.name] || ''}
                            onChange={(value) => handleFieldChange(field.name, value)}
                            hasOptions={field.hasOptions}
                            hasDate={field.hasDate}
                            dateLabel={field.dateLabel}
                        />
                    ))}
                </div>
            ))}
        </div>
        <button type="button" onClick={handleNext}>
                המשך
        </button>
        <BackToDashboardButton />

      </form>
    );
  };

// Medical details page
const MedicalDetails = ({ onBack, onNext }) => {
    const { formData } = useContext(FormDataContext);
    const [medicalDetails, setMedicalDetails] = useState(formData.medicalDetails || {});
  
    const [dateValue, setDateValue] = useState('');

    const handleFieldChange = (fieldName, value) => {
      setMedicalDetails((prevDetails) => ({
        ...prevDetails,
        [fieldName]: value,
      }));
    };

    const handleDateChange = (fieldName, newDateValue) => {
       // const newDateValue = event.target.value;
        //setDateValue(newDateValue);
        setMedicalDetails((prevDetails) => ({
            ...prevDetails,
            [fieldName]: newDateValue,
        }));
      };
  
    const handleNext = (e) => {
      e.preventDefault();
  
      onNext({medicalDetails});
    };

    const handleBack = (e) => {
        e.preventDefault();
    
        onBack({medicalDetails});
      };
  
    
    const fieldGroups = [
        [
            { label: 'מטופל בבית החולים', name: 'hospitalPatient' },
            { label: 'רופא מטפל', name: 'attendingDoctor' },
            { label: 'טלפון', name: 'doctorPhoneNumber' },
            { label: 'קופת חולים', name: 'hmo' },
        ],
        [
            { label: 'אבחנה', name: 'diagnosis'},
            { label: 'בתאריך', name: 'diagnosisDate', hasDate: true },
            { label: 'מיקום הגידול', name: 'locationOfTumor' },
        ],
        [
            { label: 'היקמן/ פיק ליין/ פורטקט', name: 'hickmanPiccLinePortacath',hasOptions: true },
            { label: 'זקוק לשטיפה', name: 'washing', hasOptions: true },
        ],
        [
            { label: 'מטופל בטיפול אקטיבי בכימותרפיה', name: 'chimoTherapy', hasOptions: true },
            { label: 'עד תאריך', name: 'chimoTherapyDate', hasDate: true},
            { label: 'מטופל בטיפול ביולוגי', name: 'biologicalTherapy',hasOptions: true }, 
            { label: 'עד תאריך', name: 'biologicalTherapyDate', hasDate: true },
            { label: 'שם התרופה', name: 'biologicalMedicine' },
        ],
        [
            { label: 'טיפול אחזקתי', name: 'maintenanceTherapy', hasOptions: true }, 
            { label: 'עד תאריך', name: 'maintenanceTherapyDate', hasDate: true },
            { label: 'מטופל בהקרנות', name: 'radiation', hasOptions: true }, 
            { label: 'בתאריך', name: 'radiationDate', hasDate: true },
            { label: 'השתלת מח עצם', name: 'boneMarrow', hasOptions: true },
            { label: 'השתחרר בתאריך', name:'boneMarrowDate', hasDate: true },
        ],
        [
            { label: 'כיסא גלגלים', name: 'wheelChair', hasOptions: true },
            { label: 'קביים', name: 'crutches', hasOptions: true },
            { label: 'אחר', name: 'otherMovementRestriction' },
        ],
        [
            { label: 'הגבלות אוכל ושתיה', name: 'foodDrinkRestriction' },
            { label: 'בעיות בשינה', name: 'sleepProblems' },
            { label: 'בעיות נפשיות', name: 'mentalIssues' },
            { label: 'הגבלות אחרות', name: 'otherRestirctions' },
        ],
        [
            { label: 'זקוק לטיפולים/ בדיקות בזמן המחנה', name: 'tratmentInCamp', hasOptions: true},
            { label: 'פרט', name: 'extandTreatmentInCamp' },
        ],
        [
            { label: 'חלה בעבר באבעבועות רוח', name: 'hadChickenpox', hasOptions: true },
            { label: 'קיבל חיסון לאבעבועות רוח', name: 'chickenpoxVaccine', hasOptions: true },
        ],
        [
            { label: 'סיום טיפולים אקטיביים בתאריך', name: 'endActiveTreatments', hasDate: true },
            { label: 'סיום טיפול כימותרפי אחזקתי בתאריך', name: 'endMaintenanceChimoTreatment', hasDate: true},
        ],

    ];
  
    return (
        <form className="camp-reg-form">
            <h4>פרטים רפואיים</h4>
            <div className="field-group">
                {fieldGroups.map((fieldGroup, index) => (
                    <div key={index} className="field-group-inner">
                        {fieldGroup.map((field) => (
                            <CustomField
                            key={field.name}
                            label={field.label}
                            value={medicalDetails[field.name] || ''}
                            onChange={(value) => handleFieldChange(field.name, value)}
                            hasOptions={field.hasOptions}
                            hasDate={field.hasDate}
                            dateLabel={field.dateLabel}
                            dateValue={field.dateValue}
                            handleDateChange={handleDateChange}
                            />
                        ))}
                        </div>
                ))}
            </div>

           <button type= "button" onClick={handleBack}>
                חזור
           </button>
            <button type="button" onClick={handleNext}>
                המשך
            </button>
            <BackToDashboardButton />

    </form>
      );
};

const ConsentPage = ({ onBack, onSubmit }) => {
    const { formData } = useContext(FormDataContext);
    const [filledDate, setFilledDate] = useState('');
    //const [consentChecked, setConsentChecked] = useState(false);
    const [consentChecked, setConsentChecked] = useState(formData.consentChecked || false);
    const [details, setDetails] = useState(formData.details || {});
    const [submitted, setSubmitted] = useState(false);

    const handleCheckedboxChange = (e) => {
        setConsentChecked(e.target.checked);
    };

    const handleFilledDate = (e) => {
        setFilledDate(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (consentChecked) {
            try {
                onSubmit({ details, consentChecked, filledDate });
                // save form data in formData context
                const updatedFormData = { ...formData, details, consentChecked, filledDate };
                console.log("filled date:", filledDate);
                console.log("the data:", updatedFormData);
                //setFormData(updatedFormData);

                // save form data in firestore
                const newFormRef = await addDoc(collection(firestore, 'CampRegistration'), { updatedFormData });
                console.log('Document wriiten with ID: ', newFormRef.id);
                setSubmitted(true);
            } catch (error) {
                console.error('Errot adding document: ', error);
            }
        } else {
            // show an error message or handle invalid form state
            alert("לא ניתן לשלוח את הטופס ללא אישור הסכמתך.");
        }
    };

    const handleBack = (e) => {
        e.preventDefault();

        onBack({ details, consentChecked, filledDate });
    }

    const handleFieldChange = (fieldName, value) => {
        if (fieldName === 'consentChecked'){
            setConsentChecked(value);
        }
        if (fieldName === 'filledDate'){
            setFilledDate(value);
        } else {
            setDetails((prevDetails) => ({
                ...prevDetails,
                [fieldName]: value,
            }));
        }
    };
    
    const fieldGroups = [
        [
            { label: 'מידת חולצה', name: 'shirtSize' },
        ],
        [
            { label: 'ברשותי חולצה של זכרון מנחם (בצבע ירוק)', name: 'ownShirt', hasOptions: true},
            { label: 'כמות', name: 'amount' },
        ],
        [
            { label: 'סווטשירט', name: 'sweatshirt', hasOptions: true},
        ],
        
    ];
    
    return (
        <div>
            {submitted ? (
            <SuccessSubmitPage />
            ) : (
            <form className="camp-reg-form" onSubmit = {handleSubmit}>
                <div className="field-group">
                    {fieldGroups.map((fieldGroup, index) => (
                    <div key={index} className="field-group-inner">
                        {fieldGroup.map((field) => (
                        <CustomField
                            key={field.name}
                            label={field.label}
                            value={details[field.name] || ''}
                            onChange={(value) => handleFieldChange(field.name, value)}
                            hasOptions={field.hasOptions}
                            hasDate={field.hasDate}
                            dateLabel={field.dateLabel}  
                        />
                    ))}
                    </div>
                    ))}
                </div>
                <br />
                <p>
                    לאחר המחנה ישלח אליכם סרט המתעד את המחנה. אנו מאשרים שימוש בתצלומים וסרטים של הילד לצרכי הסברה.
                </p>
                <p>
                    ידוע לנו כי מדובר בילד עם רקע רפואי חריג, ובזאת הננו מאשרים את הסכמתנו להשתתפות בננו/בתנו במחנה. אין לנו ולא תהיינה לנו כל תביעות בגין כל נזק העלול להגרם לבננו/בתנו במחנה. 
                    בחתימתנו אנו גם מאשרים כי יידענו אתכם במצבו הרפואי המעודכן, וכי הילד נוסע בידיעת הרופא המטפל ובאישורו וע"כ חלה סודיות רפואית. 
                    אנו מאשרים לכם או לב"כ לתת טיפול רפואי נדרש לפי שיקול דעת של הצוות הרפואי הנלווה למחנה, ומקבלים על עצמנו אחריות שלוחית וכספית לכל טיפול שיידרש. 
                    אנו מאשרים להעביר פרטים שלו לצוותים הרפואיים שיצטרכו לטפל בו.
                </p>
                <label>
                    <input 
                    type="checkbox"
                    checked={consentChecked}
                    onChange={handleCheckedboxChange}
                    />
                    אנו מאשרים.
                </label>
                <br />
                <br />
                <label>
                    תאריך:
                    <input type="date" value={filledDate} onChange={handleFilledDate} /> {/*onChange={(e) => setFilledDate(e.target.value)} />*/}
                </label>
                <br />
                <br />
                <button type= "button" onClick={handleBack}>
                    חזור
                </button>
                <button type="submit" onClick={handleSubmit}>שלח</button>
                <BackToDashboardButton />
            </form>
            )}
        </div>
    );
};


// a reusable component for rendering input fields  
const CustomField = ({ label, value, onChange, hasOptions, hasDate }) => {
    const handleChange = (e) => {
      onChange(e.target.value);
    };

    return (
        <div className='custom-field'>
            {hasOptions ? (
            <label>
                {label}:
                    <select value={value} onChange={handleChange}>
                        <option value=""></option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
            </label>
            ) : hasDate ? (
            <label>
                {label}:
                    <input type="date" value={value} onChange={handleChange} />
            </label>
            ) : (
            <label>
                {label}:
                    <input type="text" value={value} onChange={handleChange} />
            </label>
            )}
        </div>
    );
  };

const SuccessSubmitPage = () => {
    return (
        <div>
            <h1>טופס ההרשמה נשלח בהצלחה!</h1>
            <BackToDashboardButton />
        </div>
        
    );
};



export default CampRegistration;