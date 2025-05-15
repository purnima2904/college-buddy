import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './css/FirstYear.css';

const FirstYear = () => {
    const [subjects, setSubjects] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editSubjectId, setEditSubjectId] = useState(null);
    const [newSubject, setNewSubject] = useState({
        name: '',
        code: '',
        description: '',
        instructor: '',
        credits: '',
        documentLink: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    
    // Debug the current user to the console
    useEffect(() => {
        console.log("Current user:", currentUser);
    }, [currentUser]);
    
    // Fixed teacher check - logging the check result to help with debugging
    const isTeacher = currentUser && (
        currentUser.userType === 'teacher' || 
        currentUser.role === 'teacher' || 
        currentUser.type === 'teacher'
    );
    
    // Log the result of the teacher check
    useEffect(() => {
        console.log("Is teacher:", isTeacher);
        console.log("User type:", currentUser?.userType);
        console.log("User role:", currentUser?.role);
        console.log("User type alternate:", currentUser?.type);
    }, [isTeacher, currentUser]);

    // Mock data for first year BTech CSE subjects
    useEffect(() => {
        // Simulate loading data from an API
        const initialSubjects = [
            {
                id: 1,
                name: 'Computer Programming',
                code: 'CSE101',
                description: 'Introduction to programming concepts using C language including variables, data types, control structures, arrays, functions, and pointers.',
                instructor: 'Dr. Rajesh Kumar',
                credits: 4,
                documentLink: 'https://drive.google.com/drive/folders/1XYZ123'
            },
            {
                id: 2,
                name: 'Engineering Mathematics I',
                code: 'MATH101',
                description: 'Covers calculus, differential equations, matrices, and their applications in engineering problems.',
                instructor: 'Dr. Priya Sharma',
                credits: 4,
                documentLink: 'https://drive.google.com/drive/folders/1ABC456'
            },
            {
                id: 3,
                name: 'Digital Logic Design',
                code: 'CSE102',
                description: 'Fundamentals of digital electronics, Boolean algebra, logic gates, combinational and sequential circuits, and basic computer architecture.',
                instructor: 'Prof. Amit Verma',
                credits: 3,
                documentLink: 'https://drive.google.com/drive/folders/1DEF789'
            },
            {
                id: 4,
                name: 'Physics for Computing',
                code: 'PHY101',
                description: 'Principles of physics relevant to computing including electromagnetism, semiconductors, and quantum mechanics basics.',
                instructor: 'Dr. Ravi Shankar',
                credits: 4,
                documentLink: 'https://drive.google.com/drive/folders/1GHI101'
            },
            {
                id: 5,
                name: 'Communication Skills',
                code: 'HUM101',
                description: 'Development of effective communication skills including technical writing, presentations, and interpersonal communication.',
                instructor: 'Prof. Maya Desai',
                credits: 2,
                documentLink: 'https://drive.google.com/drive/folders/1JKL112'
            },
            {
                id: 6,
                name: 'Engineering Drawing',
                code: 'ME101',
                description: 'Fundamentals of engineering graphics, projections, dimensioning, and computer-aided drafting.',
                instructor: 'Prof. Suresh Nair',
                credits: 3,
                documentLink: 'https://drive.google.com/drive/folders/1MNO131'
            }
        ];

        setSubjects(initialSubjects);

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

    // Function to handle opening a document link
    const handleOpenDocument = (link) => {
        window.open(link, '_blank');
    };

    // Function to handle adding a new subject
    const handleAddSubject = (e) => {
        e.preventDefault();
        
        const newId = subjects.length > 0 ? Math.max(...subjects.map(subject => subject.id)) + 1 : 1;
        
        setSubjects([...subjects, {
            id: newId,
            name: newSubject.name,
            code: newSubject.code,
            description: newSubject.description,
            instructor: newSubject.instructor,
            credits: parseInt(newSubject.credits),
            documentLink: newSubject.documentLink
        }]);
        
        // Reset form
        setNewSubject({
            name: '',
            code: '',
            description: '',
            instructor: '',
            credits: '',
            documentLink: ''
        });
        
        setShowAddForm(false);
    };

    // Function to handle editing a subject
    const handleEditSubject = (e) => {
        e.preventDefault();
        
        const updatedSubjects = subjects.map(subject => 
            subject.id === editSubjectId ? {
                ...newSubject, 
                id: editSubjectId,
                credits: parseInt(newSubject.credits)
            } : subject
        );
        
        setSubjects(updatedSubjects);
        setShowEditForm(false);
        setEditSubjectId(null);
        
        // Reset form
        setNewSubject({
            name: '',
            code: '',
            description: '',
            instructor: '',
            credits: '',
            documentLink: ''
        });
    };

    // Function to start editing a subject
    const startEditSubject = (subject) => {
        setEditSubjectId(subject.id);
        setNewSubject({
            name: subject.name,
            code: subject.code,
            description: subject.description,
            instructor: subject.instructor,
            credits: subject.credits.toString(),
            documentLink: subject.documentLink
        });
        setShowEditForm(true);
    };

    // Function to handle deleting a subject
    const handleDeleteSubject = (id) => {
        if (window.confirm('Are you sure you want to delete this subject?')) {
            setSubjects(subjects.filter(subject => subject.id !== id));
        }
    };

    // Function to handle input change in the form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSubject({
            ...newSubject,
            [name]: value
        });
    };

    // Filter subjects based on search term
    const filteredSubjects = subjects.filter(subject =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.instructor.toLowerCase().includes(searchTerm.toLowerCase())
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
                    <div className="logo">First Year BTech CSE Resources</div>
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
                        {/* Show current user info here if needed */}
                        {currentUser && (
                            <div className="user-info">
                                <i className="fas fa-user"></i>
                                <span>{currentUser.name}</span>
                                
                            </div>
                        )}
                    </div>
                </header>

                <div className="search-container">
                    <div className="search-bar">
                        <i className="fas fa-search search-icon"></i>
                        <input
                            type="text"
                            placeholder="Search subjects..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>

                {/* Debug information - uncomment for debugging */}
                {/* <div style={{color: 'white', margin: '10px', padding: '10px', background: '#333'}}>
                    <p>Debug - Current User: {currentUser ? JSON.stringify(currentUser) : 'No user'}</p>
                    <p>Is Teacher: {isTeacher ? 'Yes' : 'No'}</p>
                    <p>User Type: {currentUser?.userType}</p>
                    <p>User Role: {currentUser?.role}</p>
                    <p>User Type Alt: {currentUser?.type}</p>
                </div> */}

                {/* Add Subject Button - Now visible for any user marked as teacher */}
                {(isTeacher || window.location.search.includes('debug=teacher')) && (
                    <div className="add-subject-button-container">
                        <button 
                            className="add-subject-button" 
                            onClick={() => setShowAddForm(true)}
                        >
                            <i className="fas fa-plus"></i> Add New Subject
                        </button>
                    </div>
                )}

                {/* Add Subject Form */}
                {showAddForm && (
                    <div className="form-overlay">
                        <div className="subject-form">
                            <div className="form-header">
                                <h2>Add New Subject</h2>
                                <button className="close-form" onClick={() => setShowAddForm(false)}>
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                            <form onSubmit={handleAddSubject}>
                                <div className="form-group">
                                    <label>Subject Name:</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={newSubject.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Subject Code:</label>
                                    <input
                                        type="text"
                                        name="code"
                                        value={newSubject.code}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Description:</label>
                                    <textarea
                                        name="description"
                                        value={newSubject.description}
                                        onChange={handleInputChange}
                                        required
                                    ></textarea>
                                </div>
                                <div className="form-group">
                                    <label>Instructor:</label>
                                    <input
                                        type="text"
                                        name="instructor"
                                        value={newSubject.instructor}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Credits:</label>
                                    <input
                                        type="number"
                                        name="credits"
                                        value={newSubject.credits}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Document Link (Google Drive):</label>
                                    <input
                                        type="url"
                                        name="documentLink"
                                        value={newSubject.documentLink}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="submit-button">
                                        <i className="fas fa-save"></i> Save Subject
                                    </button>
                                    <button 
                                        type="button" 
                                        className="cancel-button"
                                        onClick={() => setShowAddForm(false)}
                                    >
                                        <i className="fas fa-ban"></i> Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Subject Form */}
                {showEditForm && (
                    <div className="form-overlay">
                        <div className="subject-form">
                            <div className="form-header">
                                <h2>Edit Subject</h2>
                                <button 
                                    className="close-form" 
                                    onClick={() => {
                                        setShowEditForm(false);
                                        setEditSubjectId(null);
                                    }}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                            <form onSubmit={handleEditSubject}>
                                <div className="form-group">
                                    <label>Subject Name:</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={newSubject.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Subject Code:</label>
                                    <input
                                        type="text"
                                        name="code"
                                        value={newSubject.code}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Description:</label>
                                    <textarea
                                        name="description"
                                        value={newSubject.description}
                                        onChange={handleInputChange}
                                        required
                                    ></textarea>
                                </div>
                                <div className="form-group">
                                    <label>Instructor:</label>
                                    <input
                                        type="text"
                                        name="instructor"
                                        value={newSubject.instructor}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Credits:</label>
                                    <input
                                        type="number"
                                        name="credits"
                                        value={newSubject.credits}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Document Link (Google Drive):</label>
                                    <input
                                        type="url"
                                        name="documentLink"
                                        value={newSubject.documentLink}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="submit-button">
                                        <i className="fas fa-save"></i> Update Subject
                                    </button>
                                    <button 
                                        type="button" 
                                        className="cancel-button"
                                        onClick={() => {
                                            setShowEditForm(false);
                                            setEditSubjectId(null);
                                        }}
                                    >
                                        <i className="fas fa-ban"></i> Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Subject Cards - using similar format to club cards */}
                <div className="subject-cards-container">
                    {filteredSubjects.length > 0 ? (
                        filteredSubjects.map(subject => (
                            <div className="subject-card" key={subject.id}>
                                <div className="subject-card-header">
                                    <h3>{subject.name}</h3>
                                    <span className="subject-code">{subject.code}</span>
                                </div>
                                <div className="subject-card-body">
                                    <p className="subject-description">{subject.description}</p>
                                    <div className="subject-details">
                                        <p><strong>Instructor:</strong> {subject.instructor}</p>
                                        <p><strong>Credits:</strong> {subject.credits}</p>
                                    </div>
                                </div>
                                <div className="subject-card-footer">
                                    <button 
                                        className="document-button"
                                        onClick={() => handleOpenDocument(subject.documentLink)}
                                    >
                                        <i className="fas fa-file-alt"></i> Documents
                                    </button>
                                    
                                    {/* Teacher actions - now properly displayed for teachers */}
                                    {(isTeacher || window.location.search.includes('debug=teacher')) && (
                                        <div className="teacher-actions">
                                            <button 
                                                className="edit-button"
                                                onClick={() => startEditSubject(subject)}
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button 
                                                className="delete-button"
                                                onClick={() => handleDeleteSubject(subject.id)}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-subjects">
                            <i className="fas fa-search"></i>
                            <p>No subjects found matching your search criteria.</p>
                        </div>
                    )}
                </div>

                <footer>
                    <p>&copy; {new Date().getFullYear()} College Buddy | MIT ADT University | All Rights Reserved</p>
                </footer>
            </div>
        </div>
    );
};

export default FirstYear;