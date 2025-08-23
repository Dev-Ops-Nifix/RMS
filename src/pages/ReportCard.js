// src/pages/ReportCard.js
import React, { useState } from 'react';
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
} from 'lucide-react';
import './ReportCard.css';

const ReportCard = () => {
  const [selectedQuarter, setSelectedQuarter] = useState('Q1 2025');
  const [quarterDropdownOpen, setQuarterDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewURL, setPreviewURL] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);

  const quarters = ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025'];

  const subjects = [
    { subject: 'English', grade: 'A', teacher: 'Ms. Smith', comments: 'Excellent' },
    { subject: 'Math', grade: 'B+', teacher: 'Mr. Lee', comments: 'Good effort' },
    { subject: 'Science', grade: 'A-', teacher: 'Mrs. Patel', comments: 'Great understanding' },
    { subject: 'History', grade: 'B', teacher: 'Mr. Johnson', comments: 'Needs improvement' },
  ];
  const notifications = [
    { id: 1, message: 'New message from Principal about school event', time: '2 hours ago' },
    { id: 2, message: 'Parent-Teacher meeting scheduled for Oct 15', time: '1 day ago' },
  ];
  const filteredSubjects = subjects.filter((item) =>
    Object.values(item).some((val) =>
      val.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  const toggleNotificationDropdown = () => {
    setNotificationDropdownOpen(!notificationDropdownOpen);
    setProfileDropdownOpen(false); // Close profile dropdown when opening notification
  };

  const toggleQuarterDropdown = () => {
    setQuarterDropdownOpen(!quarterDropdownOpen);
    setProfileDropdownOpen(false); // close profile menu if open
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
    setQuarterDropdownOpen(false); // close quarter menu if open
  };

  const handleSelectQuarter = (quarter) => {
    setSelectedQuarter(quarter);
    setQuarterDropdownOpen(false);
  };
   // Handle logout confirmation
   const handleLogout = () => {
    // Example: clear session/local storage
    localStorage.removeItem("authToken"); // if you’re using token auth
    sessionStorage.clear();
  
    setShowLogoutModal(false);
  
    // Redirect to login page
    window.location.href = "/login";
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        alert("Only JPG and PNG files are allowed!");
        return;
      }
      setPreviewURL(URL.createObjectURL(file));
      console.log("File selected:", file.name);
    }
  };

  const handleUploadClick = () => {
    document.getElementById("uploadInput").click();
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <aside className="sidebar">
        <Link to="/dashboard" className="sidebar-item">
          <LayoutDashboard size={18} /> Dashboard
        </Link>
        <Link to="/mystudent" className="sidebar-item">
          <User size={18} /> My Student
        </Link>
        <Link to="/myteacher" className="sidebar-item ">
          <User size={18} />
          My Teacher
        </Link>
        <Link to="/reportcard" className="sidebar-item active">
          <FileText size={18} /> Report Card
        </Link>
        <Link to="/performance" className="sidebar-item">
          <BarChart2 size={18} /> Performance
        </Link>
        <Link to="/leaderboard" className="sidebar-item">
          <Trophy size={18} /> Leaderboard
        </Link>
        <Link to="/Chat" className="sidebar-item">
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
          <h2>Report Card</h2>
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

        <div className="scrollable-content">
          <div className="report-card-box">
            <div className="report-card-left">
              <h3 className="report-card-title">Report Card</h3>
              <p className="student-info">Name - Grade </p>
            </div>
            <div className="report-card-actions">
              <input
                type="file"
                id="uploadInput"
                accept=".jpg, .jpeg, .png"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <button className="btn action-btn" onClick={handleUploadClick}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 16V4M12 4L6 10M12 4l6 6M4 20h16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Upload
              </button>
              <button className="btn action-btn">
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M17 17H7v4h10v-4m0-6a2 2 0 0 1 2 2v4H5v-4a2 2 0 0 1 2-2h10m0-2H7V3h10v6Z"
                  />
                </svg>
                Print
              </button>
            </div>
          </div>

          {previewURL && (
            <div className="preview-section">
              <h4>Uploaded Image Preview:</h4>
              <img
                src={previewURL}
                alt="Uploaded Preview"
                style={{ maxWidth: "200px", marginTop: "10px", borderRadius: "6px" }}
              />
            </div>
          )}

          <div className="report-quarter-card">
            <div className="report-quarter-header">
              <div className="title-left">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M20 2H8c-1.1 0-2 .9-2 2v14H4v2h16v-2h-2V4c0-1.1-.9-2-2-2m0 16H8V4h12Z" />
                </svg>
                <span>{selectedQuarter}</span>
              </div>
              <div
                className="quarter-dropdown"
                onClick={toggleQuarterDropdown}
                style={{ cursor: 'pointer', position: 'relative' }}
              >
                {selectedQuarter} ▾
                {quarterDropdownOpen && (
                  <ul className="dropdown-menu">
                    {quarters.map((quarter) => (
                      <li key={quarter} onClick={() => handleSelectQuarter(quarter)}>
                        {quarter}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="report-quarter-content">
              <div className="card-box">
                <h4>Student Information</h4>
                <div className="card-grid">
                  <div><span className="label">Name:</span> Name</div>
                  <div><span className="label">ID:</span> ID</div>
                  <div><span className="label">Grade:</span> Grade</div>
                  <div><span className="label">Class:</span> Class</div>
                  <div><span className="label">Academic Year:</span> Academic Year</div>
                  <div><span className="label">Period:</span> Period</div>
                </div>
              </div>

              <div className="card-box">
                <h4>Summary</h4>
                <div className="card-grid">
                  <div><span className="label">Overall Grade:</span> Overall Grade</div>
                  <div><span className="label">Attendance:</span> Attendance</div>
                  <div><span className="label">Class Rank:</span> Class Rank</div>
                  <div><span className="label">Behavior:</span> Behavior</div>
                </div>
              </div>
            </div>
          </div>

          <div className="academic-performance">
            <h4 className="section-title">Academic Performance</h4>
            <table className="performance-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Grade</th>
                  <th>Teacher</th>
                  <th>Comments</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubjects.map((item, index) => (
                  <tr key={index}>
                    <td>{item.subject}</td>
                    <td>{item.grade}</td>
                    <td>{item.teacher}</td>
                    <td>{item.comments}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="teacher-comments">
            <h4 className="comment-title">Teacher's Overall Comments</h4>
            <p className="comment-text">comment</p>
          </div>

          <div className="principal-comments">
            <h4 className="comment-title">Principal's Comments</h4>
            <p className="comment-text">comment</p>
            <div className="principal-info">
              <div className="principal-avatar"></div>
              <div className="principal-details">
                <div className="principal-name">Principal Name</div>
                <div className="principal-role">Principal</div>
              </div>
            </div>
          </div>
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
          onClick={() => setShowLogoutModal(false)} // Cancel closes modal
        >
          Cancel
        </button>
        <button
          className="btn logout"
          onClick={handleLogout} // Logout clears storage + redirects
        >
          Logout
        </button>
      </div>
    </div>
  </div>
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
      </div>
    </div>
  );
};

export default ReportCard;
