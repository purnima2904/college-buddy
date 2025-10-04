import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './PeerStudy.css';

function PeerStudy() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [studyGroups, setStudyGroups] = useState([
    { id: 1, name: 'Calculus Study Group', course: 'MATH101', members: 5, link: 'https://chat.whatsapp.com/calculus' },
    { id: 2, name: 'Physics Peer Group', course: 'PHYS201', members: 3, link: 'https://t.me/physicsgroup' },
    { id: 3, name: 'CS Algorithms', course: 'CS301', members: 7, link: 'https://discord.gg/csalgo' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', course: '', link: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme and study groups
  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Check if user prefers dark mode
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        setIsDarkMode(true);
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    }
  }, []);

  // Handle theme change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Function to handle theme toggle
  const handleThemeToggle = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const handleCreateGroup = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setIsModalOpen(true);
  };

  const handleJoinGroup = (groupId) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    alert(`Joined group with ID: ${groupId}`);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewGroup({ name: '', course: '', link: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGroup((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newGroup.name || !newGroup.course || !newGroup.link) {
      alert('Please fill in all fields');
      return;
    }
    const newGroupData = {
      id: studyGroups.length + 1,
      name: newGroup.name,
      course: newGroup.course,
      members: 1,
      link: newGroup.link,
    };
    setStudyGroups((prev) => [...prev, newGroupData]);
    handleModalClose();
  };

  // Filter groups based on search term
  const filteredGroups = studyGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.link.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page">
      <div className="bg"></div>
      <div className="bg bg2"></div>
      <div className="bg bg3"></div>

      <div className="container">
        <header>
          <button className="back-home-button" onClick={() => navigate('/home')}>
            Back to Home
          </button>
          <div className="logo">Peer Study Groups</div>
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
            {currentUser && (
              <div className="user-info">
                <i className="fas fa-user"></i>
                <span>{currentUser.name || 'User'}</span>
              </div>
            )}
          </div>
        </header>

        <div className="search-container">
          <div className="search-bar">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Search study groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="add-group-button-container">
          <button className="add-group-button" onClick={handleCreateGroup}>
            <i className="fas fa-plus"></i> Create New Group
          </button>
        </div>

        {isModalOpen && (
          <div className="form-overlay">
            <div className="group-form">
              <div className="form-header">
                <h2>Create New Study Group</h2>
                <button className="close-form" onClick={handleModalClose}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Group Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={newGroup.name}
                    onChange={handleInputChange}
                    placeholder="Group Name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Course Code:</label>
                  <input
                    type="text"
                    name="course"
                    value={newGroup.course}
                    onChange={handleInputChange}
                    placeholder="Course Code (e.g., MATH101)"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Group Link (WhatsApp, Telegram, Discord):</label>
                  <input
                    type="url"
                    name="link"
                    value={newGroup.link}
                    onChange={handleInputChange}
                    placeholder="Group Link"
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="submit-button">
                    <i className="fas fa-save"></i> Create Group
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={handleModalClose}
                  >
                    <i className="fas fa-ban"></i> Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="group-cards-container">
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group) => (
              <div className="group-card" key={group.id}>
                <div className="group-card-header">
                  <h3>{group.name}</h3>
                  <span className="group-course">{group.course}</span>
                </div>
                <div className="group-card-body">
                  <div className="group-details">
                    <p><strong>Members:</strong> {group.members}</p>
                    <p>
                      <strong>Group Link:</strong>{' '}
                      <a
                        href={group.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group-link"
                      >
                        Join Chat
                      </a>
                    </p>
                  </div>
                </div>
                <div className="group-card-footer">
                  <button
                    className="join-button"
                    onClick={() => handleJoinGroup(group.id)}
                  >
                    <i className="fas fa-user-plus"></i> Join Group
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-groups">
              <i className="fas fa-search"></i>
              <p>No study groups found matching your search criteria.</p>
            </div>
          )}
        </div>

        <footer>
          <p>© {new Date().getFullYear()} College Buddy | MIT ADT University | All Rights Reserved</p>
        </footer>
      </div>
    </div>
  );
}

export default PeerStudy;