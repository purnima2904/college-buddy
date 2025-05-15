import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './css/Specializations.css';

const Specializations = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedYear, setSelectedYear] = useState('third'); // 'third' or 'fourth'
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editSubjectId, setEditSubjectId] = useState(null);
    const [editSpecializationId, setEditSpecializationId] = useState(null);
const [newSubject, setNewSubject] = useState({
        name: '',
        credits: '',
        description: '',
        documentLink: ''
    });
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    // Check if user is a teacher
    const isTeacher = currentUser && (
        currentUser.userType === 'teacher' || 
        currentUser.role === 'teacher' || 
        currentUser.type === 'teacher'
    );

    // Specialization data
    const [specializations, setSpecializations] = useState({
        thirdYear: [
            {
                id: 1,
                name: 'Artificial Intelligence & Machine Learning',
                code: 'AIML',
                description: 'Study of algorithms and models that enable computers to learn from data and make intelligent decisions.',
                icon: 'fas fa-brain',
                color: 'color1',
                subjects: [
                    { id: 101, name: 'Machine Learning Fundamentals', credits: 4, description: 'Introduction to core ML algorithms and techniques.' },
                    { id: 102, name: 'Natural Language Processing', credits: 3, description: 'Processing and analyzing text data using AI techniques.' },
                    { id: 103, name: 'Computer Vision', credits: 4, description: 'Image and video analysis using deep learning approaches.' },
                    { id: 104, name: 'Neural Networks', credits: 3, description: 'Deep learning architectures and training methodologies.' }
                ]
            },
            {
                id: 2,
                name: 'Cybersecurity',
                code: 'CS',
                description: 'Focus on protecting systems, networks, and programs from digital attacks and ensuring data privacy and security.',
                icon: 'fas fa-shield-alt',
                color: 'color2',
                subjects: [
                    { id: 201, name: 'Network Security', credits: 4, description: 'Securing network infrastructure and communications.' },
                    { id: 202, name: 'Cyber Defense Mechanisms', credits: 3, description: 'Strategies and tools for defending against cyber attacks.' },
                    { id: 203, name: 'Security Auditing', credits: 4, description: 'Methods for testing and evaluating security controls.' },
                    { id: 204, name: 'Cryptography', credits: 3, description: 'Encryption techniques for data protection.' }
                ]
            },
            {
                id: 3,
                name: 'Cloud Computing',
                code: 'CC',
                description: 'Study of delivery of computing services over the internet including servers, storage, databases, and software.',
                icon: 'fas fa-cloud',
                color: 'color3',
                subjects: [
                    { id: 301, name: 'Cloud Architecture', credits: 4, description: 'Design principles for cloud-based systems.' },
                    { id: 302, name: 'Virtualization Technologies', credits: 3, description: 'Concepts and implementation of virtualization.' },
                    { id: 303, name: 'Cloud Security', credits: 3, description: 'Securing data and applications in cloud environments.' },
                    { id: 304, name: 'Cloud Service Models', credits: 4, description: 'IaaS, PaaS, and SaaS models and implementations.' }
                ]
            },
            {
                id: 4,
                name: 'Blockchain Technology',
                code: 'BT',
                description: 'Study of distributed ledger technology that enables secure, transparent, and tamper-proof record keeping.',
                icon: 'fas fa-link',
                color: 'color4',
                subjects: [
                    { id: 401, name: 'Blockchain Fundamentals', credits: 4, description: 'Core concepts of distributed ledger technology.' },
                    { id: 402, name: 'Smart Contracts', credits: 3, description: 'Automated, self-executing contracts with coded terms.' },
                    { id: 403, name: 'Cryptocurrency Systems', credits: 3, description: 'Digital currency designs and implementations.' },
                    { id: 404, name: 'Decentralized Applications', credits: 4, description: 'Building apps on blockchain platforms.' }
                ]
            },
            {
                id: 5,
                name: 'Core Computer Science',
                code: 'CCS',
                description: 'Focus on fundamental computer science principles including algorithms, data structures, and system design.',
                icon: 'fas fa-laptop-code',
                color: 'color5',
                subjects: [
                    { id: 501, name: 'Advanced Algorithms', credits: 4, description: 'Complex algorithm design and analysis.' },
                    { id: 502, name: 'Distributed Systems', credits: 3, description: 'Principles of distributed computing and coordination.' },
                    { id: 503, name: 'Software Engineering', credits: 4, description: 'Methodologies for large-scale software development.' },
                    { id: 504, name: 'Database Management', credits: 3, description: 'Advanced database design and optimization.' }
                ]
            }
        ],
        fourthYear: [
            {
                id: 6,
                name: 'Artificial Intelligence & Machine Learning',
                code: 'AIML',
                description: 'Advanced study of AI algorithms, deep learning, natural language processing, and computer vision.',
                icon: 'fas fa-brain',
                color: 'color1',
                subjects: [
                    { id: 601, name: 'Deep Learning', credits: 4, description: 'Advanced neural network architectures and applications.' },
                    { id: 602, name: 'Reinforcement Learning', credits: 3, description: 'Learning through interaction with environments.' },
                    { id: 603, name: 'AI Ethics', credits: 3, description: 'Ethical considerations in AI development and deployment.' },
                    { id: 604, name: 'Generative AI', credits: 4, description: 'Models for generating novel content and data.' }
                ]
            },
            {
                id: 7,
                name: 'Cybersecurity',
                code: 'CS',
                description: 'Advanced topics in security including ethical hacking, penetration testing, and security operations.',
                icon: 'fas fa-shield-alt',
                color: 'color2',
                subjects: [
                    { id: 701, name: 'Ethical Hacking', credits: 4, description: 'Techniques for identifying and exploiting security vulnerabilities.' },
                    { id: 702, name: 'Digital Forensics', credits: 3, description: 'Methods for investigating cyber incidents.' },
                    { id: 703, name: 'Security Operations', credits: 4, description: 'Managing and operating security infrastructure.' },
                    { id: 704, name: 'Advanced Cryptography', credits: 3, description: 'Modern cryptographic systems and protocols.' }
                ]
            },
            {
                id: 8,
                name: 'Cloud Computing',
                code: 'CC',
                description: 'Advanced cloud technologies including microservices, serverless computing, and multi-cloud strategies.',
                icon: 'fas fa-cloud',
                color: 'color3',
                subjects: [
                    { id: 801, name: 'Microservices Architecture', credits: 4, description: 'Building applications as service collections.' },
                    { id: 802, name: 'Serverless Computing', credits: 3, description: 'Function-as-a-Service and event-driven systems.' },
                    { id: 803, name: 'Multi-Cloud Strategies', credits: 3, description: 'Leveraging multiple cloud providers effectively.' },
                    { id: 804, name: 'Cloud Performance Optimization', credits: 4, description: 'Techniques for maximizing cloud resource efficiency.' }
                ]
            },
            {
                id: 9,
                name: 'Blockchain Technology',
                code: 'BT',
                description: 'Advanced blockchain concepts including smart contracts, decentralized applications, and enterprise solutions.',
                icon: 'fas fa-link',
                color: 'color4',
                subjects: [
                    { id: 901, name: 'Enterprise Blockchain', credits: 4, description: 'Blockchain applications for business use cases.' },
                    { id: 902, name: 'Blockchain Security', credits: 3, description: 'Security aspects of blockchain systems.' },
                    { id: 903, name: 'Consensus Mechanisms', credits: 3, description: 'Advanced algorithms for blockchain consensus.' },
                    { id: 904, name: 'Decentralized Finance', credits: 4, description: 'Financial applications of blockchain technology.' }
                ]
            },
            {
                id: 10,
                name: 'Core Computer Science',
                code: 'CCS',
                description: 'Advanced computer science topics focusing on system design, distributed systems, and emerging technologies.',
                icon: 'fas fa-laptop-code',
                color: 'color5',
                subjects: [
                    { id: 1001, name: 'High Performance Computing', credits: 4, description: 'Techniques for maximizing computation efficiency.' },
                    { id: 1002, name: 'Advanced System Design', credits: 3, description: 'Designing scalable and resilient systems.' },
                    { id: 1003, name: 'Quantum Computing', credits: 3, description: 'Introduction to quantum computation principles.' },
                    { id: 1004, name: 'Emerging Technologies', credits: 4, description: 'Exploring cutting-edge technological advances.' }
                ]
            }
        ]
    });

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

    // Function to handle theme toggle
    const handleThemeToggle = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        localStorage.setItem('theme', newMode ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
    };

    // Function to handle input change in the form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSubject({
            ...newSubject,
            [name]: value
        });
    };

    // Function to handle opening a document link
    const handleOpenDocument = (link) => {
        if (link) {
            window.open(link, '_blank');
        } else {
            alert('No document link available for this subject.');
        }
    };

    // Function to handle adding a new subject
    const handleAddSubject = (e) => {
        e.preventDefault();
        
        const currentYearKey = selectedYear === 'third' ? 'thirdYear' : 'fourthYear';
        const specializationIndex = specializations[currentYearKey].findIndex(spec => spec.id === editSpecializationId);
        
        if (specializationIndex === -1) return;
        
        const newId = Math.max(...specializations[currentYearKey]
            .flatMap(spec => spec.subjects.map(sub => sub.id)), 0) + 1;
        
        const newSubjectObj = {
            id: newId,
            name: newSubject.name,
            credits: parseInt(newSubject.credits),
            description: newSubject.description
        };
        
        const updatedSpecs = {...specializations};
        updatedSpecs[currentYearKey][specializationIndex].subjects.push(newSubjectObj);
        
        setSpecializations(updatedSpecs);
        setShowAddForm(false);
        resetForm();
    };

    // Function to handle editing a subject
    const handleEditSubject = (e) => {
        e.preventDefault();
        
        const currentYearKey = selectedYear === 'third' ? 'thirdYear' : 'fourthYear';
        const specializationIndex = specializations[currentYearKey].findIndex(spec => spec.id === editSpecializationId);
        
        if (specializationIndex === -1) return;
        
        const subjectIndex = specializations[currentYearKey][specializationIndex].subjects.findIndex(
            sub => sub.id === editSubjectId
        );
        
        if (subjectIndex === -1) return;
        
        const updatedSpecs = {...specializations};
        updatedSpecs[currentYearKey][specializationIndex].subjects[subjectIndex] = {
            ...updatedSpecs[currentYearKey][specializationIndex].subjects[subjectIndex],
            name: newSubject.name,
            credits: parseInt(newSubject.credits),
            description: newSubject.description
        };
        
        setSpecializations(updatedSpecs);
        setShowEditForm(false);
        setEditSubjectId(null);
        resetForm();
    };

    // Function to start editing a subject
    const startEditSubject = (specializationId, subject) => {
        setEditSpecializationId(specializationId);
        setEditSubjectId(subject.id);
        setNewSubject({
            name: subject.name,
            credits: subject.credits.toString(),
            description: subject.description
        });
        setShowEditForm(true);
    };

    // Function to handle deleting a subject
    const handleDeleteSubject = (specializationId, subjectId) => {
        if (window.confirm('Are you sure you want to delete this subject?')) {
            const currentYearKey = selectedYear === 'third' ? 'thirdYear' : 'fourthYear';
            const specializationIndex = specializations[currentYearKey].findIndex(spec => spec.id === specializationId);
            
            if (specializationIndex === -1) return;
            
            const updatedSpecs = {...specializations};
            updatedSpecs[currentYearKey][specializationIndex].subjects = 
                updatedSpecs[currentYearKey][specializationIndex].subjects.filter(sub => sub.id !== subjectId);
            
            setSpecializations(updatedSpecs);
        }
    };

    // Function to start adding a new subject
    const startAddSubject = (specializationId) => {
        setEditSpecializationId(specializationId);
        setShowAddForm(true);
    };

    // Reset form function
    const resetForm = () => {
        setNewSubject({
            name: '',
            credits: '',
            description: '',
            documentLink: ''
        });
    };

    // Filter specializations based on search term
    const filteredThirdYear = specializations.thirdYear.filter(spec =>
        spec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spec.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spec.subjects.some(subject => subject.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const filteredFourthYear = specializations.fourthYear.filter(spec =>
        spec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spec.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spec.subjects.some(subject => subject.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Current year specializations based on tab selection
    const currentSpecializations = selectedYear === 'third' ? filteredThirdYear : filteredFourthYear;
    const yearText = selectedYear === 'third' ? 'Third' : 'Fourth';

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
                    <div className="logo">Specialization Tracks</div>
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
                            placeholder="Search specializations or subjects..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>

                {/* Year Selection Tabs */}
                <div className="year-tabs">
                    <button 
                        className={`year-tab ${selectedYear === 'third' ? 'active' : ''}`}
                        onClick={() => setSelectedYear('third')}
                    >
                        Third Year
                    </button>
                    <button 
                        className={`year-tab ${selectedYear === 'fourth' ? 'active' : ''}`}
                        onClick={() => setSelectedYear('fourth')}
                    >
                        Fourth Year
                    </button>
                </div>

                {/* Year Title */}
                <h2 className="year-title">{yearText} Year Specializations</h2>

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
                                    <label>Description:</label>
                                    <textarea
                                        name="description"
                                        value={newSubject.description}
                                        onChange={handleInputChange}
                                        required
                                    ></textarea>
                                </div>
                                <div className="form-group">
                                    <label>Document Link (Google Drive):</label>
                                    <input
                                        type="url"
                                        name="documentLink"
                                        value={newSubject.documentLink}
                                        onChange={handleInputChange}
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
                                    <label>Description:</label>
                                    <textarea
                                        name="description"
                                        value={newSubject.description}
                                        onChange={handleInputChange}
                                        required
                                    ></textarea>
                                </div>
                                <div className="form-group">
                                    <label>Document Link (Google Drive):</label>
                                    <input
                                        type="url"
                                        name="documentLink"
                                        value={newSubject.documentLink}
                                        onChange={handleInputChange}
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

                {/* Specialization Cards */}
                <div className="specializations-container">
                    {currentSpecializations.length > 0 ? (
                        currentSpecializations.map(specialization => (
                            <div className="specialization-section" key={specialization.id}>
                                <div className={`specialization-header ${specialization.color}`}>
                                    <div className="specialization-icon">
                                        <i className={specialization.icon}></i>
                                    </div>
                                    <div className="specialization-info">
                                        <h3>{specialization.name}</h3>
                                        <span className="specialization-code">{specialization.code}</span>
                                    </div>
                                </div>
                                
                                <div className="specialization-description">
                                    <p>{specialization.description}</p>
                                </div>
                                
                                {/* Add Subject Button for Teachers */}
                                {(isTeacher || window.location.search.includes('debug=teacher')) && (
                                    <div className="add-subject-button-container">
                                        <button 
                                            className="add-subject-button" 
                                            onClick={() => startAddSubject(specialization.id)}
                                        >
                                            <i className="fas fa-plus"></i> Add New Subject
                                        </button>
                                    </div>
                                )}
                                
                                {/* Subject Cards */}
                                <div className="subject-cards-container">
                                    {specialization.subjects.map(subject => (
                                        <div className="subject-card" key={subject.id}>
                                            <div className="subject-card-header">
                                                <h3>{subject.name}</h3>
                                                <span className="subject-credits">{subject.credits} Credits</span>
                                            </div>
                                            <div className="subject-card-body">
                                                <p className="subject-description">{subject.description}</p>
                                            </div>
                                            <div className="subject-card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <button 
                                                    className="document-button"
                                                    onClick={() => handleOpenDocument(subject.documentLink)}
                                                    style={{ marginRight: 'auto' }}
                                                >
                                                    <i className="fas fa-file-alt"></i> Documents
                                                </button>
                                                {/* Teacher actions */}
                                                {(isTeacher || window.location.search.includes('debug=teacher')) && (
                                                    <div className="teacher-actions" style={{ display: 'flex', gap: '8px' }}>
                                                        <button 
                                                            className="edit-button"
                                                            onClick={() => startEditSubject(specialization.id, subject)}
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        <button 
                                                            className="delete-button"
                                                            onClick={() => handleDeleteSubject(specialization.id, subject.id)}
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-specializations">
                            <i className="fas fa-search"></i>
                            <p>No {yearText.toLowerCase()} year specializations found matching your search criteria.</p>
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

export default Specializations;