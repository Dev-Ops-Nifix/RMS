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
import './Support.css';

const Support = () => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);

  const [faqs, setFaqs] = useState([
    {
      id: 0,
      question: 'How to upload student marks?',
      answer: 'To upload student marks, navigate to the "Assessments" tab in the dashboard. Click on "Upload Marks" and select the class and subject. You can either enter marks manually or upload a CSV file with the predefined template. Make sure to review and confirm before finalizing the submission.',
      isOpen: false,
    },
    {
      id: 1,
      question: 'How to generate report cards?',
      answer: 'To generate report cards, go to the "Report Card" section in the dashboard. Select the desired class and period, then click "Generate Report Cards." Review the data and download or distribute the generated reports.',
      isOpen: false,
    },
    {
      id: 2,
      question: 'How to add a new subject?',
      answer: 'To add a new subject, navigate to the "Settings" tab in the dashboard. Under the "Subjects" section, click "Add Subject," enter the subject details, and save the changes.',
      isOpen: false,
    },
    {
      id: 3,
      question: 'How to reset admin password?',
      answer: 'To reset your admin password, go to the "Profile" section and click "Change Password." Follow the prompts to enter your current password and set a new one, or use the "Forgot Password" link to reset via email.',
      isOpen: false,
    },
    {
      id: 4,
      question: 'How to customize report card templates?',
      answer: 'To customize report card templates, go to the "Settings" tab and select "Report Card Templates." Choose a template, edit the layout or fields as needed, and save your changes.',
      isOpen: false,
    },
  ]);
  const notifications = [
    { id: 1, message: 'New message from Principal about school event', time: '2 hours ago' },
    { id: 2, message: 'Parent-Teacher meeting scheduled for Oct 15', time: '1 day ago' },
  ];

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const toggleFAQ = (id) => {
    setFaqs(
      faqs.map((faq) => ({
        ...faq,
        isOpen: faq.id === id ? !faq.isOpen : faq.isOpen,
      }))
    );
  };
  const toggleNotificationDropdown = () => {
    setNotificationDropdownOpen(!notificationDropdownOpen);
    setProfileDropdownOpen(false); // Close profile dropdown when opening notification
  };

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.clear();
    setShowLogoutModal(false);
    window.location.href = "/login";
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
        <Link to="/leaderboard" className="sidebar-item">
          <Trophy size={18} /> Leaderboard
        </Link>
        <Link to="/chat" className="sidebar-item">
          <MessageCircle size={18} /> Chat
        </Link>
        <Link to="/plan" className="sidebar-item">
          <Calendar size={18} /> Plan
        </Link>
        <Link to="/support" className="sidebar-item active">
          <HelpCircle size={18} /> Support
        </Link>
        <div className="sidebar-item logout" onClick={() => setShowLogoutModal(true)}>
          <LogOut size={18} /> Logout
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header className="header">
          <h2>Support Center</h2>
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

        {/* Support Center Content */}
        <div className="support-container">
          <h3>Support Center</h3>
          <p className="support-subtitle">
            Find answers to your questions about the Student Report Card
            Management System
          </p>

          <div className="search-wrapper">
            <input
              type="text"
              className="search-box"
              placeholder="Search for help or questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* FAQ Section */}
          <div className="faq-section">
            <h4>Frequently Asked Questions</h4>
            {filteredFaqs.map((faq) => (
              <div key={faq.id} className="faq-item">
                <div
                  className="faq-question"
                  onClick={() => toggleFAQ(faq.id)}
                >
                  <span>{faq.question}</span>
                  <span className="faq-toggle">
                    {faq.isOpen ? '−' : '+'}
                  </span>
                </div>
                {faq.isOpen && <p className="faq-answer">{faq.answer}</p>}
              </div>
            ))}
          </div>

          {/* Unified Support Card */}
          <div className="support-card-unified">
            <h4 className="faq-title">Chat With Our Support</h4>
            <div className="chat-support-top">
              <span role="img" aria-label="email">✉️</span>
              <div className="chat-support-text">
                <p className="support-title">Email Support</p>
                <a href="mailto:support@vault.nifx.in" className="support-email">
                  support@vault.nifx.in
                </a>
                <p className="support-note">We typically respond within 24 hours on business days</p>
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

            {/* Resources (row layout) */}
            <div className="resources-row">
              <div className="resource-item">
                <span role="img" aria-label="document">📄</span>
                <p>Documentation</p>
                <p>Detailed user guides</p>
              </div>
              <div className="resource-item">
                <span role="img" aria-label="video">📹</span>
                <p>Tutorials</p>
                <p>Step-by-step videos</p>
              </div>
              <div className="resource-item">
                <span role="img" aria-label="form">💬</span>
                <p>Contact Form</p>
                <p>Submit a ticket</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;