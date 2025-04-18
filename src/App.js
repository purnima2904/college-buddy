import React from 'react'
import Home from './pages/Home'
import Login from './pages/Login';
import Signup from './pages/Signup';
import TeacherAvailability from './pages/TeacherAvailability';
import { AuthProvider, useAuth } from './AuthContext';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import TeacherSeating from './pages/TeacherSeating';
import ClubsPage from './pages/ClubsPage'
import ClubDetailPage from './pages/ClubDetailPage';
import ScrollToTopButton from './pages/ScrollToTopButton';
import Transport from './pages/Transport';
import AlumniConnect from './pages/AlumniConnect';

const ProtectedRoute = ({ element, role, ...rest }) => {
  const { isAuthenticated, currentUser } = useAuth();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }

  if (role && currentUser?.type !== role) {
    // Redirect to home or show an error if the user doesn't have the required role
    return <Navigate to="/home" />;
  }

  return element;
};


function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path='/Home' element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/teacher-seating" element={<TeacherSeating />} />
        <Route path="/teacher-availability" element={<TeacherAvailability />} />
        <Route path="/clubs" element={<ClubsPage />} />
        <Route path="/clubs/:clubId" element={<ClubDetailPage />} />
        <Route path="/transport" element={<Transport />} />
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/alumni" element={<AlumniConnect />} />

      </Routes>
      <ScrollToTopButton />
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App