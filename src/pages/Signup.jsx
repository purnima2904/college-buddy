import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import TeacherService from '../TeacherService';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [type, setType] = useState('student');
  const [clubId, setClubId] = useState('');  // Changed clubName to clubId
  const [isClubMember, setIsClubMember] = useState(false);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  // Initialize theme on component mount
  useEffect(() => {
    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
      setIsDarkMode(savedTheme === 'dark');
    } else {
      // Check if user prefers dark mode
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        setIsDarkMode(true);
      }
    }
  }, []);

  // Handle theme toggle
  const handleThemeToggle = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    setIsDarkMode(!isDarkMode);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Simple validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Create new user object
    const newUser = {
      name,
      email,
      password,
      type,
      clubId, // Store club ID instead of name and title
      createdAt: new Date().toISOString()
    };

    // Register the user
    const success = register(newUser);

    if (success) {
      // If the user is a teacher, add them to the teachers list as well
      if (type === 'teacher') {
        TeacherService.addTeacher({
          name,
          email,
          cabinNo: '',
          phone: '',
          available: true,
          timetable: [],
          clubId // Pass club ID for teachers too
        });
      }

      navigate('/home');
    } else {
      setError('Email already in use. Please try another email.');
    }
  };

  return (
    <div>
      <div className="bg"></div>
      <div className="bg bg2"></div>
      <div className="bg bg3"></div>
      <div>
        <center><img src="/assets/MITADT.png" alt="MITADT" /></center>
      </div>
      <div className="container">
        <header>
          <div className="logo">College Buddy</div>
          <div className="header-controls">
            <label className="theme-toggle">
              <input
                type="checkbox"
                id="theme-toggle"
                checked={isDarkMode}
                onChange={handleThemeToggle}
              />
              <span className="toggle-slider"></span>
              <div className="toggle-icons">
                <i className="fas fa-sun"></i>
                <i className="fas fa-moon"></i>
              </div>
            </label>
            <div className="user-profile">
              <div className="user-avatar">
                <i className="fas fa-user"></i>
              </div>
              <span>Profile</span>
            </div>
          </div>
        </header>

        <div className="welcome-banner">
          <h2>Join College Buddy Today</h2>
        </div>

        <div className="feature-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div className="feature-card-header color1">
            <i className="fas fa-user-plus"></i>
            <h3>Sign Up</h3>
          </div>
          <div className="feature-card-body">
            {error && (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                color: '#EF4444',
                padding: '10px',
                borderRadius: 'var(--border-radius)',
                marginBottom: '15px'
              }}>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="name" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: 'var(--border-radius)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'var(--card-bg)',
                    color: 'var(--dark-text)'
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: 'var(--border-radius)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'var(--card-bg)',
                    color: 'var(--dark-text)'
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: 'var(--border-radius)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'var(--card-bg)',
                    color: 'var(--dark-text)'
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: 'var(--border-radius)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'var(--card-bg)',
                    color: 'var(--dark-text)'
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>User Type</label>
                <div style={{
                  display: 'flex',
                  gap: '20px',
                  backgroundColor: 'var(--card-footer-bg)',
                  padding: '12px',
                  borderRadius: 'var(--border-radius)'
                }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      value="student"
                      checked={type === 'student'}
                      onChange={() => setType('student')}
                      style={{ accentColor: '#6366F1' }}
                    />
                    <span>Student</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      value="teacher"
                      checked={type === 'teacher'}
                      onChange={() => setType('teacher')}
                      style={{ accentColor: '#6366F1' }}
                    />
                    <span>Teacher</span>
                  </label>
                </div>
              </div>

              {/* Club Member Checkbox */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    id="isClubMember"
                    checked={isClubMember}
                    onChange={(e) => {
                      setIsClubMember(e.target.checked);
                      if (!e.target.checked) {
                        setClubId('');
                      }
                    }}
                    style={{
                      accentColor: '#6366F1',
                      width: '18px',
                      height: '18px'
                    }}
                  />
                  <span style={{ fontWeight: 'bold' }}>I am a club member</span>
                </label>
              </div>

              {/* Conditional Club ID Field */}
              {isClubMember && (
                <div style={{
                  padding: '15px',
                  marginBottom: '15px',
                  backgroundColor: 'var(--card-footer-bg)',
                  borderRadius: 'var(--border-radius)'
                }}>
                  <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="clubId" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                      Club ID
                    </label>
                    <input
                      type="text"
                      id="clubId"
                      value={clubId}
                      onChange={(e) => setClubId(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: 'var(--border-radius)',
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        backgroundColor: 'var(--card-bg)',
                        color: 'var(--dark-text)'
                      }}
                      placeholder="Enter club ID"
                    />
                  </div>
                </div>
              )}

              <button type="submit" className="btn" style={{ width: '100%', padding: '12px' }}>
                Create Account
              </button>
            </form>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              Already have an account? <Link to="/login" style={{ color: '#6366F1', textDecoration: 'none' }}>Login</Link>
            </div>
          </div>
        </div>
        <footer>
          <p>&copy; 2025 College Buddy App. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default Signup;