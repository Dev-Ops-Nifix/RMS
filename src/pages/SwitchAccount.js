import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaExchangeAlt } from "react-icons/fa";
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
  UserPlus, // Added UserPlus import
} from "lucide-react";
import "./SwitchAccount.css";

const SwitchAccount = () => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const accounts = [
    {
      name: "Ms. Johnson",
      role: "Teacher",
      email: "e.johnson@school.edu",
      badge: "Educator",
      badgeColor: "#3b82f6", // blue
      badgeBg: "#dbeafe",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "David Wilson",
      role: "Administrator",
      email: "d.wilson@school.edu",
      badge: "Admin",
      badgeColor: "#a855f7", // purple
      badgeBg: "#f3e8ff",
      image: "https://randomuser.me/api/portraits/men/46.jpg",
    },
  ];




  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };



  return (
    <div className="container">
      {/* Sidebar */}
      <aside className="sidebar">
        <Link to="/dashboard" className="sidebar-item">
          <LayoutDashboard size={18} />
          Dashboard
        </Link>
        <Link to="/mystudent" className="sidebar-item">
          <User size={18} />
          My Student
        </Link>
        <Link to="/myteacher" className="sidebar-item">
          <User size={18} />
          My Teacher
        </Link>
        <Link to="/reportcard" className="sidebar-item">
          <FileText size={18} />
          Report Card
        </Link>
        <Link to="/performance" className="sidebar-item">
          <BarChart2 size={18} />
          Performance
        </Link>
        <Link to="/leaderboard" className="sidebar-item">
          <Trophy size={18} />
          Leaderboard
        </Link>
        <Link to="/chat" className="sidebar-item">
          <MessageCircle size={18} />
          Chat
        </Link>
        <Link to="/plan" className="sidebar-item">
          <Calendar size={18} />
          Plan
        </Link>
        <Link to="/support" className="sidebar-item">
          <HelpCircle size={18} />
          Support
        </Link>

        <div className="sidebar-item logout">
          <LogOut size={18} />
          Logout
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <h2>Switch Account</h2>
          <div className="header-right">
            <input type="text" className="search" placeholder="Search..." />
            <div className="icon-wrapper">
              <Bell size={18} />
              <span className="notification-dot"></span>
            </div>
            <div className="user-info">
              <div
                className="user-avatar"
                onClick={toggleProfileDropdown}
                style={{ cursor: "pointer", position: "relative" }}
              >
                <User size={16} />
                {profileDropdownOpen && (
                  <ul className="profile-dropdown">
                    <li>
                      <Link to="/profilesetting">Edit Profile</Link>
                    </li>
                    <li><Link to="/settings">Settings</Link></li>
                    <li>Add Account</li>
                    <li>Logout</li>
                  </ul>
                )}
              </div>
              <span className="user-name">Admin</span>
            </div>
          </div>
        </header>

        
        <div className="switch-wrapper">
  {/* Heading Section OUTSIDE card */}
  <h2 className="switch-title">Switch Account</h2>
  <p className="switch-subtitle">
    Select an account to access different dashboard views and permissions.
  </p>
      <div className="switch-container">
      <h4 className="current-label">Current Account</h4>

      <div className="account-card">
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="Profile"
          className="account-avatar"
        />
        <div className="account-info">
          <h3 className="account-name">John Smith</h3>
          <span className="account-role">Student</span>
          <p className="account-email">john.smith@school.edu</p>
        </div>
        <div className="account-status">
          <span className="status-badge">✓ Active</span>
        </div>
      </div>
    </div>

    <div className="available-accounts">
      <h3 className="section-title">Available Accounts</h3>
      <div className="accounts-grid">
        {accounts.map((acc, index) => (
          <div className="account-cards" key={index}>
            <div className="account-header">
              <img src={acc.image} alt={acc.name} className="account-img" />
              <div>
                <h4 className="account-name">{acc.name}</h4>
                <p className="account-role" style={{ color: acc.badgeColor }}>
                  {acc.role}
                </p>
                <p className="account-email">{acc.email}</p>
              </div>
            </div>
            <div
              className="account-badge"
              style={{ backgroundColor: acc.badgeBg, color: acc.badgeColor }}
            >
              {acc.badge}
            </div>
            <button className="switch-btn">
              <FaExchangeAlt /> Switch Account
            </button>
          </div>
        ))}
      </div>
    </div>
    </div>



    <div className="add-account-card">
      <div className="add-icon">+</div>
      <h3 className="add-title">Add New Account</h3>
      <p className="add-subtitle">
        Connect additional accounts to access different dashboard views
      </p>
      <button className="add-btn">
        <UserPlus size={16} style={{ marginRight: "6px" }} />
        Add Account
      </button>
    </div>

 


       
      </div>
    </div>
  );
};

export default SwitchAccount;