import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

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
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Check if user exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      setError('Invalid email or password');
      return;
    }

    // Log the user in
    const success = login(user);
    if (success) {
      // Change: Navigate to dashboard instead of directly to teacher-availability
      navigate('/Home');
    } else {
      setError('Something went wrong. Please try again.');
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
          <h2>Welcome Back to College Buddy</h2>
        </div>

        <div className="feature-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div className="feature-card-header color5">
            <i className="fas fa-sign-in-alt"></i>
            <h3>Login</h3>
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
              <div style={{ marginBottom: '20px' }}>
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
              <button type="submit" className="btn" style={{ width: '100%', padding: '12px' }}>
                Login
              </button>
            </form>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              Don't have an account? <Link to="/signup" style={{ color: '#6366F1', textDecoration: 'none' }}>Sign up</Link>
            </div>
          </div>
        </div>
        
        <div className="back-home-container">
          <Link to="/Home" className="back-home-button">Back to Home</Link>
        </div>

        <footer>
          <p>&copy; 2025 College Buddy App. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default Login;