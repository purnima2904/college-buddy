import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { Link } from 'react-router-dom';
import TeacherService from '../TeacherService';
import './css/TeacherView.css';

function TeacherView() {
  const { currentUser } = useAuth();
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cabinNo: '',
    phone: '',
    available: true
  });
  
  // Timetable states
  const [timetable, setTimetable] = useState([]);
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [newSlot, setNewSlot] = useState({
    day: 'Monday',
    time: '09:00-10:00',
    course: '',
    location: ''
  });

  const [timetableImage, setTimetableImage] = useState(null);
  const [timetableImagePreview, setTimetableImagePreview] = useState(null);
  const [timetableDisplayMode, setTimetableDisplayMode] = useState('manual'); // 'manual' or 'image'
  
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

  useEffect(() => {
    if (currentUser) {
      setLoading(true);
      // Try to get teacher profile
      const teacherData = TeacherService.getTeacher(currentUser.email);
      
      if (teacherData) {
        setTeacherProfile(teacherData);
        setFormData({
          name: teacherData.name || '',
          email: teacherData.email || '',
          cabinNo: teacherData.cabinNo || '',
          phone: teacherData.phone || '',
          available: teacherData.available !== undefined ? teacherData.available : true
        });
        setTimetable(teacherData.timetable || []);
        
        // Set timetable image if available
        if (teacherData.timetableImage) {
          setTimetableImage(teacherData.timetableImage);
          setTimetableImagePreview(teacherData.timetableImage);
          setTimetableDisplayMode('image');
        }
        
        // Set display mode if available
        if (teacherData.timetableDisplayMode) {
          setTimetableDisplayMode(teacherData.timetableDisplayMode);
        }
      } else {
        // Create a new teacher profile if it doesn't exist
        const newTeacher = TeacherService.addTeacher({
          name: currentUser.name,
          email: currentUser.email,
          cabinNo: '',
          phone: '',
          available: true,
          timetable: [],
          timetableImage: null,
          timetableDisplayMode: 'manual'
        });
        
        setTeacherProfile(newTeacher);
        setFormData({
          name: newTeacher.name || '',
          email: newTeacher.email || '',
          cabinNo: newTeacher.cabinNo || '',
          phone: newTeacher.phone || '',
          available: newTeacher.available
        });
        setTimetable(newTeacher.timetable || []);
      }
      
      setLoading(false);
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleToggleAvailability = () => {
    if (teacherProfile) {
      const updatedTeacher = TeacherService.toggleAvailability(teacherProfile.email);
      if (updatedTeacher) {
        setTeacherProfile(updatedTeacher);
        setFormData({
          ...formData,
          available: updatedTeacher.available
        });
      }
    }
  };

  const handleSaveProfile = () => {
    if (teacherProfile) {
      const updatedTeacher = TeacherService.updateTeacher(teacherProfile.email, {
        ...formData,
        timetable,
        timetableImage: teacherProfile.timetableImage, // Preserve existing timetable image
        timetableDisplayMode
      });
      
      if (updatedTeacher) {
        setTeacherProfile(updatedTeacher);
        setIsEditing(false);
      }
    }
  };

  const handleNewSlotChange = (e) => {
    const { name, value } = e.target;
    setNewSlot({
      ...newSlot,
      [name]: value
    });
  };

  const handleAddSlot = () => {
    // Validate the new slot
    if (!newSlot.course || !newSlot.location) {
      alert('Please fill in all fields for the new timetable slot');
      return;
    }
    
    const updatedTimetable = [...timetable, newSlot];
    setTimetable(updatedTimetable);
    
    // Save to service - preserving timetable image
    if (teacherProfile) {
      const updatedTeacher = TeacherService.updateTeacher(teacherProfile.email, {
        ...teacherProfile,
        timetable: updatedTimetable
      });
      
      if (updatedTeacher) {
        setTeacherProfile(updatedTeacher);
      }
    }
    
    // Reset form
    setNewSlot({
      day: 'Monday',
      time: '09:00-10:00',
      course: '',
      location: ''
    });
    setShowAddSlot(false);
  };

  const handleDeleteSlot = (index) => {
    const updatedTimetable = timetable.filter((_, i) => i !== index);
    setTimetable(updatedTimetable);
    
    // Save to service - preserving timetable image
    if (teacherProfile) {
      const updatedTeacher = TeacherService.updateTeacher(teacherProfile.email, {
        ...teacherProfile,
        timetable: updatedTimetable
      });
      
      if (updatedTeacher) {
        setTeacherProfile(updatedTeacher);
      }
    }
  };

  const handleTimetableImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        // In a real app, you might want to upload to a server
        // and store the URL instead of the base64 string
        setTimetableImage(reader.result);
        setTimetableImagePreview(reader.result);
      };
      
      reader.readAsDataURL(file);
    }
  };

  // Handle display mode change
  const handleDisplayModeChange = (mode) => {
    setTimetableDisplayMode(mode);
    
    // Update in service - using the existing updateTeacher method instead
    if (teacherProfile) {
      TeacherService.updateTeacher(teacherProfile.email, {
        ...teacherProfile,
        timetableDisplayMode: mode
      });
    }
  };

  // Save timetable image
  const handleSaveTimetableImage = () => {
    if (teacherProfile && timetableImage) {
      const updated = TeacherService.updateTeacher(teacherProfile.email, {
        ...teacherProfile,
        timetableImage: timetableImage
      });
      
      if (updated) {
        setTeacherProfile(updated);
        alert('Timetable image saved successfully');
      }
    }
  };

  // New function to remove timetable image
  const handleRemoveTimetableImage = () => {
    if (teacherProfile) {
      const updated = TeacherService.updateTeacher(teacherProfile.email, {
        ...teacherProfile,
        timetableImage: null
      });
      
      if (updated) {
        setTeacherProfile(updated);
        setTimetableImage(null);
        setTimetableImagePreview(null);
        alert('Timetable image removed successfully');
      }
    }
  };

  if (loading) {
    return (
      <div className="teacher-view">
        <div className="loading">Loading profile information...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg"></div>
      <div className="bg bg2"></div>
      <div className="bg bg3"></div>
      <div>
        <center><img src="/assets/MITADT.png" alt="MITADT" /></center>
      </div>
      <div className="teacher-view">
        <header>
          <Link to="/Home" className="back-home-button">Back to Home</Link>
          <div className="logo">Teacher Portal</div>
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
              <span>{formData.name || 'Profile'}</span>
            </div>
          </div>
        </header>
        
        <div className="profile-container">
          <div className="profile-header">
            <h2>My Profile</h2>
            <div className="availability-toggle">
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={formData.available} 
                  onChange={handleToggleAvailability}
                />
                <span className="slider round"></span>
              </label>
              <span className="toggle-label">
                {formData.available ? 'Available' : 'Unavailable'}
              </span>
            </div>
            
            <button 
              className="edit-button"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
          
          {isEditing ? (
            <div className="edit-form">
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange}
                  disabled
                />
              </div>
              
              <div className="form-group">
                <label>Cabin Number</label>
                <input 
                  type="text" 
                  name="cabinNo" 
                  value={formData.cabinNo} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="text" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange}
                />
              </div>
              
              <button 
                className="save-button"
                onClick={handleSaveProfile}
              >
                Save Changes
              </button>
            </div>
          ) : (
            <div className="profile-details">
              <div className="detail-row">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{formData.name}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{formData.email}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Cabin Number:</span>
                <span className="detail-value">
                  {formData.cabinNo || 'Not specified'}
                </span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Phone Number:</span>
                <span className="detail-value">
                  {formData.phone || 'Not specified'}
                </span>
              </div>
            </div>
          )}
        </div>
        
        <div className="timetable-container">
          <div className="timetable-header">
            <h2>My Timetable</h2>
            <div className="display-mode-toggle">
              <button 
                className={`mode-button ${timetableDisplayMode === 'manual' ? 'active' : ''}`}
                onClick={() => handleDisplayModeChange('manual')}
              >
                Manual Entry
              </button>
              <button 
                className={`mode-button ${timetableDisplayMode === 'image' ? 'active' : ''}`}
                onClick={() => handleDisplayModeChange('image')}
              >
                Image Upload
              </button>
            </div>
          </div>
          
          {timetableDisplayMode === 'manual' ? (
            <div className="manual-timetable-section">
              <div className="timetable-actions">
                <button 
                  className="add-button"
                  onClick={() => setShowAddSlot(!showAddSlot)}
                >
                  {showAddSlot ? 'Cancel' : 'Add Slot'}
                </button>
              </div>
          
              {showAddSlot && (
                <div className="add-slot-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Day</label>
                      <select name="day" value={newSlot.day} onChange={handleNewSlotChange}>
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Time</label>
                      <select name="time" value={newSlot.time} onChange={handleNewSlotChange}>
                        {['09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', 
                          '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00'].map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Course</label>
                      <input 
                        type="text" 
                        name="course" 
                        value={newSlot.course} 
                        onChange={handleNewSlotChange}
                        placeholder="e.g. Introduction to Computer Science"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Location</label>
                      <input 
                        type="text" 
                        name="location" 
                        value={newSlot.location} 
                        onChange={handleNewSlotChange}
                        placeholder="e.g. Room 101"
                      />
                    </div>
                  </div>
                  
                  <button 
                    className="save-button"
                    onClick={handleAddSlot}
                  >
                    Add to Timetable
                  </button>
                </div>
              )}
              
              <div className="timetable-list">
                {timetable.length === 0 ? (
                  <p className="no-timetable">No timetable entries yet. Add your first slot.</p>
                ) : (
                  <table className="timetable">
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Time</th>
                        <th>Course</th>
                        <th>Location</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {timetable.map((slot, index) => (
                        <tr key={index}>
                          <td>{slot.day}</td>
                          <td>{slot.time}</td>
                          <td>{slot.course}</td>
                          <td>{slot.location}</td>
                          <td>
                            <button 
                              className="delete-button"
                              onClick={() => handleDeleteSlot(index)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          ) : (
            <div className="image-timetable-section">
              <div className="image-upload">
                <div className="form-group">
                  <label>Upload Timetable Image</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleTimetableImageChange}
                    className="file-input" 
                  />
                </div>
                
                {timetableImagePreview && (
                  <div className="image-preview">
                    <img src={timetableImagePreview} alt="Timetable" />
                  </div>
                )}
                
                <div className="image-actions">
                  <button 
                    className="save-button"
                    onClick={handleSaveTimetableImage}
                    disabled={!timetableImage}
                  >
                    Save Timetable Image
                  </button>
                  
                  {timetableImagePreview && (
                    <button 
                      className="delete-button"
                      onClick={handleRemoveTimetableImage}
                    >
                      Remove Image
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <footer>
          <p>&copy; 2025 College Buddy App. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default TeacherView;