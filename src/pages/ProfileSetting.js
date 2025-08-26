import React, { useState,useEffect } from "react";
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
  Menu,
  X,
} from "lucide-react";
import "./ProfileSetting.css";

const ProfileSetting = () => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  useEffect(() => {
    const savedSidebarState = localStorage.getItem('sidebarCollapsed');
    if (savedSidebarState !== null) {
      setIsSidebarExpanded(savedSidebarState === 'false');
    }
  }, []);
  // Initial Values
  const initialData = {
    fullName: "Sarah Johnson",
    email: "sarahjohnson@email.com",
    mobileNumber: "+1 (555) 123-4567",
    specializedCourse: "Mathematics",
    profileImage: null,
  };

  const [formData, setFormData] = useState(initialData);
  
  // Sample notifications data
  const notifications = [
    { id: 1, message: 'New message from Principal about school event', time: '2 hours ago' },
    { id: 2, message: 'Parent-Teacher meeting scheduled for Oct 15', time: '1 day ago' },
  ];

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
    setNotificationDropdownOpen(false);
  };

  const toggleNotificationDropdown = () => {
    setNotificationDropdownOpen(!notificationDropdownOpen);
    setProfileDropdownOpen(false);
  };

  const toggleSidebar = () => {
    const newState = !isSidebarExpanded;
    setIsSidebarExpanded(newState);
    localStorage.setItem('sidebarCollapsed', (!newState).toString());
  };

  // Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, profileImage: imageUrl });
    }
  };

  // Handle Cancel (reset only text fields, keep image)
  const handleCancel = () => {
    setFormData((prev) => ({
      ...initialData,
      profileImage: prev.profileImage,
    }));
  };

  // Handle Save (send data to backend or log it)
  const handleSave = () => {
    console.log("Saved Data:", formData);
    alert("Profile changes saved successfully!");
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.clear(); // clear session
    window.location.href = "/"; // redirect to login/home
  };

  return (
    <div className="container">
      {/* Sidebar */}
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
        <Link to="/performance" className="sidebar-item">
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

        <div
          className="sidebar-item logout"
          onClick={() => setShowLogoutModal(true)}
        >
          <LogOut size={18} />
          {isSidebarExpanded && <span>Logout</span>}
        </div>
      </aside>

      {/* Main Content */}
      <div
        className="main-content"
        style={{ marginLeft: isSidebarExpanded ? '220px' : '60px', transition: 'margin-left 0.3s ease' }}
      >
        {/* Header */}
        <header className="header">
          <h2>Profile Settings</h2>
          <div className="header-right">
            <input type="text" className="search" placeholder="Search..." />
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
                style={{ cursor: "pointer", position: "relative" }}
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
                        </span>{" "}
                        Settings
                      </Link>
                      <Link to="/profilesetting" className="profile-option">
                        <span className="icon">
                          <i className="fas fa-edit"></i>
                        </span>{" "}
                        Edit
                      </Link>
                      <div
                        className="profile-option logout"
                        onClick={() => setShowLogoutModal(true)}
                      >
                        <span className="icon">
                          <i className="fas fa-sign-out-alt"></i>
                        </span>{" "}
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

        {/* Notification Dropdown */}
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

        {/* Card */}
        <div className="card">
          <div className="profile-settings-header">
            <h3>Profile Settings</h3>
            <p>Update your personal information and account settings</p>
          </div>

          {/* Profile Picture */}
          <div className="profile-picture-section">
            <img
              src={formData.profileImage || "https://via.placeholder.com/100"}
              alt="Profile"
              className="profile-img"
            />
            <div className="profile-picture-info">
              <h4>Profile Picture</h4>
              <p>Click below to change your profile picture</p>
              <label htmlFor="upload-photo" className="upload-btn">
                Upload New Photo
              </label>
              <input
                id="upload-photo"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </div>
          </div>

          {/* Form */}
          <div className="form-container">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>

            {/* Row with Email + Mobile */}
            <div className="form-row">
              <div className="form-group half-width">
                <label>Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className="form-group half-width">
                <label>Mobile Number</label>
                <input
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, mobileNumber: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Specialized Course */}
            <div className="form-group">
              <label>Specialized Course</label>
              <input
                type="text"
                value={formData.specializedCourse}
                onChange={(e) =>
                  setFormData({ ...formData, specializedCourse: e.target.value })
                }
              />
            </div>

            <div className="button-group">
              <button className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
              <button className="savechanges-btn" onClick={handleSave}>
                Save Changes
              </button>
            </div>
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
  );
};

export default ProfileSetting;