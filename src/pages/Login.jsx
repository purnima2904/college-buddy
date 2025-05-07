import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Initialize theme and check for remembered credentials
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

    // Check if credentials were saved
    const savedCredentials = localStorage.getItem('rememberedUser');
    if (savedCredentials) {
      const { email: savedEmail, password: savedPassword } = JSON.parse(savedCredentials);
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
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

    // Remember me functionality
    if (rememberMe) {
      localStorage.setItem('rememberedUser', JSON.stringify({ email, password }));
    } else {
      localStorage.removeItem('rememberedUser');
    }

    // Log the user in
    const success = login(user);
    if (success) {
      navigate('/Home');
    } else {
      setError('Something went wrong. Please try again.');
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    
    if (!resetEmail) {
      setError('Please enter your email address');
      return;
    }

    // Check if user exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === resetEmail);

    if (!user) {
      setError('No account found with this email address');
      return;
    }

    // In a real application, you would send a password reset email here
    // For this demo, we'll just show a success message
    setResetEmailSent(true);
    setError('');
    
    // Generate a password reset token and store it
    const resetToken = Math.random().toString(36).substring(2, 15);
    const resetExpiry = Date.now() + 3600000; // 1 hour from now
    
    // Store the token with the user (in a real app, this would be in a database)
    const updatedUsers = users.map(u => {
      if (u.email === resetEmail) {
        return { ...u, resetToken, resetExpiry };
      }
      return u;
    });
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // In a real application, you would send an email with a link like:
    // /reset-password?token=resetToken&email=resetEmail
    console.log(`Password reset link would be sent to ${resetEmail} with token ${resetToken}`);
  };

  return (
    <div className="login-page">
      <div className="bg"></div>
      <div className="bg bg2"></div>
      <div className="bg bg3"></div>
      
      <div className="logo-container">
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
          </div>
        </header>

        <div className="welcome-banner">
          <h2>Welcome Back to College Buddy</h2>
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <i className="fas fa-sign-in-alt"></i>
            <h3>{showResetForm ? 'Reset Password' : 'Login'}</h3>
          </div>
          <div className="auth-card-body">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            {showResetForm ? (
              resetEmailSent ? (
                <div className="success-message">
                  <p>Password reset instructions have been sent to {resetEmail}.</p>
                  <button 
                    className="btn secondary-btn"
                    onClick={() => {
                      setShowResetForm(false);
                      setResetEmailSent(false);
                    }}
                  >
                    Back to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword}>
                  <div className="form-group">
                    <label htmlFor="resetEmail">Email Address</label>
                    <input
                      type="email"
                      id="resetEmail"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                      className="form-control"
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn primary-btn">
                      Send Reset Link
                    </button>
                    <button 
                      type="button" 
                      className="btn secondary-btn"
                      onClick={() => setShowResetForm(false)}
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              )
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="form-control"
                  />
                </div>
                <div className="form-options">
                  <div className="remember-me">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label htmlFor="rememberMe">Remember me</label>
                  </div>
                  <div className="forgot-password">
                    <button 
                      type="button" 
                      onClick={() => setShowResetForm(true)}
                      className="text-link"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>
                <button type="submit" className="btn primary-btn">
                  Login
                </button>
                <div className="auth-footer">
                  Don't have an account? <Link to="/signup" className="text-link">Sign up</Link>
                </div>
              </form>
            )}
          </div>
        </div>

        <footer>
          <p>&copy; 2025 College Buddy App. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default Login;