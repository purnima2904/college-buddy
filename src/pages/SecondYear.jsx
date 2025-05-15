import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './css/FirstYear.css';

const SecondYear = () => {
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
        id: 7,
        name: 'Data Structures and Algorithms',
        code: 'CSE201',
        description: 'Covers fundamental data structures such as stacks, queues, linked lists, trees, graphs, and algorithmic techniques including sorting, searching, and recursion.',
        instructor: 'Dr. Anil Mehta',
        credits: 4,
        documentLink: 'https://drive.google.com/drive/folders/2XYZ123'
    },
    {
        id: 8,
        name: 'Object-Oriented Programming',
        code: 'CSE202',
        description: 'Introduces object-oriented principles like encapsulation, inheritance, and polymorphism using Java or C++.',
        instructor: 'Prof. Neha Kapoor',
        credits: 4,
        documentLink: 'https://drive.google.com/drive/folders/2ABC456'
    },
    {
        id: 9,
        name: 'Computer Organization and Architecture',
        code: 'CSE203',
        description: 'Focuses on internal computer architecture, instruction sets, memory hierarchy, and CPU design.',
        instructor: 'Dr. Vivek Anand',
        credits: 3,
        documentLink: 'https://drive.google.com/drive/folders/2DEF789'
    },
    {
        id: 10,
        name: 'Database Management Systems',
        code: 'CSE204',
        description: 'Covers relational database models, SQL, normalization, transaction processing, and database design.',
        instructor: 'Prof. Sheetal Rane',
        credits: 4,
        documentLink: 'https://drive.google.com/drive/folders/2GHI101'
    },
    {
        id: 11,
        name: 'Discrete Mathematics',
        code: 'MATH201',
        description: 'Mathematical reasoning, combinatorics, graph theory, logic, sets, relations, and functions relevant to computer science.',
        instructor: 'Dr. Poonam Bhatt',
        credits: 4,
        documentLink: 'https://drive.google.com/drive/folders/2JKL112'
    },
    {
        id: 12,
        name: 'Operating Systems',
        code: 'CSE205',
        description: 'Explains operating system concepts such as processes, threads, scheduling, memory management, and file systems.',
        instructor: 'Prof. Kiran Patil',
        credits: 4,
        documentLink: 'https://drive.google.com/drive/folders/2MNO131'
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
                    <div className="logo">Second Year BTech CSE Resources</div>
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
                                {isTeacher && <span className="badge">Teacher</span>}
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

export default SecondYear;