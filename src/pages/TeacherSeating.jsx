import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/TeacherSeating.css';
import { useAuth } from '../AuthContext';

function TeacherSeating() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState(null);
    const { currentUser } = useAuth(); 
    const navigate = useNavigate();

    const [teachers, setTeachers] = useState([
        {
            id: 1,
            name: "Prof. Umesh Nanaware",
            department: "MIT School of Computing",
            building: "S-001",
            floor: "",
            roomNumber: "1",
            email: "umesh.nanaware@mit.edu",
            phone: "555-000-0001",
            image: "/assets/teacher1.jpg"
        },
        {
            id: 2,
            name: "Prof. Savitri Chougule",
            department: "MIT School of Computing",
            building: "S-001",
            floor: "",
            roomNumber: "2",
            email: "savitri.chougule@mit.edu",
            phone: "555-000-0002",
            image: "/assets/teacher2.jpg"
        },
        {
            id: 3,
            name: "Prof. Supriya Mandhare",
            department: "MIT School of Computing",
            building: "S-001",
            floor: "",
            roomNumber: "3",
            email: "supriya.mandhare@mit.edu",
            phone: "555-000-0003",
            image: "/assets/teacher3.jpg"
        },
        {
            id: 4,
            name: "Prof. Mayuresh Gulame",
            department: "MIT School of Computing",
            building: "S-001",
            floor: "",
            roomNumber: "4",
            email: "mayuresh.gulame@mit.edu",
            phone: "555-000-0004",
            image: "/assets/teacher4.jpg"
        },
        {
            id: 5,
            name: "Dr. Reena Gunjan",
            department: "MIT School of Computing",
            building: "N-003",
            floor: "",
            roomNumber: "N-003",
            email: "reena.gunjan@mit.edu",
            phone: "555-000-0005",
            image: "/assets/teacher5.jpg"
        },
        {
            id: 6,
            name: "Dr. Nandkishor Karlekar",
            department: "MIT School of Computing",
            building: "S-211",
            floor: "",
            roomNumber: "A (Right First)",
            email: "nandkishor.karlekar@mit.edu",
            phone: "555-000-0006",
            image: "/assets/teacher6.jpg"
        },
        {
            id: 7,
            name: "Prof. Nilesh Thorat",
            department: "MIT School of Computing",
            building: "S-211",
            floor: "",
            roomNumber: "B (Right Second)",
            email: "nilesh.thorat@mit.edu",
            phone: "555-000-0007",
            image: "/assets/teacher7.jpg"
        },
        {
            id: 8,
            name: "Prof. Pratiksha Malvathkar",
            department: "MIT School of Computing",
            building: "S-211",
            floor: "",
            roomNumber: "C (Right Third)",
            email: "pratiksha.malvathkar@mit.edu",
            phone: "555-000-0008",
            image: "/assets/teacher8.jpg"
        },
        {
            id: 9,
            name: "Prof. Arati Pimpalkar",
            department: "MIT School of Computing",
            building: "S-211",
            floor: "",
            roomNumber: "D (Right Forth)",
            email: "arati.pimpalkar@mit.edu",
            phone: "555-000-0009",
            image: "/assets/teacher9.jpg"
        },
        {
            id: 10,
            name: "Prof. Kanchan Wankhade",
            department: "MIT School of Computing",
            building: "S-211",
            floor: "",
            roomNumber: "E (Left Forth)",
            email: "kanchan.wankhade@mit.edu",
            phone: "555-000-0010",
            image: "/assets/teacher10.jpg"
        },
        {
            id: 11,
            name: "Prof. Priya Khune",
            department: "MIT School of Computing",
            building: "S-211",
            floor: "",
            roomNumber: "F (Left Third)",
            email: "priya.khune@mit.edu",
            phone: "555-000-0011",
            image: "/assets/teacher11.jpg"
        },
        {
            id: 12,
            name: "Dr. Salesh Saudagar",
            department: "MIT School of Computing",
            building: "S-211",
            floor: "",
            roomNumber: "G (Left Second)",
            email: "salesh.saudagar@mit.edu",
            phone: "555-000-0012",
            image: "/assets/teacher12.jpg"
        },
        {
            id: 13,
            name: "Prof. Avinash Utikar",
            department: "MIT School of Computing",
            building: "S-211",
            floor: "",
            roomNumber: "H (Left First)",
            email: "avinash.utikar@mit.edu",
            phone: "555-000-0013",
            image: "/assets/teacher13.jpg"
        },
        {
            id: 14,
            name: "Prof. Sushma Mehetre",
            department: "MIT School of Computing",
            building: "S-309",
            floor: "",
            roomNumber: "A (Right First)",
            email: "sushma.mehetre@mit.edu",
            phone: "555-000-0014",
            image: "/assets/teacher14.jpg"
        },
        {
            id: 15,
            name: "Dr. Sangita Patil",
            department: "MIT School of Computing",
            building: "S-309",
            floor: "",
            roomNumber: "B (Right Second)",
            email: "sangita.patil@mit.edu",
            phone: "555-000-0015",
            image: "/assets/teacher15.jpg"
        },
        {
            id: 16,
            name: "Prof. Mohini Kumbhar",
            department: "MIT School of Computing",
            building: "S-309",
            floor: "",
            roomNumber: "C (Right Third)",
            email: "mohini.kumbhar@mit.edu",
            phone: "555-000-0016",
            image: "/assets/teacher16.jpg"
        },
        {
            id: 17,
            name: "Dr. Chandrashekhar Goswami",
            department: "MIT School of Computing",
            building: "S-309",
            floor: "",
            roomNumber: "D - Corner",
            email: "chandrashekhar.goswami@mit.edu",
            phone: "555-000-0017",
            image: "/assets/teacher17.jpg"
        },
        {
            id: 18,
            name: "Dr. Rohit Pachor",
            department: "MIT School of Computing",
            building: "S-309",
            floor: "",
            roomNumber: "E- Front",
            email: "rohit.pachor@mit.edu",
            phone: "555-000-0018",
            image: "/assets/teacher18.jpg"
        },
        {
            id: 19,
            name: "Dr. Saiprasad Potraju",
            department: "MIT School of Computing",
            building: "S-309",
            floor: "",
            roomNumber: "F- Front",
            email: "saiprasad.potraju@mit.edu",
            phone: "555-000-0019",
            image: "/assets/teacher19.jpg"
        },
        {
            id: 20,
            name: "Prof. Babeetta Bbhagat",
            department: "MIT School of Computing",
            building: "S-309",
            floor: "",
            roomNumber: "G- Front",
            email: "babeetta.bbhagat@mit.edu",
            phone: "555-000-0020",
            image: "/assets/teacher20.jpg",
            notes: "New allocation- Medical Issue"
        },
        {
            id: 21,
            name: "Dr. Sunita Parinam",
            department: "MIT School of Computing",
            building: "S-309",
            floor: "",
            roomNumber: "H- Front",
            email: "sunita.parinam@mit.edu",
            phone: "555-000-0021",
            image: "/assets/teacher21.jpg"
        },
        {
            id: 22,
            name: "Dr. Aaditya Pai",
            department: "MIT School of Computing",
            building: "S-309",
            floor: "",
            roomNumber: "I- Corner",
            email: "aaditya.pai@mit.edu",
            phone: "555-000-0022",
            image: "/assets/teacher22.jpg"
        },
        {
            id: 23,
            name: "Dr. Arvind Jagtap",
            department: "MIT School of Computing",
            building: "S-309",
            floor: "",
            roomNumber: "J- Side",
            email: "arvind.jagtap@mit.edu",
            phone: "555-000-0023",
            image: "/assets/teacher23.jpg"
        },
        {
            id: 24,
            name: "Prof. Jyoti Ghavane",
            department: "MIT School of Computing",
            building: "S-309",
            floor: "",
            roomNumber: "K- Side",
            email: "jyoti.ghavane@mit.edu",
            phone: "555-000-0024",
            image: "/assets/teacher24.jpg"
        },
        {
            id: 25,
            name: "Dr. Atul Thakare",
            department: "MIT School of Computing",
            building: "S-309",
            floor: "",
            roomNumber: "L- Corner",
            email: "atul.thakare@mit.edu",
            phone: "555-000-0025",
            image: "/assets/teacher25.jpg"
        }
    ]);

    const [formData, setFormData] = useState({
        name: '',
        department: '',
        building: '',
        floor: '',
        roomNumber: '',
        email: '',
        phone: '',
        image: ''
    });

    // Load theme on component mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            setIsDarkMode(savedTheme === 'dark');
        }
    }, []);

    // Handle theme toggle
    const handleThemeToggle = () => {
        const newTheme = isDarkMode ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        setIsDarkMode(!isDarkMode);
    };

    // Filter teachers based on search query
    const filteredTeachers = teachers.filter(teacher => {
        return teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
               teacher.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
               teacher.building.toLowerCase().includes(searchQuery.toLowerCase()) ||
               teacher.roomNumber.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Handle back button
    const handleBackClick = () => {
        navigate('/Home');
    };

    // Open modal for adding new teacher
    const handleAddTeacher = () => {
            if (!currentUser || currentUser.type !== 'teacher') {
                alert('Only teachers can add new faculty members');
                return;
        }
        setEditingTeacher(null);
        setFormData({
            name: '',
            department: '',
            building: '',
            floor: '',
            roomNumber: '',
            email: '',
            phone: '',
            image: ''
        });
        setIsModalOpen(true);
    };

    // Open modal for editing teacher
    const handleEditTeacher = (teacher) => {
        setEditingTeacher(teacher);
        setFormData({
            name: teacher.name,
            department: teacher.department,
            building: teacher.building,
            floor: teacher.floor || '',
            roomNumber: teacher.roomNumber,
            email: teacher.email,
            phone: teacher.phone,
            image: teacher.image || ''
        });
        setIsModalOpen(true);
    };

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingTeacher) {
            // Update existing teacher
            const updatedTeachers = teachers.map(teacher => 
                teacher.id === editingTeacher.id ? {...teacher, ...formData} : teacher
            );
            setTeachers(updatedTeachers);
        } else {
            // Add new teacher
            const newTeacher = {
                id: teachers.length + 1,
                ...formData
            };
            setTeachers([...teachers, newTeacher]);
        }
        
        // Close modal
        setIsModalOpen(false);
    };

    return (
        <div>
            <div className="bg"></div>
            <div className="bg bg2"></div>
            <div className="bg bg3"></div>
            
            <div className="teacher-seating-container">
                <header className="teacher-header">
                    <div className="back-button" onClick={handleBackClick}>
                        <i className="fas fa-arrow-left"></i> Back to Home
                    </div>
                    <h1>Faculty Seating Arrangement</h1>
                    <label className="theme-toggle">
                        <input
                            type="checkbox"
                            checked={isDarkMode}
                            onChange={handleThemeToggle}
                        />
                        <span className="toggle-slider"></span>
                        <div className="toggle-icons">
                            <i className="fas fa-sun"></i>
                            <i className="fas fa-moon"></i>
                        </div>
                    </label>
                </header>

                <div className="search-filter-container">
                    <div className="search-box">
                        <i className="fas fa-search"></i>
                        <input 
                            type="text" 
                            placeholder="Search by name, department, building, or room..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    
                    {currentUser && currentUser.type === 'teacher' && (
        <div className="teacher-actions">
            <button className="add-teacher-btn" onClick={handleAddTeacher}>
                <i className="fas fa-plus"></i> Add Teacher
            </button>
        </div>
    )}
                </div>

                <div className="teacher-seating-grid">
                    {filteredTeachers.length > 0 ? (
                        filteredTeachers.map(teacher => (
                            <div key={teacher.id} className="teacher-seating-card">
                            {currentUser && currentUser.type === 'teacher' && (
        <button 
            className="edit-teacher-btn" 
            onClick={() => handleEditTeacher(teacher)}
        >
            <i className="fas fa-edit"></i>
        </button>
    )}
                                <div className="teacher-photo">
                                    <div className="photo-placeholder">
                                        <i className="fas fa-user-tie"></i>
                                    </div>
                                </div>
                                <div className="teacher-seating-details">
                                    <h3>{teacher.name}</h3>
                                    <p><i className="fas fa-building"></i> Department: {teacher.department}</p>
                                    <div className="location-info">
                                        <p><i className="fas fa-map-marker-alt"></i> Building: {teacher.building}</p>
                                        <p><i className="fas fa-door-open"></i> Room: {teacher.roomNumber}</p>
                                    </div>
                                    <div className="contact-info">
                                        <p><i className="fas fa-envelope"></i> {teacher.email}</p>
                                        <p><i className="fas fa-phone"></i> {teacher.phone}</p>
                                    </div>
                                    {teacher.notes && <p className="special-note"><i className="fas fa-info-circle"></i> {teacher.notes}</p>}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-results">
                            <i className="fas fa-search"></i>
                            <p>No faculty found matching your search criteria.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal for Add/Edit Teacher */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{editingTeacher ? 'Edit Teacher Information' : 'Add New Teacher'}</h2>
                            <button className="close-modal" onClick={() => setIsModalOpen(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Full Name:</label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="department">Department:</label>
                                <input 
                                    type="text" 
                                    id="department" 
                                    name="department"
                                    value={formData.department}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="building">Building:</label>
                                    <input 
                                        type="text" 
                                        id="building" 
                                        name="building"
                                        value={formData.building}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="floor">Floor (optional):</label>
                                    <input 
                                        type="text" 
                                        id="floor" 
                                        name="floor"
                                        value={formData.floor}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="roomNumber">Room Number:</label>
                                    <input 
                                        type="text" 
                                        id="roomNumber" 
                                        name="roomNumber"
                                        value={formData.roomNumber}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="email">Email:</label>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Phone:</label>
                                    <input 
                                        type="tel" 
                                        id="phone" 
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-buttons">
                                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="submit-btn">
                                    {editingTeacher ? 'Update' : 'Add'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TeacherSeating;