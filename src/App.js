import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { auth, firestore } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import LoginForm from './pages/LoginForm';
import RegisterForm from './pages/RegisterForm';
import AdminDashboard from './pages/AdminDashboard';
import ParentDashboard from './pages/ParentDashboard';
import MedicalStaffDashboard from './pages/MedicalStaffDashboard';
import AfterReg from './pages/AfterReg';
import WaitForAdmin from './pages/WaitForAdmin';
import LoadingIndicator from './components/LoadingIndicator';
import 'bootstrap/dist/css/bootstrap.min.css';
import MedicalHistory from './components/MedicalHistory';
import CampRegistration from './pages/CampRegistration';
import UploadDocuments from './pages/UploadDocuments';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tripDate, setTripDate] = useState('');
  const [tripName, setTripName] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);

      if (user) {
        const usersCollectionRef = collection(firestore, 'users');
        const querySnapshot = await getDocs(
          query(usersCollectionRef, where('email', '==', user.email))
        );

        if (querySnapshot.size > 0) {
          const userData = querySnapshot.docs[0].data();
          const userRole = userData.role;
          setCurrentUser((prevUser) => ({
            ...prevUser,
            role: userRole,
          }));
          console.log('Current User:', user);
          console.log('User Role:', userRole);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchMostRecentTrip = async () => {
      const tripsCollectionRef = collection(firestore, 'Trips');
      const querySnapshot = await getDocs(
        query(tripsCollectionRef, orderBy('DateOfTrip', 'desc'), limit(1))
      );

      if (querySnapshot.size > 0) {
        const tripData = querySnapshot.docs[0].data();
        setTripDate(tripData.DateOfTrip);
        setTripName(tripData.NameOfTrip);
      }
    };

    fetchMostRecentTrip();
  }, []);

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/AfterReg" element={<AfterReg />} />
        <Route
          path="/"
          element={currentUser ? (
            <DashboardSelector currentUser={currentUser} />
          ) : (
            <LoginForm />
          )}
        />
        <Route path="/medical-history" element={<MedicalHistory />} />
        <Route
          path="/camp-registration"
          element={<CampRegistration tripDate={tripDate} tripName={tripName} />}
        />
        <Route path="/upload-documents" element={<UploadDocuments />} />
      </Routes>
    </Router>
  );
}

function DashboardSelector({ currentUser }) {
  switch (currentUser?.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'parent':
      return <ParentDashboard />;
    case 'medicalStaff':
      return <MedicalStaffDashboard />;
    default:
      return <WaitForAdmin />;
  }
}

export default App;
