import React, { useState } from "react";
import { Link } from "react-router-dom";
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
} from "lucide-react";
import "./LeaderBoard.css";

const LeaderBoard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);

  const students = [
    { id: 1, name: "Emma Thompson", grade: "10th Grade", points: 98, change: +1, img: "https://via.placeholder.com/60" },
    { id: 2, name: "James Wilson", grade: "11th Grade", points: 95, change: -1, img: "https://via.placeholder.com/60" },
    { id: 3, name: "Sophia Martinez", grade: "10th Grade", points: 93, change: +2, img: "https://via.placeholder.com/60" },
    { id: 4, name: "Noah Garcia", grade: "9th Grade", points: 91, change: -1, img: "https://via.placeholder.com/60" },
    { id: 5, name: "Olivia Johnson", grade: "12th Grade", points: 90, change: 0, img: "https://via.placeholder.com/60" },
    { id: 6, name: "Ethan Williams", grade: "11th Grade", points: 89, change: +2, img: "https://via.placeholder.com/60" },
    { id: 7, name: "Ava Brown", grade: "10th Grade", points: 88, change: 0, img: "https://via.placeholder.com/60" },
    { id: 8, name: "Liam Davis", grade: "9th Grade", points: 87, change: -2, img: "https://via.placeholder.com/60" },
  ];
  const notifications = [
    { id: 1, message: 'New message from Principal about school event', time: '2 hours ago' },
    { id: 2, message: 'Parent-Teacher meeting scheduled for Oct 15', time: '1 day ago' },
  ];

  const classOptions = ["9", "10", "11", "12"];
  const sectionOptions = ["A", "B", "C"];

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };
  const toggleNotificationDropdown = () => {
    setNotificationDropdownOpen(!notificationDropdownOpen);
    setProfileDropdownOpen(false); // Close profile dropdown when opening notification
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
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
        <Link to="/myteacher" className="sidebar-item">
          <User size={18} /> My Teacher
        </Link>
        <Link to="/reportcard" className="sidebar-item">
          <FileText size={18} /> Report Card
        </Link>
        <Link to="/performance" className="sidebar-item">
          <BarChart2 size={18} /> Performance
        </Link>
        <Link to="/leaderboard" className="sidebar-item active">
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
        <div
          className="sidebar-item logout"
          onClick={() => setShowLogoutModal(true)}
        >
          <LogOut size={18} /> Logout
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Navbar */}
        <header className="header">
          <h2>Class Leaderboard</h2>
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

        {/* Scrollable Content */}
        <div className="content-scroll">
          {/* Performance Overview */}
          <div className="leaderboard-card">
            <div className="leaderboard-header">
              <div>
                <h3>Performance Overview</h3>
                <p>
                  Class average: <strong>87%</strong>
                </p>
              </div>
              <div className="dropdowns">
                <select
                  className="dropdown"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  <option value="">All Classes</option>
                  {classOptions.map((cls, index) => (
                    <option key={index} value={cls}>
                      Class {cls}
                    </option>
                  ))}
                </select>
                <select
                  className="dropdown"
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                >
                  <option value="">All Sections</option>
                  {sectionOptions.map((sec, index) => (
                    <option key={index} value={sec}>
                      Section {sec}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="your-position">
              Your position: <strong>9th out of 10 students</strong>
            </div>
          </div>

          <div className="podium">
            <div className="podium-item second">
              <div className="circle silver">2</div>
              <h4>Second Place</h4>
              <p>Grade 10</p>
              <strong>450 Marks</strong>
            </div>

            <div className="podium-item first">
              <div className="circle gold">1</div>
              <h4>First Place</h4>
              <p>Grade 10</p>
              <strong>480 Marks</strong>
            </div>

            <div className="podium-item third">
              <div className="circle bronze">3</div>
              <h4>Third Place</h4>
              <p>Grade 10</p>
              <strong>430 Marks</strong>
            </div>
          </div>

          {/* Student Rankings */}
          <div className="student-rankings">
            <h4>Student Rankings</h4>
            <ul>
              {students.map((student, idx) => (
                <li key={student.id} className="ranking-item">
                  <span>{idx + 1}</span>
                  <img src={student.img} alt={student.name} />
                  <div className="ranking-info">
                    <strong>{student.name}</strong>
                    <p>{student.grade}</p>
                  </div>
                  <div className="points">
                    {student.points} marks
                    <span
                      className={
                        student.change > 0
                          ? "up"
                          : student.change < 0
                          ? "down"
                          : ""
                      }
                    >
                      {student.change > 0
                        ? `+${student.change}`
                        : student.change}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
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
              <button className="btn logout" onClick={handleLogout}>
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
  );
};

export default LeaderBoard;
