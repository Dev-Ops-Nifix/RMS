import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  FileText,
  BarChart2,
  MessageCircle,
  Calendar,
  HelpCircle,
  LogOut,
  Bell,
} from 'lucide-react';
import './p.css';

const P = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const notifications = [
    { id: 1, message: 'New message from Principal about school event', time: '2 hours ago' },
    { id: 2, message: 'Parent-Teacher meeting scheduled for Oct 15', time: '1 day ago' },
  ];

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
    setNotificationDropdownOpen(false); // Close notification dropdown when opening profile
  };

  const toggleNotificationDropdown = () => {
    setNotificationDropdownOpen(!notificationDropdownOpen);
    setProfileDropdownOpen(false); // Close profile dropdown when opening notification
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.clear();
    setShowLogoutModal(false);
    window.location.href = "/login";
  };

  return (
    <>
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
        <Link to="/Chat" className="sidebar-item">
          <MessageCircle size={18} /> Chat
        </Link>
        <Link to="/plan" className="sidebar-item active">
          <Calendar size={18} /> Plan
        </Link>
        <Link to="/support" className="sidebar-item">
          <HelpCircle size={18} /> Support
        </Link>
        <div className="sidebar-item logout" onClick={() => setShowLogoutModal(true)}>
          <LogOut size={18} /> Logout
        </div>
      </aside>

      <header className="header">
        <h2>Plan</h2>
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
    </>
  );
};

export default P;