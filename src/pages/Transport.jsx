import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './css/Transport.css';

function Transport() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    // State to track which stops are flipped to evening view
    const [flippedStops, setFlippedStops] = useState({});
    // New state for pinned routes
    const [pinnedRoutes, setPinnedRoutes] = useState([]);
    // State to control which tab is active
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'pinned'
    const navigate = useNavigate();
    const { currentUser } = useAuth();

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

        // Load pinned routes from localStorage if the user is logged in
        if (currentUser) {
            // Load pinned routes from localStorage
            const savedPinnedRoutes = localStorage.getItem(`pinnedRoutes_${currentUser.uid}`);
            if (savedPinnedRoutes) {
                setPinnedRoutes(JSON.parse(savedPinnedRoutes));
            }
        }

    }, [currentUser]);

    // Effect to auto-expand routes when searching for stops
    useEffect(() => {
        if (searchTerm) {
            const searchTermLower = searchTerm.toLowerCase();
            // Find routes that have stops matching the search term
            const routesWithMatchingStops = busRoutes.filter(route => 
                route.stops.some(stop => stop.location.toLowerCase().includes(searchTermLower))
            );
            
            // If we found routes with matching stops, select the first one
            if (routesWithMatchingStops.length > 0) {
                setSelectedRoute(routesWithMatchingStops[0].id);
            }
        }
    }, [searchTerm]);

    // Handle theme toggle
    const handleThemeToggle = () => {
        const newTheme = isDarkMode ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        setIsDarkMode(!isDarkMode);
    };

    // Go back to home
    const goToHome = () => {
        navigate('/');
    };

    // Select a route to view details
    const handleRouteSelect = (route) => {
        setSelectedRoute(route === selectedRoute ? null : route);
        // Reset flipped stops when collapsing or changing routes
        if (route !== selectedRoute) {
            setFlippedStops({});
        }
    };

    // Toggle flip state for a stop
    const toggleFlip = (stopIndex) => {
        setFlippedStops(prevState => ({
            ...prevState,
            [stopIndex]: !prevState[stopIndex]
        }));
    };

    // Toggle all stops in a route
    const toggleAllStops = (routeId, showEvening) => {
        const route = busRoutes.find(r => r.id === routeId);
        if (!route) return;

        const newFlippedState = {};
        route.stops.forEach((_, index) => {
            newFlippedState[index] = showEvening;
        });

        setFlippedStops(newFlippedState);
    };

    // Toggle a route as pinned
    const togglePinRoute = (routeId) => {
        if (!currentUser) {
            alert('Please log in to pin routes');
            return;
        }

        let newPinnedRoutes;

        if (pinnedRoutes.includes(routeId)) {
            newPinnedRoutes = pinnedRoutes.filter(id => id !== routeId);
        } else {
            newPinnedRoutes = [...pinnedRoutes, routeId];
        }

        setPinnedRoutes(newPinnedRoutes);
        localStorage.setItem(`pinnedRoutes_${currentUser.uid}`, JSON.stringify(newPinnedRoutes));
    };

    // Check if a route is pinned
    const isRoutePinned = (routeId) => {
        return pinnedRoutes.includes(routeId);
    };

    // Filter routes based on unified search
    const filteredRoutes = busRoutes.filter(route => {
        // If no search term, show all routes
        if (!searchTerm) return true;

        const searchTermLower = searchTerm.toLowerCase();

        // Search by route name
        if (route.name.toLowerCase().includes(searchTermLower)) {
            return true;
        }

        // Search by stop location
        return route.stops.some(stop =>
            stop.location.toLowerCase().includes(searchTermLower)
        );
    });

    // Get routes based on current filters and tab
    const getDisplayedRoutes = () => {
        let routes = filteredRoutes;

        // If on pinned tab, only show pinned routes
        if (activeTab === 'pinned') {
            routes = routes.filter(route => pinnedRoutes.includes(route.id));
        }

        return routes;
    };

    const displayedRoutes = getDisplayedRoutes();

    // Handle search input change
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
    };

    // Highlight matching text in routes or stops
    const highlightMatch = (text) => {
        if (!searchTerm) return text;

        const searchTermLower = searchTerm.toLowerCase();
        if (text.toLowerCase().includes(searchTermLower)) {
            const index = text.toLowerCase().indexOf(searchTermLower);
            return (
                <>
                    {text.substring(0, index)}
                    <span className="highlighted-text">
                        {text.substring(index, index + searchTerm.length)}
                    </span>
                    {text.substring(index + searchTerm.length)}
                </>
            );
        }
        return text;
    };

    return (
        <div className="page">
            <div className="bg"></div>
            <div className="bg bg2"></div>
            <div className="bg bg3"></div>

            <div className="container">
                <header>
                    <button className="back-home-button" onClick={goToHome}>
                        Back To Home
                    </button>
                    <div className="logo">
                        Campus Transport
                    </div>
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

                <div className="transport-container">
                    <div className="search-filters">
                        <div className="search-row">
                            <div className="search-bar">
                                <i className="fas fa-search"></i>
                                <input
                                    type="text"
                                    placeholder="Search by route or stop name..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tab selector */}
                    <div className="route-tabs">
                        <button
                            className={`route-tab ${activeTab === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveTab('all')}
                        >
                            <i className="fas fa-list"></i> All Routes
                        </button>
                        <button
                            className={`route-tab ${activeTab === 'pinned' ? 'active' : ''}`}
                            onClick={() => setActiveTab('pinned')}
                        >
                            <i className="fas fa-thumbtack"></i> Pinned Routes
                            {pinnedRoutes.length > 0 && <span className="pin-count">{pinnedRoutes.length}</span>}
                        </button>
                    </div>

                    <div className="routes-container">
                        <h3>
                            {activeTab === 'all' ? (
                                <><i className="fas fa-route"></i> Bus Routes</>
                            ) : (
                                <><i className="fas fa-thumbtack"></i> Pinned Routes</>
                            )}
                            {searchTerm && (
                                <span className="search-info">
                                    (Searching for "{searchTerm}")
                                </span>
                            )}
                        </h3>

                        {displayedRoutes.length === 0 ? (
                            <div className="no-routes">
                                <i className="fas fa-exclamation-circle"></i>
                                {activeTab === 'pinned' ?
                                    'No pinned routes found. Pin your frequently used routes for quick access.' :
                                    'No routes found matching your criteria'}
                            </div>
                        ) : (
                            displayedRoutes.map(route => (
                                <div
                                    key={route.id}
                                    className={`route-card ${selectedRoute === route.id ? 'expanded' : ''}`}
                                    style={{ borderLeft: `5px solid ${route.color}` }}
                                >
                                    <div
                                        className="route-header"
                                        onClick={() => handleRouteSelect(route.id)}
                                    >
                                        <div className="route-name">
                                            <i className="fas fa-bus"></i> {highlightMatch(route.name)}
                                        </div>
                                        <div className="route-info">
                                            <span>{route.stops.length} stops</span>
                                            {currentUser && (
                                                <button
                                                    className={`pin-route-btn ${isRoutePinned(route.id) ? 'pinned' : ''}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        togglePinRoute(route.id);
                                                    }}
                                                    title={isRoutePinned(route.id) ? "Unpin this route" : "Pin this route"}
                                                >
                                                    <i className="fas fa-thumbtack"></i>
                                                </button>
                                            )}
                                            <i className={`fas fa-chevron-${selectedRoute === route.id ? 'up' : 'down'}`}></i>
                                        </div>
                                    </div>

                                    {selectedRoute === route.id && (
                                        <div className="route-details">
                                            <div className="schedule-toggle-buttons">
                                                <button
                                                    className="schedule-toggle-btn morning-btn"
                                                    onClick={() => toggleAllStops(route.id, false)}
                                                >
                                                    <i className="fas fa-sun"></i> Show All Morning
                                                </button>
                                                <button
                                                    className="schedule-toggle-btn evening-btn"
                                                    onClick={() => toggleAllStops(route.id, true)}
                                                >
                                                    <i className="fas fa-moon"></i> Show All Evening
                                                </button>
                                            </div>

                                            <div className="route-stops-container">
                                                {route.stops.map((stop, index) => {
                                                    const isFlipped = flippedStops[index];
                                                    const hasEvening = !!stop.times.evening;
                                                    const isMatchingStop = searchTerm &&
                                                        stop.location.toLowerCase().includes(searchTerm.toLowerCase());

                                                    return (
                                                        <div
                                                            className={`stop-card ${isMatchingStop ? 'highlighted-stop' : ''}`}
                                                            key={index}
                                                        >
                                                            <div className={`flip-card ${isFlipped ? 'flipped' : ''}`}>
                                                                <div className="flip-card-inner">
                                                                    {/* Front side (Morning) */}
                                                                    <div className="flip-card-front">
                                                                        <div className="stop-marker">
                                                                            <div className="stop-point"></div>
                                                                            {index < route.stops.length - 1 && <div className="stop-line"></div>}
                                                                        </div>
                                                                        <div className="stop-details">
                                                                            <div className="stop-location">
                                                                                {highlightMatch(stop.location)}
                                                                            </div>
                                                                            <div className="time-content">
                                                                                <div className="time-info">
                                                                                    <div className="time-section-header">
                                                                                        <i className="fas fa-sun"></i> Morning
                                                                                    </div>
                                                                                    <div className="stop-time">{stop.times.morning}</div>
                                                                                </div>
                                                                                {hasEvening && (
                                                                                    <button
                                                                                        className="flip-button"
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            toggleFlip(index);
                                                                                        }}
                                                                                    >
                                                                                        <i className="fas fa-exchange-alt"></i> Evening
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Back side (Evening) */}
                                                                    {hasEvening && (
                                                                        <div className="flip-card-back">
                                                                            <div className="stop-marker">
                                                                                <div className="stop-point"></div>
                                                                                {index < route.stops.length - 1 && <div className="stop-line"></div>}
                                                                            </div>
                                                                            <div className="stop-details">
                                                                                <div className="stop-location">
                                                                                    {highlightMatch(stop.location)}
                                                                                </div>
                                                                                <div className="time-content">
                                                                                    <div className="time-info">
                                                                                        <div className="time-section-header">
                                                                                            <i className="fas fa-moon"></i> Evening
                                                                                        </div>
                                                                                        <div className="stop-time">{stop.times.evening}</div>
                                                                                    </div>
                                                                                    <button
                                                                                        className="flip-button"
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            toggleFlip(index);
                                                                                        }}
                                                                                    >
                                                                                        <i className="fas fa-exchange-alt"></i> Morning
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
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

const busRoutes = [
    {
        id: 'a1-ar',
        name: 'A1-Ar',
        color: '#ffcccb',
        stops: [
            {
                location: 'Chapshedi Chowk',
                times: { morning: '6:55', evening: '6:05' }
            },
            {
                location: 'Lokmanya Hospital',
                times: { morning: '7:25', evening: '5:35' }
            },
            {
                location: 'Kharadi Corner',
                times: { morning: '7:35', evening: '5:25' }
            },
            {
                location: 'Reliance Mart, Kharadi',
                times: { morning: '7:40', evening: '5:20' }
            },
            {
                location: 'Sainath Nagar Chowk',
                times: { morning: '7:45', evening: '5:15' }
            },
            {
                location: 'Mundhawa Chowk',
                times: { morning: '7:50', evening: '5:10' }
            },
            {
                location: 'Kirtane Baug',
                times: { morning: '7:55', evening: '5:05' }
            },
            {
                location: 'MIT Loni Campus',
                times: { morning: '8:15', evening: '4:45' }
            }
        ]
    },
    {
        id: 'b1-ar',
        name: 'B1-Ar',
        color: '#c1e1c5',
        stops: [
            {
                location: '509 Chowk',
                times: { morning: '7:10', evening: '5:50' }
            },
            {
                location: 'Nagpur Chwal',
                times: { morning: '7:15', evening: '5:45' }
            },
            {
                location: 'Tridel Hsg. Society',
                times: { morning: '7:20', evening: '5:40' }
            },
            {
                location: 'Shashtrinagar Chowk',
                times: { morning: '7:22', evening: '5:38' }
            },
            {
                location: 'Ramwadi (Near Po.stn)',
                times: { morning: '7:25', evening: '5:35' }
            },
            {
                location: 'Chandan nagar Bus Stop',
                times: { morning: '7:30', evening: '5:30' }
            },
            {
                location: 'Season Mall hadpsar',
                times: { morning: '7:35', evening: '5:25' }
            },
            {
                location: 'MIT Loni Campus',
                times: { morning: '8:15', evening: '4:45' }
            }
        ]
    },
    {
        id: 'b2-ar',
        name: 'B2-Ar',
        color: '#ffeb99',
        stops: [
            {
                location: 'Lohegaon PMT Bus Stop',
                times: { morning: '7:00', evening: '6:00' }
            },
            {
                location: 'Kendra Vidyahlaya',
                times: { morning: '7:05', evening: '5:55' }
            },
            {
                location: 'Khese Park',
                times: { morning: '7:10', evening: '5:50' }
            },
            {
                location: 'Kalwad',
                times: { morning: '7:15', evening: '5:45' }
            },
            {
                location: 'Symbiosis Law College',
                times: { morning: '7:20', evening: '5:40' }
            },
            {
                location: 'Ramwadi Police St.',
                times: { morning: '7:25', evening: '5:35' }
            },
            {
                location: 'Novotel-hyat Hotel',
                times: { morning: '7:30', evening: '5:30' }
            },
            {
                location: 'Fmix Mall',
                times: { morning: '7:35', evening: '5:25' }
            },
            {
                location: 'Tata Guard room',
                times: { morning: '7:40', evening: '5:20' }
            },
            {
                location: 'Chandan Nagar',
                times: { morning: '7:45', evening: '5:15' }
            },
            {
                location: 'Mundwa',
                times: { morning: '7:50', evening: '5:10' }
            },
            {
                location: 'Nobel Hospital',
                times: { morning: '7:55', evening: '5:05' }
            },
            {
                location: 'Hadapsar',
                times: { morning: '8:00', evening: '5:00' }
            },
            {
                location: 'MIT Campus Loni',
                times: { morning: '8:15', evening: '4:45' }
            }
        ]
    },
    {
        id: 'b3-tr',
        name: 'B3-Tr',
        color: '#b3d9ff',
        stops: [
            {
                location: 'Mohan',
                times: { morning: '7:00', evening: '6:00' }
            },
            {
                location: 'Bharatmata Chowk',
                times: { morning: '7:05', evening: '5:55' }
            },
            {
                location: 'Pratisthan Chowk',
                times: { morning: '7:10', evening: '5:50' }
            },
            {
                location: 'Alankar MIT College',
                times: { morning: '7:15', evening: '5:45' }
            },
            {
                location: 'Charoli Phata',
                times: { morning: '7:20', evening: '5:40' }
            },
            {
                location: 'Vadmukwadi',
                times: { morning: '7:22', evening: '5:38' }
            },
            {
                location: 'Padukar Mandir',
                times: { morning: '7:25', evening: '5:35' }
            },
            {
                location: 'Magrpatta Chowk',
                times: { morning: '7:28', evening: '5:32' }
            },
            {
                location: 'Dattanagar Dighi',
                times: { morning: '7:30', evening: '5:30' }
            },
            {
                location: 'Parandre Nagar',
                times: { morning: '7:31', evening: '5:29' }
            },
            {
                location: 'HP Pump',
                times: { morning: '7:32', evening: '5:28' }
            },
            {
                location: 'Jakat Naka',
                times: { morning: '7:32', evening: '5:27' }
            },
            {
                location: 'Maske wasti',
                times: { morning: '7:33', evening: '5:26' }
            },
            {
                location: 'Shivaji Chowk',
                times: { morning: '7:34', evening: '5:25' }
            },
            {
                location: 'Vishrant Wadi',
                times: { morning: '7:35', evening: '5:20' }
            },
            {
                location: 'Sawant Petrol Pump',
                times: { morning: '7:40', evening: '5:15' }
            },
            {
                location: 'Gurudwara,Tingare nagar',
                times: { morning: '7:45', evening: '5:10' }
            },
            {
                location: 'Shastri Chowk',
                times: { morning: '7:50', evening: '5:05' }
            },
            {
                location: 'Market nagar By pass',
                times: { morning: '7:52', evening: '5:03' }
            },
            {
                location: 'Koregaon Park',
                times: { morning: '7:55', evening: '5:00' }
            },
            {
                location: 'Passport Office Chowk',
                times: { morning: '7:56', evening: '4:59' }
            },
            {
                location: 'Magarpatta',
                times: { morning: '7:58', evening: '4:57' }
            },
            {
                location: 'Hadapsar Gaothan',
                times: { morning: '8:00', evening: '4:55' }
            },
            {
                location: 'MIT Campus Loni',
                times: { morning: '8:15', evening: '4:45' }
            }
        ]
    },
    {
        id: 'c3-tr',
        name: 'C3-Tr',
        color: '#d2b48c',
        stops: [
            {
                location: 'Karvenagar',
                times: { morning: '7:00', evening: '6:00' }
            },
            {
                location: 'Vikas Chowk',
                times: { morning: '7:05', evening: '5:55' }
            },
            {
                location: 'Pansare Chowk',
                times: { morning: '7:08', evening: '5:52' }
            },
            {
                location: 'Vittal Mandir',
                times: { morning: '7:10', evening: '5:50' }
            },
            {
                location: 'Sarasbaug Jaishree Garden',
                times: { morning: '7:15', evening: '5:45' }
            },
            {
                location: 'Swargate ST Depot',
                times: { morning: '7:18', evening: '5:42' }
            },
            {
                location: 'Poolgate',
                times: { morning: '7:25', evening: '5:35' }
            },
            {
                location: 'Vaduwadi',
                times: { morning: '7:30', evening: '5:30' }
            },
            {
                location: 'Vaibhav takies',
                times: { morning: '7:35', evening: '5:25' }
            },
            {
                location: 'Hadapsar',
                times: { morning: '7:40', evening: '5:20' }
            },
            {
                location: '15 No. Hadapsar',
                times: { morning: '8:00', evening: '5:00' }
            },
            {
                location: 'Sewalwadi Ford Shoroom',
                times: { morning: '8:10', evening: '4:50' }
            },
            {
                location: 'MIT Campus',
                times: { morning: '8:15', evening: '4:45' }
            }
        ]
    },
    {
        id: 'd3-ar',
        name: 'D3-Ar',
        color: '#d6a2e8',
        stops: [
            {
                location: 'Hole wasti',
                times: { morning: '7:00', evening: '6:00' }
            },
            {
                location: 'Undri chowk',
                times: { morning: '7:15', evening: '5:45' }
            },
            {
                location: 'Handewadi-D mart',
                times: { morning: '7:20', evening: '5:40' }
            },
            {
                location: 'Gaurav Hotel-Bhekrai Nagar',
                times: { morning: '7:30', evening: '5:30' }
            },
            {
                location: 'Shani Mandir-tuski darshan',
                times: { morning: '7:40', evening: '5:20' }
            },
            {
                location: 'Gaadiarti-hadapsar',
                times: { morning: '8:00', evening: '5:00' }
            },
            {
                location: 'Shiwalwadi',
                times: { morning: '8:05', evening: '4:55' }
            },
            {
                location: 'MIT Campus-Loni',
                times: { morning: '8:15', evening: '4:45' }
            }
        ]
    },
    {
        id: 'e1-tr',
        name: 'E1-Tr',
        color: '#fff59d',
        stops: [
            {
                location: 'Aundh -Medi Point',
                times: { morning: '6:50', evening: '6:10' }
            },
            {
                location: 'Balewadi Phata',
                times: { morning: '6:55', evening: '6:05' }
            },
            {
                location: 'Pancard Club (Baner)',
                times: { morning: '7:00', evening: '6:00' }
            },
            {
                location: 'Big Bazar-Baner',
                times: { morning: '7:05', evening: '5:55' }
            },
            {
                location: 'Mahabaleshwar Hotel',
                times: { morning: '7:10', evening: '5:50' }
            },
            {
                location: 'Baner Phata',
                times: { morning: '7:15', evening: '5:45' }
            },
            {
                location: 'Crossword',
                times: { morning: '7:18', evening: '5:42' }
            },
            {
                location: 'ITI road Aundh',
                times: { morning: '7:20', evening: '5:40' }
            },
            {
                location: 'Parihar Chowk Aundh',
                times: { morning: '7:21', evening: '5:39' }
            },
            {
                location: 'Bremen Chowk',
                times: { morning: '7:25', evening: '5:35' }
            },
            {
                location: 'Shivaji Nagar chowk/bus stop',
                times: { morning: '7:30', evening: '5:30' }
            },
            {
                location: 'Bund Garden',
                times: { morning: '7:38', evening: '5:22' }
            },
            {
                location: 'SGS Mall -Pune Camp',
                times: { morning: '7:45', evening: '5:15' }
            },
            {
                location: 'Dr. Ambedkar Putula',
                times: { morning: '7:50', evening: '5:10' }
            },
            {
                location: 'Fatimanagar',
                times: { morning: '8:00', evening: '5:00' }
            },
            {
                location: 'Hadapsar',
                times: { morning: '8:05', evening: '4:55' }
            },
            {
                location: 'MIT Campus Loni',
                times: { morning: '8:15', evening: '4:45' }
            }
        ]
    },
    {
        id: 'f1-ar',
        name: 'F1-Ar',
        color: '#c8e6c9',
        stops: [
            {
                location: 'Santosh Hall (F1) Students',
                times: { morning: '7:20', evening: '5:40' }
            },
            {
                location: 'Ranka Jewellers',
                times: { morning: '7:35', evening: '5:25' }
            },
            {
                location: 'MIT Loni Campus',
                times: { morning: '8:15', evening: '4:45' }
            }
        ]
    },
    {
        id: 'f-ar',
        name: 'F-Ar',
        color: '#ffccbc',
        stops: [
            {
                location: 'Nanded City',
                times: { morning: '7:15', evening: '5:45' }
            },
            {
                location: 'Dhayari Phata',
                times: { morning: '7:30', evening: '5:30' }
            },
            {
                location: 'Abhiruchi Multiplex',
                times: { morning: '7:35', evening: '5:25' }
            },
            {
                location: 'Swargate',
                times: { morning: '7:45', evening: '5:15' }
            },
            {
                location: 'Hadapsar',
                times: { morning: '8:00', evening: '5:00' }
            },
            {
                location: 'MIT Campus Loni',
                times: { morning: '8:15', evening: '4:45' }
            }
        ]
    },
    {
        id: 'g-ar',
        name: 'G-Ar',
        color: '#b2dfdb',
        stops: [
            {
                location: 'Wagholi-ivy society Gate',
                times: { morning: '7:00', evening: '6:00' }
            },
            {
                location: 'Kesnand phata',
                times: { morning: '7:10', evening: '5:50' }
            },
            {
                location: 'Wagheshwar Mandir',
                times: { morning: '7:15', evening: '5:45' }
            },
            {
                location: 'Soyrik Mangal karalay',
                times: { morning: '7:20', evening: '5:40' }
            },
            {
                location: 'Ubale nagar',
                times: { morning: '7:25', evening: '5:35' }
            },
            {
                location: 'Sadul Baba Durga',
                times: { morning: '7:30', evening: '5:30' }
            },
            {
                location: 'choudhuri wasti',
                times: { morning: '7:35', evening: '5:25' }
            },
            {
                location: 'Kharadi by pass',
                times: { morning: '7:40', evening: '5:20' }
            },
            {
                location: 'Amanora mall',
                times: { morning: '7:45', evening: '5:15' }
            },
            {
                location: 'Noble hospital',
                times: { morning: '7:48', evening: '5:12' }
            },
            {
                location: 'Vaibhav theater',
                times: { morning: '7:55', evening: '5:05' }
            },
            {
                location: 'Hadapsar -15 no.',
                times: { morning: '8:00', evening: '5:00' }
            },
            {
                location: 'MIT CAMPUS',
                times: { morning: '8:15', evening: '4:45' }
            }
        ]
    },
    {
        id: 'h1-tr',
        name: 'H1-Tr',
        color: '#ffcc80',
        stops: [
            {
                location: 'Datta Nagar-Katraj',
                times: { morning: '7:00', evening: '6:00' }
            },
            {
                location: 'Wonder City',
                times: { morning: '7:05', evening: '5:55' }
            },
            {
                location: 'Katraj Chowk',
                times: { morning: '7:10', evening: '5:50' }
            },
            {
                location: 'Bharti Vidyapeeth',
                times: { morning: '7:15', evening: '5:45' }
            },
            {
                location: 'Kumar Park',
                times: { morning: '7:20', evening: '5:40' }
            },
            {
                location: 'Gangadham Chowk',
                times: { morning: '7:30', evening: '5:30' }
            },
            {
                location: 'Parshi Colony',
                times: { morning: '7:35', evening: '5:25' }
            },
            {
                location: 'Lulla Nagar',
                times: { morning: '7:40', evening: '5:20' }
            },
            {
                location: 'Jagtap Chowk',
                times: { morning: '7:55', evening: '5:05' }
            },
            {
                location: 'Sanskruti Hall',
                times: { morning: '8:00', evening: '5:00' }
            },
            {
                location: 'Fatima nagar',
                times: { morning: '8:05', evening: '4:55' }
            },
            {
                location: 'Hadapsar',
                times: { morning: '8:08', evening: '4:52' }
            },
            {
                location: 'MIT campus Loni',
                times: { morning: '8:15', evening: '4:45' }
            }
        ]
    },
    {
        id: 'h2-ar',
        name: 'H2-Ar',
        color: '#b3e5fc',
        stops: [
            {
                location: 'Navale Bridge',
                times: { morning: '7:00', evening: '6:00' }
            },
            {
                location: 'Poddar School',
                times: { morning: '7:10', evening: '5:50' }
            },
            {
                location: 'Hyundai showroom',
                times: { morning: '7:20', evening: '5:40' }
            },
            {
                location: 'Abhinav School',
                times: { morning: '7:25', evening: '5:35' }
            },
            {
                location: 'Walvekar loans',
                times: { morning: '7:35', evening: '5:25' }
            },
            {
                location: 'MIT CAMPUS',
                times: { morning: '8:15', evening: '4:45' }
            }
        ]
    },
    {
        id: 'n1-tr',
        name: 'N1-Tr',
        color: '#e6ee9c',
        stops: [
            {
                location: 'Balaji Nagar',
                times: { morning: '7:00', evening: '6:00' }
            },
            {
                location: 'KK Market',
                times: { morning: '7:35', evening: '5:25' }
            },
            {
                location: 'Mahesh Society',
                times: { morning: '7:40', evening: '5:20' }
            },
            {
                location: 'Chandralok Hospital',
                times: { morning: '7:45', evening: '5:15' }
            },
            {
                location: 'Kalyan Bhat',
                times: { morning: '7:50', evening: '5:10' }
            },
            {
                location: 'MIT Campus Loni',
                times: { morning: '8:15', evening: '4:45' }
            }
        ]
    },
    {
        id: 'n2-ar',
        name: 'N2-Ar',
        color: '#f48fb1',
        stops: [
            {
                location: 'Mitra mandir chowk',
                times: { morning: '7:00', evening: '6:00' }
            },
            {
                location: 'Lakshmi Narayan Chowk',
                times: { morning: '7:20', evening: '5:40' }
            },
            {
                location: 'Panchami hotel',
                times: { morning: '7:30', evening: '5:30' }
            },
            {
                location: 'City Pride Chowk',
                times: { morning: '7:35', evening: '5:25' }
            },
            {
                location: 'Gangadham Chowk',
                times: { morning: '7:45', evening: '5:15' }
            },
            {
                location: 'MIT Campus Loni',
                times: { morning: '8:15', evening: '4:45' }
            }
        ]
    },
    {
        id: 'i1-tr',
        name: 'I1-Tr',
        color: '#80deea',
        stops: [
            {
                location: 'Uttam Nagar -Warje',
                times: { morning: '7:00', evening: '6:00' }
            },
            {
                location: 'Tingale Corner',
                times: { morning: '7:05', evening: '5:55' }
            },
            {
                location: 'Rahul Nagar',
                times: { morning: '7:10', evening: '5:50' }
            },
            {
                location: 'Shivne Petrol Pump',
                times: { morning: '7:12', evening: '5:48' }
            },
            {
                location: 'Ganpati Matha',
                times: { morning: '7:15', evening: '5:45' }
            },
            {
                location: 'Malwadi',
                times: { morning: '7:18', evening: '5:42' }
            },
            {
                location: 'Dr. Ambedkar Chowk',
                times: { morning: '7:20', evening: '5:40' }
            },
            {
                location: 'Kakade City',
                times: { morning: '7:22', evening: '5:38' }
            },
            {
                location: 'Karve Statue',
                times: { morning: '7:25', evening: '5:35' }
            },
            {
                location: 'Bajaram Bridge Corner',
                times: { morning: '7:30', evening: '5:30' }
            },
            {
                location: 'Okayama Garden',
                times: { morning: '7:33', evening: '5:27' }
            },
            {
                location: 'Nirmitee Showroom',
                times: { morning: '7:35', evening: '5:25' }
            },
            {
                location: 'Dattawadi Corner',
                times: { morning: '7:40', evening: '5:20' }
            },
            {
                location: 'Dandekar Bridge',
                times: { morning: '7:42', evening: '5:18' }
            },
            {
                location: 'Sarasbaug',
                times: { morning: '7:45', evening: '5:15' }
            },
            {
                location: 'Poolgate',
                times: { morning: '7:50', evening: '5:10' }
            },
            {
                location: 'Fatimanagar',
                times: { morning: '7:55', evening: '5:05' }
            },
            {
                location: 'Hadapsar',
                times: { morning: '8:00', evening: '5:00' }
            },
            {
                location: 'MIT campus Loni',
                times: { morning: '8:15', evening: '4:45' }
            }
        ]
    },
    {
        id: 't1-tr',
        name: 'T1-Tr',
        color: '#ce93d8',
        stops: [
            {
                location: 'Dahanukar colony',
                times: { morning: '7:00', evening: '6:00' }
            },
            {
                location: 'Nal stop (Karve Rd.)',
                times: { morning: '7:05', evening: '5:55' }
            },
            {
                location: 'Garware college',
                times: { morning: '7:10', evening: '5:50' }
            },
            {
                location: 'Deccon corner',
                times: { morning: '7:15', evening: '5:45' }
            },
            {
                location: 'Alka chowk',
                times: { morning: '7:20', evening: '5:40' }
            },
            {
                location: 'Ganjlawe chowk',
                times: { morning: '7:25', evening: '5:35' }
            },
            {
                location: 'Lokmanya Nagar',
                times: { morning: '7:30', evening: '5:30' }
            },
            {
                location: 'Seven Loves Chowk',
                times: { morning: '7:30', evening: '5:30' }
            },
            {
                location: 'Fatima Nagar',
                times: { morning: '7:35', evening: '5:25' }
            },
            {
                location: 'Crome Mall',
                times: { morning: '7:40', evening: '5:20' }
            },
            {
                location: 'MIT Loni Campus',
                times: { morning: '8:15', evening: '4:45' }
            }
        ]
    }
];

export default Transport;