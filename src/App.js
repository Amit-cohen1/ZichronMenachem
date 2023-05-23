import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

import LoginForm from './pages/LoginForm';
import RegisterForm from './pages/RegisterForm';
import AdminDashboard from './pages/AdminDashboard';
import ParentDashboard from './pages/ParentDashboard';
import MedicalStaffDashboard from './pages/MedicalStaffDashboard';
import AfterReg from './pages/AfterReg';


function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

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
