import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeft,
  User,
  FileText,
  BarChart2,
  Trophy,
  MessageCircle,
  Calendar,
  HelpCircle,
  LogOut,
  Bell,
} from 'lucide-react';
import './Dashboard.css';


const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [selectedClassSection, setSelectedClassSection] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Sample notifications data
  const notifications = [
    { id: 1, message: 'New message from Principal about school event', time: '2 hours ago' },
    { id: 2, message: 'Parent-Teacher meeting scheduled for Oct 15', time: '1 day ago' },
  ];

  // ClassSections data
  const classSections = [
    {
      name: '1-A', students: [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Smith' }], events: [
        { title: 'Parent-Teacher Meeting', date: 'Oct 15, 2025 at 3:00 PM' },
        { title: 'Science Fair', date: 'Oct 20, 2025 at 10:00 AM' },
      ], improvements: [
        { subject: 'Mathematics', score: '78%', area: 'Algebra' },
        { subject: 'Science', score: '82%', area: 'Chemistry' },
      ]
    },
    {
      name: '1-B', students: [{ id: 3, name: 'Alex Brown' }, { id: 4, name: 'Chris Green' }], events: [
        { title: 'Math Test', date: 'Oct 25, 2025 at 9:30 AM' },
        { title: 'Art Exhibition', date: 'Oct 28, 2025 at 2:00 PM' },
      ], improvements: [
        { subject: 'English', score: '85%', area: 'Essay Writing' },
        { subject: 'History', score: '80%', area: 'World History' },
      ]
    },
    {
      name: '1-C', students: [{ id: 5, name: 'Emma Wilson' }, { id: 6, name: 'Liam Davis' }], events: [
        { title: 'Sports Day', date: 'Oct 22, 2025 at 1:00 PM' },
      ], improvements: [
        { subject: 'Physics', score: '83%', area: 'Mechanics' },
      ]
    },
    { name: '2-A', students: [{ id: 7, name: 'Olivia Taylor' }, { id: 8, name: 'Noah Miller' }], events: [], improvements: [] },
    { name: '2-B', students: [{ id: 9, name: 'Sophia Lee' }, { id: 10, name: 'Mason Clark' }], events: [], improvements: [] },
    { name: '2-C', students: [{ id: 11, name: 'Isabella Adams' }, { id: 12, name: 'Ethan King' }], events: [], improvements: [] },
    { name: '3-A', students: [{ id: 13, name: 'Ava Scott' }, { id: 14, name: 'James Hall' }], events: [], improvements: [] },
    { name: '3-B', students: [{ id: 15, name: 'Mia Young' }, { id: 16, name: 'Lucas Hill' }], events: [], improvements: [] },
    { name: '3-C', students: [{ id: 17, name: 'Charlotte Evans' }, { id: 18, name: 'Henry Wright' }], events: [], improvements: [] },
    { name: '4-A', students: [{ id: 19, name: 'Amelia Baker' }, { id: 20, name: 'Benjamin Lewis' }], events: [], improvements: [] },
    { name: '4-B', students: [{ id: 21, name: 'Harper Moore' }, { id: 22, name: 'Elijah Walker' }], events: [], improvements: [] },
    { name: '4-C', students: [{ id: 23, name: 'Evelyn Allen' }, { id: 24, name: 'Daniel Turner' }], events: [], improvements: [] },
    { name: '5-A', students: [{ id: 25, name: 'Abigail Green' }, { id: 26, name: 'Michael Harris' }], events: [], improvements: [] },
    { name: '5-B', students: [{ id: 27, name: 'Emily Nelson' }, { id: 28, name: 'William Carter' }], events: [], improvements: [] },
    { name: '5-C', students: [{ id: 29, name: 'Elizabeth Mitchell' }, { id: 30, name: 'Alexander Parker' }], events: [], improvements: [] },
    { name: '6-A', students: [{ id: 31, name: 'Sofia Roberts' }, { id: 32, name: 'Jameson Lee' }], events: [], improvements: [] },
    { name: '6-B', students: [{ id: 33, name: 'Avery Cook' }, { id: 34, name: 'Logan Bell' }], events: [], improvements: [] },
    { name: '6-C', students: [{ id: 35, name: 'Grace Ward' }, { id: 36, name: 'Jackson Reed' }], events: [], improvements: [] },
    { name: '7-A', students: [{ id: 37, name: 'Chloe Brooks' }, { id: 38, name: 'Samuel Gray' }], events: [], improvements: [] },
    { name: '7-B', students: [{ id: 39, name: 'Zoe Morgan' }, { id: 40, name: 'Joseph Adams' }], events: [], improvements: [] },
    { name: '7-C', students: [{ id: 41, name: 'Hannah Cooper' }, { id: 42, name: 'David Kelly' }], events: [], improvements: [] },
    { name: '8-A', students: [{ id: 43, name: 'Lily Price' }, { id: 44, name: 'Andrew Wood' }], events: [], improvements: [] },
    { name: '8-B', students: [{ id: 45, name: 'Ella Hughes' }, { id: 46, name: 'Matthew Collins' }], events: [], improvements: [] },
    { name: '8-C', students: [{ id: 47, name: 'Aria Bailey' }, { id: 48, name: 'Daniel Rivera' }], events: [], improvements: [] },
    { name: '9-A', students: [{ id: 49, name: 'Scarlett Gomez' }, { id: 50, name: 'Thomas White' }], events: [], improvements: [] },
    { name: '9-B', students: [{ id: 51, name: 'Penelope James' }, { id: 52, name: 'Josephine Brown' }], events: [], improvements: [] },
    { name: '9-C', students: [{ id: 53, name: 'Layla Davis' }, { id: 54, name: 'Henry Martinez' }], events: [], improvements: [] },
    { name: '10-A', students: [{ id: 55, name: 'Victoria Garcia' }, { id: 56, name: 'Gabriel Lopez' }], events: [], improvements: [] },
    { name: '10-B', students: [{ id: 57, name: 'Nora Perez' }, { id: 58, name: 'Julian Smith' }], events: [], improvements: [] },
    { name: '10-C', students: [{ id: 59, name: 'Eleanor Young' }, { id: 60, name: 'Sebastian King' }], events: [], improvements: [] },
    { name: '10-D', students: [{ id: 61, name: 'Eleanor Young' }, { id: 62, name: 'Sebastian King' }], events: [], improvements: [] },
  ];

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
    setNotificationDropdownOpen(false); // Close notification dropdown when opening profile
  };

  const toggleNotificationDropdown = () => {
    setNotificationDropdownOpen(!notificationDropdownOpen);
    setProfileDropdownOpen(false); // Close profile dropdown when opening notification
  };

  // Handle logout confirmation
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.clear();
    setShowLogoutModal(false);
    window.location.href = "/login";
  };

  // Filter logic for events and improvements based on selected class
  const filteredEvents = selectedClassSection
    ? selectedClassSection.events.filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.date.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];

  const filteredImprovements = selectedClassSection
    ? selectedClassSection.improvements.filter(imp =>
      imp.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      imp.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      imp.score.includes(searchTerm)
    )
    : [];

  // Filter logic for classes based on search term
  const filteredClasses = classSections.filter(section =>
    section.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectClassSection = (section) => {
    setSelectedClassSection(section);
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <aside className="sidebar">
        <Link to="/dashboard" className="sidebar-item active">
          <LayoutDashboard size={18} /> Dashboard
        </Link>
        <Link to="/mystudent" className="sidebar-item">
          <User size={18} /> My Student
        </Link>
        <Link to="/myteacher" className="sidebar-item">
          <User size={18} /> My Teacher
        </Link>
        <Link to="/reportcard" className="sidebar-item">
          <FileText size={18} /> Report Card
        </Link>
        <Link to="/performance" className="sidebar-item">
          <BarChart2 size={18} /> Performance
        </Link>
        <Link to="/leaderboard" className="sidebar-item">
          <Trophy size={18} /> Leaderboard
        </Link>
        <Link to="/chat" className="sidebar-item">
          <MessageCircle size={18} /> Chat
        </Link>
        <Link to="/plan" className="sidebar-item">
          <Calendar size={18} /> Plan
        </Link>
        <Link to="/support" className="sidebar-item">
          <HelpCircle size={18} /> Support
        </Link>
        <div className="sidebar-item logout" onClick={() => setShowLogoutModal(true)}>
          <LogOut size={18} /> Logout
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header className="header">
          <h2>Dashboard</h2>
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
                      notifications.map(notification => (
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
                        <span className="icon"><i className="fas fa-cog"></i></span> Settings
                      </Link>
                      <Link to="/profilesetting" className="profile-option">
                        <span className="icon"><i className="fas fa-edit"></i></span> Edit
                      </Link>
                      <div className="profile-option logout" onClick={() => setShowLogoutModal(true)}>
                        <span className="icon"><i className="fas fa-sign-out-alt"></i></span> Log out
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
          <div className="dashboard-class-grid">
            {filteredClasses.length > 0 ? (
              filteredClasses.map((section) => (
                <div
                  key={section.name}
                  className="dashboard-class-card"
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
          <>
          {/* Back Button */}
    <div className="back-button-container">
      <button
        className="back-button"
        onClick={() => setSelectedClassSection(null)}
      >
        <ArrowLeft size={18} />
      </button>
    </div>
            {/* Welcome Card */}
            <div className="welcome-card">
              <div className="welcome-avatar">TN</div>
              <div className="welcome-text">
                <h3>Welcome back, Teacher Name</h3>
                <p>
                  Here's the latest information about your class,{' '}
                  <span className="child-name">{selectedClassSection.name}</span>
                </p>
              </div>
            </div>

            {/* Stats Boxes */}
            <div className="stats-container">
              <div className="stat-box">
                <h4>Current Average</h4>
                <div className="stat-main">
                  <span className="stat-value">88%</span>
                  <span className="stat-change">+2%</span>
                </div>
                <p className="stat-sub">{selectedClassSection.name}</p>
              </div>
              <div className="stat-box">
                <h4>Upcoming Tests</h4>
                <div className="stat-main">
                  <span className="stat-value">
                    {selectedClassSection.events.filter(event => {
                      const eventDate = new Date(event.date);
                      const today = new Date();
                      return eventDate > today && eventDate.getTime() - today.getTime() < 7 * 24 * 60 * 60 * 1000;
                    }).length}
                  </span>
                </div>
                <p className="stat-sub">This week</p>
              </div>
              <div className="stat-box">
                <h4>Teacher Messages</h4>
                <div className="stat-main">
                  <span className="stat-value">2</span>
                  <span className="stat-badge">New</span>
                </div>
                <p className="stat-sub">Unread messages</p>
              </div>
            </div>

            {/* Performance & Improvement Section */}
            <div className="performance-section">
              {/* Left Card */}
              <div className="performance-card">
                <div className="card-header">
                  <h4>Recent Performance</h4>
                  <i className="fas fa-chart-line"></i>
                </div>
                <div className="card-content">
                  <p className="placeholder-text">Performance chart will appear here</p>
                </div>
              </div>

              {/* Right Card */}
              <div className="performance-card">
                <div className="card-header">
                  <h4>Areas for Improvement</h4>
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
                {filteredImprovements.length > 0 ? (
                  filteredImprovements.map((imp, index) => (
                    <div className="improvement-item" key={index}>
                      <div className="improvement-title">
                        <span>{imp.subject}</span>
                        <span>{imp.score}</span>
                      </div>
                      <p className="improvement-sub">{imp.area}</p>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${parseInt(imp.score)}%` }}></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No improvements match your search.</p>
                )}
                <p>View Improvement Plan</p>
              </div>
            </div>

            {/* Events, Report Card, Ranking Section */}
            <div className="extra-section">
              {/* Upcoming Events */}
              <div className="extra-card">
                <div className="extra-header">
                  <h4>Upcoming Events</h4>
                  <i className="fas fa-calendar-alt"></i>
                </div>
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event, index) => (
                    <div className="event-item" key={index}>
                      <i className="fas fa-calendar-day event-icon"></i>
                      <div>
                        <p className="event-title">{event.title}</p>
                        <p className="event-date">{event.date}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No events match your search.</p>
                )}
              </div>

              {/* Latest Report Card */}
              <div className="extra-card center-content">
                <div className="extra-header">
                  <h4>Latest Report Card</h4>
                  <i className="fas fa-file-alt"></i>
                </div>
                <div className="report-card-center">
                  <i className="fas fa-file-alt report-icon"></i>
                  <p className="report-title">First Quarter Report</p>
                  <p className="report-date">September 30, 2025</p>
                  <Link to="/reportcard">
                    <button className="view-btn">View Report Card</button>
                  </Link>
                </div>
              </div>

              {/* Class Ranking */}
              <div className="extra-card center-content">
                <div className="extra-header">
                  <h4>Class Ranking</h4>
                  <i className="fas fa-trophy"></i>
                </div>
                <div className="ranking-center">
                  <div className="rank-circle">3</div>
                  <p className="rank-sub">of 30</p>
                  <p className="student-name">{selectedClassSection.name}</p>
                  <p className="student-class">Average Rank</p>
                  <p>View Leaderboard</p>
                </div>
              </div>
            </div>
          </>
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
                <button
                  className="btn cancel"
                  onClick={() => setShowLogoutModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn logout"
                  onClick={handleLogout}
                >
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

export default Dashboard;