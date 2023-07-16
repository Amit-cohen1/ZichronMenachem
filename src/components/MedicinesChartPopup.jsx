import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase'; // Import your Firebase configuration
import { Grid, Paper, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  chartContainer: {
    marginBottom: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
  },
  medicineButton: {
    marginLeft: theme.spacing(1),
  },
  chartWrapper: {
    maxHeight: '80vh',
    overflowY: 'auto',
  },
}));

const MedicinesChartPopup = ({ childID, onClose }) => {
  const classes = useStyles();
  const [medicinesData, setMedicinesData] = useState([]);

  useEffect(() => {
    const fetchMedicinesChart = async () => {
      try {
        const childrensRef = collection(firestore, 'Childrens');
        const q = query(childrensRef, where('id', '==', childID));
        const childrensSnapshot = await getDocs(q);

        if (!childrensSnapshot.empty) {
          const childDoc = childrensSnapshot.docs[0];
          const childData = childDoc.data();
          const medicinesChart = childData.MedicinesChart || [];

          const chartData = medicinesChart.flatMap((medicine) => {
            const medicineName = medicine.medicineName;
            const days = Object.entries(medicine.days).map(([day, status]) => {
              const dayNumber = parseInt(day.match(/\d+/)[0]);
              const dayText = `יום ${dayNumber}`;
              const times = status.map((time) => time.time);
              const statusValues = status.map((time) => time.status);

              return { day: dayText, times, status: statusValues };
            });

            return days.flatMap((day) =>
              day.times.map((time, index) => ({
                medicineName,
                day: day.day,
                time,
                status: day.status[index],
              }))
            );
          });

          setMedicinesData(chartData);
        }
      } catch (error) {
        console.error('Error fetching medicines chart:', error);
      }
    };

    fetchMedicinesChart();
  }, [childID]);

  const updateMedicineStatus = async (medicineName, day, time, status) => {
    try {
      const childrensRef = collection(firestore, 'Childrens');
      const q = query(childrensRef, where('id', '==', childID));
      const childrensSnapshot = await getDocs(q);
  
      if (!childrensSnapshot.empty) {
        const childDoc = childrensSnapshot.docs[0];
        const childDocRef = childDoc.ref;
        const childData = childDoc.data();
        const medicinesChart = childData.MedicinesChart || [];
  
        const updatedMedicinesChart = medicinesChart.map((medicine) => {
          if (medicine.medicineName === medicineName) {
            const updatedDays = Object.entries(medicine.days).map(([dayKey, dayStatus]) => {
              if (dayKey === day) {
                const updatedStatus = dayStatus.map((timeData) => {
                  if (timeData.time === time) {
                    return { ...timeData, status };
                  }
                  return timeData;
                });
                return { day: dayKey, status: updatedStatus };
              }
              return { day: dayKey, status: dayStatus };
            });
  
            return { medicineName, days: Object.fromEntries(updatedDays) };
          }
          return medicine;
        });
  
        const updatedChildData = { ...childData, MedicinesChart: updatedMedicinesChart };
        await updateDoc(childDocRef, updatedChildData);
        setMedicinesData((prevData) =>
          prevData.map((medicine) => {
            if (medicine.medicineName === medicineName && medicine.day === day && medicine.time === time) {
              return { ...medicine, status };
            }
            return medicine;
          })
        );
      }
    } catch (error) {
      console.error('Error updating medicine status:', error);
    }
  };

  const handleMedicineDone = async (medicineName, day, time) => {
    updateMedicineStatus(medicineName, day, time, 'ניתן');
  };

  const handleConfirmMedicineDone = () => {
    console.log('Confirm medicine done');
    onClose();
  };

  return (
    <div className={classes.chartWrapper}>
      <h2>טבלת תרופות</h2>
      <Grid container spacing={2}>
        {medicinesData.sort((a, b) => {
          const dayA = parseInt(a.day.match(/\d+/)[0]);
          const dayB = parseInt(b.day.match(/\d+/)[0]);
          return dayA - dayB;
        }).map(({ medicineName, day, time, status }) => (
          <Grid item xs={12} sm={6} md={4} key={`${medicineName}-${day}-${time}`} className={classes.chartContainer}>
            <Paper className={classes.paper}>
              <Typography variant="h5">{day}</Typography>
              <Typography variant="body1">{medicineName}</Typography>
              {status === 'notGiven' ? (
                <Button
                  variant="outlined"
                  className={classes.medicineButton}
                  onClick={() => handleMedicineDone(medicineName, day, time)}
                >
                  הזן נתינה
                </Button>
              ) : (
                <Button variant="outlined" className={classes.medicineButton} disabled>
                  ניתן
                </Button>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Button variant="contained" color="primary" onClick={handleConfirmMedicineDone}>
        אישור
      </Button>
    </div>
  );
};

export default MedicinesChartPopup;
