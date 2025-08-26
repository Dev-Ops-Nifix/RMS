import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  FileText,
  BarChart2,
  Trophy,
  MessageCircle,
  Calendar,
  HelpCircle,
  LogOut,
  Bell,
  Plus,
  ArrowLeft,
  Menu,
  X,
} from 'lucide-react';
import './Performance.css';

const Performance = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [selectedClassSection, setSelectedClassSection] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true); // New state for sidebar
  useEffect(() => {
    const savedSidebarState = localStorage.getItem('sidebarCollapsed');
    if (savedSidebarState !== null) {
      setIsSidebarExpanded(savedSidebarState === 'false');
    }
  }, []);
  const classSections = [
    {
      name: '1-A',
      students: [
        { id: 1, name: 'John Doe', grade: 'A', marks: 'IX' },
        { id: 2, name: 'Jane Smith', grade: 'B', marks: 'VIII' },
      ],
      performanceData: [
        { subject: 'Mathematics', pass: 50, average: 85 },
        { subject: 'Science', pass: 55, average: 82 },
        { subject: 'English', pass: 60, average: 88 },
        { subject: 'History', pass: 65, average: 90 },
        { subject: 'Geography', pass: 70, average: 75 },
        { subject: 'Physics', pass: 75, average: 80 },
      ],
    },
    {
      name: '1-B',
      students: [
        { id: 3, name: 'Alex Brown', grade: 'C', marks: 'VII' },
        { id: 4, name: 'Chris Green', grade: 'D', marks: 'VI' },
      ],
      performanceData: [
        { subject: 'Mathematics', pass: 75, average: 78 },
        { subject: 'Science', pass: 80, average: 85 },
        { subject: 'English', pass: 70, average: 72 },
        { subject: 'History', pass: 65, average: 68 },
        { subject: 'Geography', pass: 60, average: 70 },
        { subject: 'Physics', pass: 55, average: 65 },
      ],
    },
    {
      name: '1-C',
      students: [
        { id: 5, name: 'Emma Wilson', grade: 'A', marks: 'X' },
        { id: 6, name: 'Liam Davis', grade: 'B', marks: 'IX' },
      ],
      performanceData: [
        { subject: 'Mathematics', pass: 90, average: 92 },
        { subject: 'Science', pass: 85, average: 88 },
        { subject: 'English', pass: 80, average: 85 },
        { subject: 'History', pass: 75, average: 80 },
        { subject: 'Geography', pass: 70, average: 78 },
        { subject: 'Physics', pass: 65, average: 75 },
      ],
    },
    {
      name: '2-A',
      students: [
        { id: 7, name: 'Olivia Taylor', grade: 'C', marks: 'VIII' },
        { id: 8, name: 'Noah Miller', grade: 'B', marks: 'VII' },
      ],
      performanceData: [
        { subject: 'Mathematics', pass: 65, average: 80 },
        { subject: 'Science', pass: 70, average: 85 },
        { subject: 'English', pass: 75, average: 88 },
        { subject: 'History', pass: 80, average: 90 },
        { subject: 'Geography', pass: 85, average: 92 },
        { subject: 'Physics', pass: 90, average: 95 },
      ],
    },
    {
      name: '2-B',
      students: [
        { id: 9, name: 'Sophia Lee', grade: 'D', marks: 'VI' },
        { id: 10, name: 'Mason Clark', grade: 'C', marks: 'V' },
      ],
      performanceData: [
        { subject: 'Mathematics', pass: 80, average: 75 },
        { subject: 'Science', pass: 75, average: 70 },
        { subject: 'English', pass: 70, average: 65 },
        { subject: 'History', pass: 65, average: 60 },
        { subject: 'Geography', pass: 60, average: 55 },
        { subject: 'Physics', pass: 55, average: 50 },
      ],
    },
    {
      name: '2-C',
      students: [
        { id: 11, name: 'Isabella Adams', grade: 'B', marks: 'VIII' },
        { id: 12, name: 'Ethan King', grade: 'A', marks: 'IX' },
      ],
      performanceData: [
        { subject: 'Mathematics', pass: 70, average: 87 },
        { subject: 'Science', pass: 65, average: 85 },
        { subject: 'English', pass: 60, average: 82 },
        { subject: 'History', pass: 55, average: 80 },
        { subject: 'Geography', pass: 50, average: 78 },
        { subject: 'Physics', pass: 45, average: 75 },
      ],
    },
    {
      name: '3-A',
      students: [
        { id: 13, name: 'Ava Scott', grade: 'A', marks: 'X' },
        { id: 14, name: 'James Hall', grade: 'B', marks: 'IX' },
      ],
      performanceData: [
        { subject: 'Mathematics', pass: 60, average: 82 },
        { subject: 'Science', pass: 65, average: 85 },
        { subject: 'English', pass: 70, average: 88 },
        { subject: 'History', pass: 75, average: 90 },
        { subject: 'Geography', pass: 80, average: 92 },
        { subject: 'Physics', pass: 85, average: 95 },
      ],
    },
    {
      name: '3-B',
      students: [
        { id: 15, name: 'Mia Young', grade: 'C', marks: 'VIII' },
        { id: 16, name: 'Lucas Hill', grade: 'D', marks: 'VII' },
      ],
      performanceData: [
        { subject: 'Mathematics', pass: 70, average: 75 },
        { subject: 'Science', pass: 65, average: 70 },
        { subject: 'English', pass: 60, average: 65 },
        { subject: 'History', pass: 55, average: 60 },
        { subject: 'Geography', pass: 50, average: 55 },
        { subject: 'Physics', pass: 45, average: 50 },
      ],
    },
    {
      name: '3-C',
      students: [
        { id: 17, name: 'Charlotte Evans', grade: 'B', marks: 'IX' },
        { id: 18, name: 'Henry Wright', grade: 'A', marks: 'X' },
      ],
      performanceData: [
        { subject: 'Mathematics', pass: 80, average: 88 },
        { subject: 'Science', pass: 75, average: 85 },
        { subject: 'English', pass: 70, average: 82 },
        { subject: 'History', pass: 65, average: 80 },
        { subject: 'Geography', pass: 60, average: 78 },
        { subject: 'Physics', pass: 55, average: 75 },
      ],
    },
    {
      name: '4-A',
      students: [
        { id: 19, name: 'Amelia Baker', grade: 'C', marks: 'VII' },
        { id: 20, name: 'Benjamin Lewis', grade: 'B', marks: 'VIII' },
      ],
      performanceData: [
        { subject: 'Mathematics', pass: 55, average: 80 },
        { subject: 'Science', pass: 60, average: 83 },
        { subject: 'English', pass: 65, average: 86 },
        { subject: 'History', pass: 70, average: 89 },
        { subject: 'Geography', pass: 75, average: 92 },
        { subject: 'Physics', pass: 80, average: 95 },
      ],
    },
    {
      name: '4-B',
      students: [
        { id: 21, name: 'Harper Moore', grade: 'D', marks: 'VI' },
        { id: 22, name: 'Elijah Walker', grade: 'C', marks: 'V' },
      ],
      performanceData: [
        { subject: 'Mathematics', pass: 65, average: 70 },
        { subject: 'Science', pass: 70, average: 73 },
        { subject: 'English', pass: 75, average: 76 },
        { subject: 'History', pass: 80, average: 79 },
        { subject: 'Geography', pass: 85, average: 82 },
        { subject: 'Physics', pass: 90, average: 85 },
      ],
    },
    {
      name: '4-C',
      students: [
        { id: 23, name: 'Evelyn Allen', grade: 'A', marks: 'IX' },
        { id: 24, name: 'Daniel Turner', grade: 'B', marks: 'VIII' },
      ],
      performanceData: [
        { subject: 'Mathematics', pass: 75, average: 85 },
        { subject: 'Science', pass: 70, average: 82 },
        { subject: 'English', pass: 65, average: 79 },
        { subject: 'History', pass: 60, average: 76 },
        { subject: 'Geography', pass: 55, average: 73 },
        { subject: 'Physics', pass: 50, average: 70 },
      ],
    },
    {
      name: '5-A',
      students: [
        { id: 25, name: 'Abigail Green', grade: 'C', marks: 'VII' },
        { id: 26, name: 'Michael Harris', grade: 'D', marks: 'VI' },
      ],
      performanceData: [
        { subject: 'Mathematics', pass: 60, average: 78 },
        { subject: 'Science', pass: 65, average: 81 },
        { subject: 'English', pass: 70, average: 84 },
        { subject: 'History', pass: 75, average: 87 },
        { subject: 'Geography', pass: 80, average: 90 },
        { subject: 'Physics', pass: 85, average: 93 },
      ],
    },
    {
      name: '5-B',
      students: [
        { id: 27, name: 'Emily Nelson', grade: 'B', marks: 'IX' },
        { id: 28, name: 'William Carter', grade: 'A', marks: 'X' },
      ],
      performanceData: [
        { subject: 'Mathematics', pass: 70, average: 82 },
        { subject: 'Science', pass: 75, average: 85 },
        { subject: 'English', pass: 80, average: 88 },
        { subject: 'History', pass: 85, average: 91 },
        { subject: 'Geography', pass: 90, average: 94 },
        { subject: 'Physics', pass: 95, average: 97 },
      ],
    },
    {
      name: '5-C',
      students: [
        { id: 29, name: 'Elizabeth Mitchell', grade: 'C', marks: 'VIII' },
        { id: 30, name: 'Alexander Parker', grade: 'B', marks: 'VII' },
      ],
      performanceData: [
        { subject: 'Mathematics', pass: 65, average: 75 },
        { subject: 'Science', pass: 60, average: 72 },
        { subject: 'English', pass: 55, average: 69 },
        { subject: 'History', pass: 50, average: 66 },
        { subject: 'Geography', pass: 45, average: 63 },
        { subject: 'Physics', pass: 40, average: 60 },
      ],
    },
    {
      name: '6-A',
      students: [
        { id: 31, name: 'Sofia Roberts', grade: 'A', marks: 'IX' },
        { id: 32, name: 'Jameson Lee', grade: 'B', marks: 'VIII' },
      ],
      performanceData: [
        { subject: 'Mathematics', pass: 80, average: 90 },
        { subject: 'Science', pass: 75, average: 87 },
        { subject: 'English', pass: 70, average: 84 },
        { subject: 'History', pass: 65, average: 81 },
        { subject: 'Geography', pass: 60, average: 78 },
        { subject: 'Physics', pass: 55, average: 75 },
      ],
    },
    {
      name: '6-B',
      students: [
        { id: 33, name: 'Avery Cook', grade: 'C', marks: 'VII' },
        { id: 34, name: 'Logan Bell', grade: 'D', marks: 'VI' },
      ],
      performanceData: [
        { subject: 'Mathematics', pass: 70, average: 80 },
        { subject: 'Science', pass: 65, average: 77 },
        { subject: 'English', pass: 60, average: 74 },
        { subject: 'History', pass: 55, average: 71 },
        { subject: 'Geography', pass: 50, average: 68 },
        { subject: 'Physics', pass: 45, average: 65 },
      ],
    },
    {
      name: '6-C',
      students: [
        { id: 35, name: 'Grace Ward', grade: 'B', marks: 'IX' },
        { id: 36, name: 'Jackson Reed', grade: 'A', marks: 'X' },
      ],
      performanceData: [
        { subject: 'Mathematics', pass: 85, average: 92 },
        { subject: 'Science', pass: 80, average: 89 },
        { subject: 'English', pass: 75, average: 86 },
        { subject: 'History', pass: 70, average: 83 },
        { subject: 'Geography', pass: 65, average: 80 },
        { subject: 'Physics', pass: 60, average: 77 },
      ],
    },
    {
      name: '7-A',
      students: [
        { id: 37, name: 'Chloe Brooks', grade: 'C', marks: 'VIII' },
        { id: 38, name: 'Samuel Gray', grade: 'B', marks: 'VII' },
      ],
      performanceData: [
        { subject: 'Mathematics', pass: 60, average: 75 },
        { subject: 'Science', pass: 65, average: 78 },
        { subject: 'English', pass: 70, average: 81 },
        { subject: 'History', pass: 75, average: 84 },
        { subject: 'Geography', pass: 80, average: 87 },
        { subject: 'Physics', pass: 85, average: 90 },
      ],
    },
    {
      name: '7-B',
      students: [
        { id: 39, name: 'Zoe Morgan', grade: 'D', marks: 'VI' },
        { id: 40, name: 'Joseph Adams', grade: 'C', marks: 'V' },
      ],
      performanceData: [
        { subject: 'Mathematics', pass: 50, average: 65 },
        { subject: 'Science', pass: 55, average: 68 },
        { subject: 'English', pass: 60, average: 71 },
        { subject: 'History', pass: 65, average: 74 },
        { subject: 'Geography', pass: 70, average: 77 },
        { subject: 'Physics', pass: 75, average: 80 },
      ],
    },
    {
      name: '7-C',
      students: [
        { id: 41, name: 'Hannah Cooper', grade: 'A', marks: 'IX' },
        { id: 42, name: 'David Kelly', grade: 'B', marks: 'VIII' },
      ],
      performanceData: [
        { subject: 'Mathematics', pass: 80, average: 90 },
        { subject: 'Science', pass: 75, average: 87 },
        { subject: 'English', pass: 70, average: 84 },
        { subject: 'History', pass: 65, average: 81 },
        { subject: 'Geography', pass: 60, average: 78 },
        { subject: 'Physics', pass: 55, average: 75 },
      ],
    },
    {
      name: '8-A',
      students: [
        { id: 43, name: 'Lily Price', grade: 'C', marks: 'VII' },
        { id: 44, name: 'Andrew Wood', grade: 'D', marks: 'VI' },
      ],
      performanceData: [
        { subject: 'Mathematics', pass: 65, average: 80 },
        { subject: 'Science', pass: 70, average: 83 },
        { subject: 'English', pass: 75, average: 86 },
        { subject: 'History', pass: 80, average: 89 },
        { subject: 'Geography', pass: 85, average: 92 },
        { subject: 'Physics', pass: 90, average: 95 },
      ],
    },
    {
      name: '8-B',
      students: [
        { id: 45, name: 'Ella Hughes', grade: 'B', marks: 'IX' },
        { id: 46, name: 'Matthew Collins', grade: 'A', marks: 'X' },
      ],
      performanceData: [
        { subject: 'Mathematics', pass: 70, average: 85 },
        { subject: 'Science', pass: 65, average: 82 },
        { subject: 'English', pass: 60, average: 79 },
        { subject: 'History', pass: 55, average: 76 },
        { subject: 'Geography', pass: 50, average: 73 },
        { subject: 'Physics', pass: 45, average: 70 },
      ],
    },
    {
      name: '8-C',
      students: [
        { id: 47, name: 'Aria Bailey', grade: 'C', marks: 'VIII' },
        { id: 48, name: 'Daniel Rivera', grade: 'B', marks: 'VII' },
      ],
      performanceData: [
        { subject: 'Mathematics', pass: 75, average: 88 },
        { subject: 'Science', pass: 80, average: 91 },
        { subject: 'English', pass: 85, average: 94 },
        { subject: 'History', pass: 90, average: 97 },
        { subject: 'Geography', pass: 95, average: 99 },
        { subject: 'Physics', pass: 100, average: 100 },
      ],
    },
    {
      name: '9-A',
      students: [
        { id: 49, name: 'Scarlett Gomez', grade: 'D', marks: 'VI' },
        { id: 50, name: 'Thomas White', grade: 'C', marks: 'V' },
      ],
      performanceData: [
        { subject: 'Mathematics', pass: 60, average: 70 },
        { subject: 'Science', pass: 65, average: 73 },
        { subject: 'English', pass: 70, average: 76 },
        { subject: 'History', pass: 75, average: 79 },
        { subject: 'Geography', pass: 80, average: 82 },
        { subject: 'Physics', pass: 85, average: 85 },
      ],
    },
    {
      name: '9-B',
      students: [
        { id: 51, name: 'Penelope James', grade: 'B', marks: 'IX' },
        { id: 52, name: 'Josephine Brown', grade: 'A', marks: 'X' },
      ],
      performanceData: [
        { subject: 'Mathematics', pass: 70, average: 80 },
        { subject: 'Science', pass: 75, average: 83 },
        { subject: 'English', pass: 80, average: 86 },
        { subject: 'History', pass: 85, average: 89 },
        { subject: 'Geography', pass: 90, average: 92 },
        { subject: 'Physics', pass: 95, average: 95 },
      ],
    },
    {
      name: '9-C',
      students: [
        { id: 53, name: 'Layla Davis', grade: 'C', marks: 'VIII' },
        { id: 54, name: 'Henry Martinez', grade: 'B', marks: 'VII' },
      ],
      performanceData: [
        { subject: 'Mathematics', pass: 65, average: 75 },
        { subject: 'Science', pass: 60, average: 72 },
        { subject: 'English', pass: 55, average: 69 },
        { subject: 'History', pass: 50, average: 66 },
        { subject: 'Geography', pass: 45, average: 63 },
        { subject: 'Physics', pass: 40, average: 60 },
      ],
    },
    {
      name: '10-A',
      students: [
        { id: 55, name: 'Victoria Garcia', grade: 'A', marks: 'IX' },
        { id: 56, name: 'Gabriel Lopez', grade: 'B', marks: 'VIII' },
      ],
      performanceData: [
        { subject: 'Mathematics', pass: 80, average: 90 },
        { subject: 'Science', pass: 75, average: 87 },
        { subject: 'English', pass: 70, average: 84 },
        { subject: 'History', pass: 65, average: 81 },
        { subject: 'Geography', pass: 60, average: 78 },
        { subject: 'Physics', pass: 55, average: 75 },
      ],
    },
    {
      name: '10-B',
      students: [
        { id: 57, name: 'Nora Perez', grade: 'C', marks: 'VII' },
        { id: 58, name: 'Julian Smith', grade: 'D', marks: 'VI' },
      ],
      performanceData: [
        { subject: 'Mathematics', pass: 70, average: 80 },
        { subject: 'Science', pass: 65, average: 77 },
        { subject: 'English', pass: 60, average: 74 },
        { subject: 'History', pass: 55, average: 71 },
        { subject: 'Geography', pass: 50, average: 68 },
        { subject: 'Physics', pass: 45, average: 65 },
      ],
    },
    {
      name: '10-C',
      students: [
        { id: 59, name: 'Eleanor Young', grade: 'B', marks: 'IX' },
        { id: 60, name: 'Sebastian King', grade: 'A', marks: 'X' },
      ],
      performanceData: [
        { subject: 'Mathematics', pass: 85, average: 92 },
        { subject: 'Science', pass: 80, average: 89 },
        { subject: 'English', pass: 75, average: 86 },
        { subject: 'History', pass: 70, average: 83 },
        { subject: 'Geography', pass: 65, average: 80 },
        { subject: 'Physics', pass: 60, average: 77 },
      ],
    },
    {
      name: '10-D',
      students: [
        { id: 61, name: 'Eleanor Young', grade: 'B', marks: 'IX' },
        { id: 62, name: 'Sebastian King', grade: 'A', marks: 'X' },
      ],
      performanceData: [
        { subject: 'Mathematics', pass: 90, average: 95 },
        { subject: 'Science', pass: 85, average: 92 },
        { subject: 'English', pass: 80, average: 89 },
        { subject: 'History', pass: 75, average: 86 },
        { subject: 'Geography', pass: 70, average: 83 },
        { subject: 'Physics', pass: 65, average: 80 },
      ],
    },
  ];

  const notifications = [
    { id: 1, message: 'New message from Principal about school event', time: '2 hours ago' },
    { id: 2, message: 'Parent-Teacher meeting scheduled for Oct 15', time: '1 day ago' },
  ];

  const toggleNotificationDropdown = () => {
    setNotificationDropdownOpen(!notificationDropdownOpen);
    setProfileDropdownOpen(false);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
    setNotificationDropdownOpen(false);
  };

  const handleAddSubject = () => {
    alert('Add Subject functionality to be implemented');
  };

  const filteredClasses = classSections.filter((section) =>
    section.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectClassSection = (section) => {
    setSelectedClassSection(section);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    sessionStorage.clear();
    setShowLogoutModal(false);
    window.location.href = '/login';
  };

  const toggleSidebar = () => {
    const newState = !isSidebarExpanded;
    setIsSidebarExpanded(newState);
    localStorage.setItem('sidebarCollapsed', (!newState).toString());
  };

  return (
    <div className="container">
      <aside className={`sidebar ${isSidebarExpanded ? 'expanded' : 'compressed'}`}>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {isSidebarExpanded ? <X size={18} /> : <Menu size={18} />}
        </button>
        <Link to="/dashboard" className="sidebar-item">
          <LayoutDashboard size={18} />
          {isSidebarExpanded && <span>Dashboard</span>}
        </Link>
        <Link to="/mystudent" className="sidebar-item">
          <User size={18} />
          {isSidebarExpanded && <span>My Student</span>}
        </Link>
        <Link to="/myteacher" className="sidebar-item">
          <User size={18} />
          {isSidebarExpanded && <span>My Teacher</span>}
        </Link>
        <Link to="/reportcard" className="sidebar-item">
          <FileText size={18} />
          {isSidebarExpanded && <span>Report Card</span>}
        </Link>
        <Link to="/performance" className="sidebar-item active">
          <BarChart2 size={18} />
          {isSidebarExpanded && <span>Performance</span>}
        </Link>
        <Link to="/leaderboard" className="sidebar-item">
          <Trophy size={18} />
          {isSidebarExpanded && <span>Leaderboard</span>}
        </Link>
        <Link to="/chat" className="sidebar-item">
          <MessageCircle size={18} />
          {isSidebarExpanded && <span>Chat</span>}
        </Link>
        <Link to="/plan" className="sidebar-item">
          <Calendar size={18} />
          {isSidebarExpanded && <span>Plan</span>}
        </Link>
        <Link to="/support" className="sidebar-item">
          <HelpCircle size={18} />
          {isSidebarExpanded && <span>Support</span>}
        </Link>
        <div className="sidebar-item logout" onClick={() => setShowLogoutModal(true)}>
          <LogOut size={18} />
          {isSidebarExpanded && <span>Logout</span>}
        </div>
      </aside>

      <div
        className="main-content"
        style={{ marginLeft: isSidebarExpanded ? '220px' : '60px', transition: 'margin-left 0.3s ease' }}
      >
        <header className="header">
          <h2>Performance</h2>
          <div className="header-right">
            <input
              type="text"
              className="search"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="icon-wrapper" onClick={toggleNotificationDropdown}>
              <Bell size={18} />
              {notifications.length > 0 && (
                <span className="notification-count">{notifications.length}</span>
              )}
              {notificationDropdownOpen && (
                <div className="notification-dropdown-box">
                  <div className="notification-header">
                    <h4>Notifications</h4>
                  </div>
                  <div className="notification-list">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div key={notification.id} className="notification-item">
                          <p className="notification-message">{notification.message}</p>
                          <p className="notification-time">{notification.time}</p>
                        </div>
                      ))
                    ) : (
                      <p className="no-notifications">No new notifications</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="user-info">
              <div
                className="user-avatar"
                onClick={toggleProfileDropdown}
                style={{ cursor: 'pointer', position: 'relative' }}
              >
                <User size={16} />
                {profileDropdownOpen && (
                  <div className="profile-dropdown-box">
                    <div className="profile-header">
                      <h4>Sarah Johnson</h4>
                      <p>sarha.j@example.com</p>
                    </div>
                    <div className="profile-options">
                      <Link to="/settings" className="profile-option">
                        <span className="icon">
                          <i className="fas fa-cog"></i>
                        </span>
                        Settings
                      </Link>
                      <Link to="/profilesetting" className="profile-option">
                        <span className="icon">
                          <i className="fas fa-edit"></i>
                        </span>
                        Edit
                      </Link>
                      <div
                        className="profile-option logout"
                        onClick={() => setShowLogoutModal(true)}
                      >
                        <span className="icon">
                          <i className="fas fa-sign-out-alt"></i>
                        </span>
                        Log out
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <span className="user-name">Admin</span>
            </div>
          </div>
        </header>

        {!selectedClassSection ? (
          <div className="performance-class-grid">
            {filteredClasses.length > 0 ? (
              filteredClasses.map((section) => (
                <div
                  key={section.name}
                  className="performance-class-card"
                  onClick={() => selectClassSection(section)}
                >
                  <h3>{section.name}</h3>
                  <p>{section.students.length} students</p>
                </div>
              ))
            ) : (
              <p>No classes match your search.</p>
            )}
          </div>
        ) : (
          <div className="card">
            <div
              className="card-header"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  className="back-icon"
                  onClick={() => setSelectedClassSection(null)}
                  aria-label="Go back to class list"
                >
                  <ArrowLeft size={18} />
                </span>
                <h3>Performance - {selectedClassSection.name}</h3>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="add-teacher-btn" onClick={handleAddSubject}>
                  <Plus size={16} /> Add Subject
                </button>
              </div>
            </div>

            <div className="performance-cards">
              {selectedClassSection.performanceData.map((stats, index) => (
                <div key={index} className="performance-card">
                  <h4
                    style={{
                      marginBottom: '20px',
                      marginTop: '20px',
                      fontWeight: 'bold',
                      backgroundColor: '#f3f4f6',
                      padding: '5px 10px',
                      borderRadius: '4px',
                    }}
                  >
                    {stats.subject}
                  </h4>
                  <div className="performance-stats">
                    <span>Pass</span>
                    <span>{stats.pass}%</span>
                    <span>Fail</span>
                    <span>{100 - stats.pass}%</span>
                    <span>Average</span>
                    <span>{stats.average}%</span>
                  </div>
                  <div className="performance-progress">
                    <div className="progress-bar-container">
                      <div
                        className="progress-bar pass"
                        style={{ width: `${stats.pass}%`, backgroundColor: '#2ecc71' }}
                      ></div>
                      <div
                        className="progress-bar fail"
                        style={{ width: `${100 - stats.pass}%`, left: `${stats.pass}%`, backgroundColor: '#e74c3c' }}
                      ></div>
                    </div>
                    <span>Pass + Fail = 100%</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="academic-performance">
              <h4 className="section-title">Academic Performance</h4>
              <table className="performance-table">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Student Name</th>
                    <th>Grade</th>
                    <th>Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedClassSection.students.map((student, index) => (
                    <tr key={index}>
                      <td>{student.id}</td>
                      <td>{student.name}</td>
                      <td>{student.grade}</td>
                      <td>{student.marks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showLogoutModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-icon">
                <LogOut size={32} color="red" />
              </div>
              <h2>Are you sure you want to logout?</h2>
              <p>You will need to log in again to access your dashboard.</p>
              <div className="modal-actions">
                <button className="btn cancel" onClick={() => setShowLogoutModal(false)}>
                  Cancel
                </button>
                <button className="btn logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Performance;