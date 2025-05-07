import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TeacherAvailability from './pages/TeacherAvailability';
import TeacherSeating from './pages/TeacherSeating';
import ClubsPage from './pages/ClubsPage';
import ClubDetailPage from './pages/ClubDetailPage';
import ScrollToTopButton from './pages/ScrollToTopButton';
import Transport from './pages/Transport';
import AlumniConnect from './pages/AlumniConnect';
import WelcomePopup from './pages/WelcomePopup';

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
      <Router>
        <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/WelcomePopup" element={<WelcomePopup />} />
          <Route path="/home" element={
            <ProtectedRoute element={<Home />} />
          } />
          <Route path="/teacher-availability" element={
            <ProtectedRoute element={<TeacherAvailability />} />
          } />
          <Route path="/teacher-seating" element={
            <ProtectedRoute element={<TeacherSeating />} />
          } />
          <Route path="/clubs" element={
            <ProtectedRoute element={<ClubsPage />} />
          } />
          <Route path="/clubs/:clubId" element={
            <ProtectedRoute element={<ClubDetailPage />} />
          } />
          <Route path="/transport" element={
            <ProtectedRoute element={<Transport />} />
          } />
          <Route path="/alumni" element={
            <ProtectedRoute element={<AlumniConnect />} />
          } />
        </Routes>
        <ScrollToTopButton />
      </Router>
    </AuthProvider>
  );
}

export default App;