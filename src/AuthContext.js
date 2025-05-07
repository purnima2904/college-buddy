import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the authentication context
const AuthContext = createContext();

// Create a custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isNewLogin, setIsNewLogin] = useState(false); // Add isNewLogin state

  // Check if user is already logged in when component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    setCurrentUser(user);
    setIsNewLogin(true); // Set isNewLogin to true when user logs in
    return true;
  };

  // Reset new login flag
  const resetNewLoginFlag = () => {
    setIsNewLogin(false);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  // Register function
  const register = (user) => {
    // In a real app, you would call an API here
    // For now, just store in localStorage
    
    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = existingUsers.some(u => u.email === user.email);
    
    if (userExists) {
      return false;
    }
    
    // Add new user to the list
    existingUsers.push(user);
    localStorage.setItem('users', JSON.stringify(existingUsers));
    
    // Login the user after registration
    login(user);
    return true;
  };

  // Create value object
  const value = {
    currentUser,
    login,
    logout,
    register,
    isAuthenticated: !!currentUser,
    isTeacher: currentUser?.type === 'teacher',
    isStudent: currentUser?.type === 'student',
    isNewLogin,           // Add isNewLogin to context value
    resetNewLoginFlag     // Add resetNewLoginFlag function to context value
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};