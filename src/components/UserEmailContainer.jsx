import React from 'react';
import { collection, query, where, getDocs, getFirestore, updateDoc } from "firebase/firestore";
import './UserEmailContainer.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const db = getFirestore();

const UserEmailContainer = ({ userEmail }) => {
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
        toast.success('Role changed successfully');
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
            <option value="admin">Admin</option>
            <option value="medicalStaff">Medical Staff</option>
            <option value="parent">Parent</option>
          </select>
        </label>
      </div>
      <button onClick={handleClick} className="apply-button">
        החל
      </button>
      <ToastContainer />
    </div>
  );
};

export default UserEmailContainer;
