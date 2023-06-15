import React from 'react';
import { collection, query, where, getDocs, getFirestore, updateDoc ,deleteDoc} from "firebase/firestore";
import './UserEmailContainer.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const db = getFirestore();

const UserEmailContainer = ({ userEmail }) => {
  
  const handleDel = async () => {
    const q = query(
      collection(db, "users"),
      where("email", "==", userEmail)
    );
    const qs = await getDocs(q);
    qs.forEach(async (doc) => {
      if(doc.exists) {
        await deleteDoc(doc.ref);
        toast.success('משתמש נמחק בהצלחה');
      }
    });
  };
  const handleClick = async () => {
    const selectedRole = document.getElementById("myS").value;
    console.log(selectedRole);
    console.log(userEmail);

    const q = query(
      collection(db, "users"),
      where("email", "==", userEmail)
    );
    const qs = await getDocs(q);
    qs.forEach(async (doc) => {
      if (doc.exists) {
        await updateDoc(doc.ref, {
          role: selectedRole
        });
        toast.success('תפקיד שונה בהצלחה');
      }
    });
  };

  return (
    <div className="user-email-container">
      <div className="user-email">{userEmail}</div>
      <div className="role-dropdown">
        <label className="dropdown-label">
          בחר תפקיד:
          <select id="myS" className="dropdown-select">
            <option value ="">ללא תפקיד</option>
            <option value="admin">Admin</option>
            <option value="medicalStaff">Medical Staff</option>
            <option value="parent">Parent</option>
          </select>
        </label>
      </div>
      <button onClick={handleClick} className="apply-button">
        החל
      </button>
      <button id='delete-button' onClick={handleDel} className="delete-button">מחק משתמש</button>
      <ToastContainer />
    </div>
  );
};

export default UserEmailContainer;
