import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { ref, listAll, getMetadata, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from '../firebase';
import './MedicalHistory.css';

const MedicalHistory = ({ childID }) => {
  const [showHistory, setShowHistory] = useState(false);
  const [filesData, setFilesData] = useState([]);
  const [doctorMeetData, setDoctorMeetData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log('Child ID:', childID);
      try {
        // Fetch files from Firebase Storage
        const storageRef = ref(storage, 'תיק חולה/');
        const files = await listAll(storageRef);

        childID = childID.toString();

        // Filter files by childID in metadata
        const filteredFiles = await Promise.all(
          files.items.map(async (fileRef) => {
            const metadata = await getMetadata(fileRef);
            console.log('File Metadata:', metadata); // Debugging

            return metadata.customMetadata.userId === childID ? fileRef : null;
          })
        );

        console.log('Filtered Files:', filteredFiles); // Debugging

        // Process the fetched files and update the state
        const filesDataPromises = filteredFiles.map(async (fileRef) => {
          if (fileRef) {
            const metadata = await getMetadata(fileRef);
            console.log('File Metadata:', metadata); // Debugging

            const downloadUrl = await getDownloadURL(fileRef);

            return {
              type: 'file',
              fileName: metadata.name,
              downloadUrl,
              createdAt: metadata.timeCreated,
            };
          }
          return null;
        });

        Promise.all(filesDataPromises)
          .then((result) => {
            console.log('Files Data:', result); // Debugging

            // Filter out any null values and sort the files in chronological order
            const sortedFilesData = result.filter((file) => file !== null).sort((a, b) => a.createdAt - b.createdAt);
            setFilesData(sortedFilesData);
          })
          .catch((error) => {
            console.error('Error processing files data: ', error);
          });

        // Fetch doctor meet documents from Firestore
        const doctorMeetRef = collection(firestore, 'DoctorMeet');
        const doctorMeetQuery = query(doctorMeetRef, where('childID', '==', childID.toString()));
        const doctorMeetSnapshot = await getDocs(doctorMeetQuery);
        console.log('Doctor Meet Snapshot:', doctorMeetSnapshot); // Debugging

        // Process the fetched doctor meet documents and update the state
        const doctorMeetData = doctorMeetSnapshot.docs.map((doc) => doc.data());
        console.log('Doctor Meet Data:', doctorMeetData); // Debugging

        // Sort the doctor meet documents in chronological order based on appointmentDate
        const sortedDoctorMeetData = doctorMeetData.sort((a, b) => a.appointmentDate - b.appointmentDate);
        setDoctorMeetData(sortedDoctorMeetData);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    if (showHistory) {
      fetchData();
    }
  }, [childID, showHistory]);

  const toggleHistoryVisibility = () => {
    setShowHistory(!showHistory);
  };

  const closePopup = () => {
    setShowHistory(false);
  };

  const toggleCardExpansion = (index) => {
    setDoctorMeetData((prevData) =>
      prevData.map((doctorMeet, i) => {
        if (i === index) {
          return {
            ...doctorMeet,
            expanded: !doctorMeet.expanded,
          };
        }
        return doctorMeet;
      })
    );
  };

  return (
    <div>
      <button className='searchBarBtn smaller-btn' onClick={toggleHistoryVisibility}>
        הסטוריה רפואית
      </button>
      {showHistory && (
        <div className='Medical-history-container'>
          <button className='print-btn' onClick={closePopup}>
           סגור
          </button>
          <h3 className='to-center'>הסטוריה רפואית</h3>

          <h4>קבצים:</h4>
          {filesData.map((file) => (
            <div className='cardMedicalHistory' key={file.fileName}>
              <p>סוג קובץ: {file.type}</p>
              <p>שם הקובץ: {file.fileName}</p>
              <p>נוצר בתאריך: {file.createdAt}</p>
              <a target="_blank"  rel="noreferrer" className='print-btn' href={file.downloadUrl} download>
                הורדה
              </a>
            </div>
          ))}

          <h4>מפגשי רופא:</h4>
          {doctorMeetData.map((doctorMeet, index) => (
            <div
              key={doctorMeet.appointmentDate}
              className={`cardMedicalHistory ${doctorMeet.expanded ? 'expanded' : ''}`}
              onClick={() => toggleCardExpansion(index)}
            >
              <p className='headline-card'>מפגש רופא {doctorMeet.appointmentDate} </p>
              {doctorMeet.expanded && (
                <div className='card-content'>
                  <p>שם הרופא: {doctorMeet.doctorName}</p>
                  <p>תעודת זהות מטופל: {doctorMeet.childID}</p>
                  <p>תאריך המפגש: {doctorMeet.appointmentDate}</p>
                  <p>תרופות: {doctorMeet.prescription}</p>
                  <p>סיכום: {doctorMeet.summary}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicalHistory;
