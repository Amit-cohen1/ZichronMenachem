import React, { useState, createContext, useContext } from 'react';
import { Link } from 'react-router-dom';
import Background from '../components/Background';
import './CampRegistration.css';

// create a context to manage the form data
const FormDataContext = createContext();

const CampRegistration = () => {
    const [step, setStep] = useState(1);

    // define the state to store the form data
    const [formData, setFormData] = useState({});

    const handleNext= (data) => {
        setFormData((prevData) =>({
            ...prevData,
            ...data,
        }));
        setStep(step + 1);
    };

    const handleBack = (data) => {
        setFormData((prevData) =>({
            ...prevData,
            ...data,
        }));
        setStep(step - 1);
    };

  
    return (
    <Background>
        <div>
            <h2> Camp Registration Page</h2>
            <FormDataContext.Provider value={{ formData }}> {/* provides the form data context to the components */}   
                {step === 1 && <PersonalDetails onNext={handleNext} />}
                {step === 2 && <MedicalDetails onBack={handleBack} onNext={handleNext} />}
                {step === 3 && <ConsentPage onBack={handleBack} onSubmit={handleNext} />}
            </FormDataContext.Provider>
        </div>
    </Background>
    );
};


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
        // ....

        onNext({ personalDetails });
    };
    

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
      <form>
        <h2>Personal Details</h2>
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
                Continue
            </button>
      </form>
    );
  };


const MedicalDetails = ({ onBack, onNext }) => {
    const { formData } = useContext(FormDataContext);
    const [medicalDetails, setMedicalDetails] = useState(formData.medicalDetails || {});
  
    const handleFieldChange = (fieldName, value) => {
      setMedicalDetails((prevDetails) => ({
        ...prevDetails,
        [fieldName]: value,
      }));
    };
  
    const handleNext = (e) => {
      e.preventDefault();
      // Perform validation if needed- save in firestore?
  
      onNext({medicalDetails});
    };

    const handleBack = (e) => {
        e.preventDefault();
        // Perform validation if needed
    
        onBack({medicalDetails});
      };
  
    
    const fieldGroups = [
        [
            { label: 'מטופל בבית החולים', name: 'hospitalPatient' },
            { label: 'רופא מטפל', name: 'attendingDoctor' },
            { label: 'טלפון', name: 'doctorPhoneNumber' },
            { label: 'קופת חולים', name: 'hmo' },
        ],
      /*{ label: 'אבחנה:', name: 'diagnosis' },
      { label: ':בתאריך', name: 'diagnosisDate' },*/
        [
            { label: 'אבחנה', name: 'diagnosis', hasDate: true, dateLabel:'בתאריך' },
            { label: 'מיקום הגידול', name: 'locationOfTumor' },
        ],
        [
            { label: 'היקמן/ פיק ליין/ פורטקט', name: 'hickmanPiccLinePortacath',hasOptions: true},
            { label: 'זקוק לשטיפה', name: 'washing', hasOptions: true },
        ],
        [
            { label: 'מטופל בטיפול אקטיבי בכימותרפיה', name: 'chimoTherapy', hasOptions: true, hasDate: true, dateLabel: 'עד תאריך' },
            { label: 'מטופל בטיפול ביולוגי', name: 'biologicalTherapy',hasOptions: true, hasDate: true, dateLabel: 'עד תאריך' },
            { label: 'שם התרופה', name: 'bioMedicine' },
        ],
        [
            { label: 'טיפול אחזקתי', name: 'maintenanceTherapy', hasDate: true, dateLabel: 'עד תאריך' },
            { label: 'מטופל בהקרנות', name: 'radiation', hasDate: true, dateLabel: 'בתאריך' },
            { label: 'השתלת מח עצם', name: 'boneMarrow', hasDate: true, dateLabel: 'השתחרר בתאריך' },
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
            { label: 'סיום טיפולים אקטיביים', name: 'endActiveTreatments', hasDate: true, dateLabel: 'בתאריך' },
            { label: 'סיום טיפול כימותרפי אחזקתי', name: 'endMaintenanceChimoTreatment', hasDate: true, dateLabel: 'בתאריך' },
        ],

    ];
  
    return (
        <form>
            <h2>Medical Details</h2>
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
                            />
                        ))}
                        </div>
                ))}
            </div>

 

        {/*<button type="submit">Submit</button>*/}
           {/*} <BackButton />*/}
           <button type= "button" onClick={handleBack}>
                Back
           </button>
            <button type="button" onClick={handleNext}>
                Continue
            </button>
    </form>
      );
};

const ConsentPage = ({ onBack, onSubmit }) => {
    const { formData } = useContext(FormDataContext);
    const [filledDate, setFilledDate] = useState('');
    //const [consentChecked, setConsentChecked] = useState(false);
    const [consentChecked, setConsentChecked] = useState(formData.consentChecked || false);
    const [details, setDetails] = useState(formData.details || {});

    const handleCheckedboxChange = (e) => {
        setConsentChecked(e.target.checked);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // ....

        if (consentChecked) {
            onSubmit({ details });
        } else {
            // show an error message or handle invalid form state
        }
    };

    const handleBack = (e) => {
        e.preventDefault();
        // ....
        onBack({ details, consentChecked });
    }

    const handleFieldChange = (fieldName, value) => {
        setDetails((prevDetails) => ({
            ...prevDetails,
            [fieldName]: value,
        }));
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
        <form onSubmit = {handleSubmit}>
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
                <input type="date" value={filledDate} onChange={(e) => setFilledDate(e.target.value)} />
            </label>
            <br />
            <br />
            <button type= "button" onClick={handleBack}>
                Back
           </button>
            <button type="submit" onClick={handleSubmit}>Submit</button>

            {/*<BackButton />*/}
        </form>
    );
};


// a reusable component for rendering input fields  
const CustomField = ({ label, value, onChange, hasOptions, hasDate, dateLabel }) => {
    const handleChange = (e) => {
      onChange(e.target.value);
    };
  
    return (

        <div>
            <label>
                {label}:
                {hasOptions ? (
                    <select value={value} onChange={handleChange}>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                ) : (
                    <input type="text" value={value} onChange={handleChange} />
                )}
            </label>
            {hasDate && (
            <label>
                {dateLabel}:
                <input type="date" value={value} onChange={handleChange} />
            </label>
            )}
        </div>
        

    );
  };

  // the component renders a 'go back' button- nevigated the user back to the previous page
  const BackButton = () => {
    const handleGoBack = () => {
        window.history.back();
    };

    return (
        <button onClick={handleGoBack}>Back</button>
    );
  };

export default CampRegistration;