import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, getFirestore, setDoc, doc, updateDoc } from "firebase/firestore";
import './UserEmailContainer.css'; // Import the CSS file
const db = getFirestore();

const handleClick =  async (e) => {
    var x=document.getElementById("myS").value;
    console.log(x)
    console.log(e.target.value)
    const q = query(
        collection(db,"users"),
        where("email", "==", e.target.value)
      );
      const qs = await getDocs(q);
      qs.forEach(async (doc) => {
        if (doc.exists){
           await updateDoc(doc.ref,{
            role:x
           });
        }
        
     });

}

const UserEmailContainer = ({userEmail}) => {
    return(
        <div id='1'>
            <div className="wrapper"> 
                <div className="firstline">נמצא המשתמש בעל האימייל</div>
                {userEmail}
                <div id="2">
                    <div className="DropDown">
                    <label>בחר תפקיד
                     <select id="myS">
                         <option value="admin" >Admin</option>
                         <option value="medicalStaff">medicalStaff</option>
                         <option value="parent">parent</option>
                     </select>
                     <button value={userEmail} onClick={handleClick}>yes</button>
                    </label>
                    
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserEmailContainer;