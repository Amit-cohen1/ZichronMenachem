import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { auth, firestore } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc} from 'firebase/firestore';
import { collection, query, where, getDocs } from 'firebase/firestore';
import LoginForm from './pages/LoginForm';
import RegisterForm from './pages/RegisterForm';
import AdminDashboard from './pages/AdminDashboard';
import ParentDashboard from './pages/ParentDashboard';
import MedicalStaffDashboard from './pages/MedicalStaffDashboard';
import AfterReg from './pages/AfterReg';
import WaitForAdmin from './pages/WaitForAdmin'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [currentUser, setCurrentUser] = useState({ role: null });
  const [loading, setLoading] = useState(true);

 

// ...

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

  
  

  if (loading) {
    // Add a loading indicator if needed
    return null;
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
      </Routes>
    </Router>
  );
}

function DashboardSelector({ currentUser }) {
  if(currentUser?.role===''){
    <WaitForAdmin />
  }
  switch (currentUser?.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'parent':
      return <ParentDashboard />;
    case 'medicalStaff':
      return <MedicalStaffDashboard />;
    default:
      return <AfterReg />;
  }
}

export default App;
