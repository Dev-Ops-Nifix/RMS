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
    Menu,
    X,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import './Settings.css';

const Settings = () => {
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [expandedSections, setExpandedSections] = useState({
        account: true,
        appearance: true,
        notifications: true,
        privacy: true
    });
    
    const notifications = [
        { id: 1, message: 'New message from Principal about school event', time: '2 hours ago' },
        { id: 2, message: 'Parent-Teacher meeting scheduled for Oct 15', time: '1 day ago' },
    ];
    
    const toggleNotificationDropdown = () => {
        setNotificationDropdownOpen(!notificationDropdownOpen);
        setProfileDropdownOpen(false); // Close profile dropdown when opening notification
    };

    const toggleProfileDropdown = () => {
        setProfileDropdownOpen(!profileDropdownOpen);
    };

    const toggleSidebar = () => {
        setIsSidebarExpanded(!isSidebarExpanded);
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleExport = () => {
        const data = 'Sample account data export';
        const blob = new Blob([data], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'account_data.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        alert('Data export initiated. Check your downloads!');
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to permanently delete your account and data? This action cannot be undone.')) {
            alert('Account deletion process started. Please contact support for confirmation.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        sessionStorage.clear();
        setShowLogoutModal(false);
        window.location.href = "/login";
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
                <div className="sidebar-item logout" onClick={() => setShowLogoutModal(true)}>
                    <LogOut size={18} />
                    {isSidebarExpanded && <span>Logout</span>}
                </div>
            </aside>

            {/* Main Content */}
            <div
                className="main-content"
                style={{ marginLeft: isSidebarExpanded ? '220px' : '60px', transition: 'margin-left 0.3s ease' }}
            >
                <header className="header">
                    <h2>Settings</h2>
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
                            <span className="user-name">Teacher Name</span>
                        </div>
                    </div>
                </header>

                <div className="settings-container">
                    {/* Account Settings Section */}
                    <div className="settings-section">
                        <div className="section-header" onClick={() => toggleSection('account')}>
                            <div className="section-title">
                                <span className="icon">🛡️</span>
                                <h3>Account Settings</h3>
                            </div>
                            {expandedSections.account ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                        {expandedSections.account && (
                            <div className="section-content">
                                <p>Manage your account security</p>
                                <div className="setting-item">
                                    <div>
                                        <h4>Change Password</h4>
                                        <p>Update your account password</p>
                                    </div>
                                    <button>Update</button>
                                </div>
                                <div className="setting-item">
                                    <div>
                                        <h4>Two-Factor Authentication</h4>
                                        <p>Add an extra layer of security</p>
                                    </div>
                                    <label className="switch">
                                        <input type="checkbox" />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Appearance Settings Section */}
                    <div className="settings-section">
                        <div className="section-header" onClick={() => toggleSection('appearance')}>
                            <div className="section-title">
                                <span className="icon">🎨</span>
                                <h3>Appearance</h3>
                            </div>
                            {expandedSections.appearance ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                        {expandedSections.appearance && (
                            <div className="section-content">
                                <p>Customize your interface theme</p>
                                <div className="setting-item">
                                    <div>
                                        <h4>Dark Mode</h4>
                                        <p>Switch to dark theme</p>
                                    </div>
                                    <label className="switch">
                                        <input type="checkbox" />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Notification Settings Section */}
                    <div className="settings-section">
                        <div className="section-header" onClick={() => toggleSection('notifications')}>
                            <div className="section-title">
                                <span className="icon">🔔</span>
                                <h3>Notifications</h3>
                            </div>
                            {expandedSections.notifications ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                        {expandedSections.notifications && (
                            <div className="section-content">
                                <p>Configure your notification preferences</p>
                                <div className="setting-item">
                                    <div>
                                        <h4>Email Alerts</h4>
                                        <p>Receive notifications via email</p>
                                    </div>
                                    <label className="switch">
                                        <input type="checkbox" />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                                <div className="setting-item">
                                    <div>
                                        <h4>SMS Alerts</h4>
                                        <p>Receive notifications via text message</p>
                                    </div>
                                    <label className="switch">
                                        <input type="checkbox" />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                                <div className="setting-item">
                                    <div>
                                        <h4>App Notifications</h4>
                                        <p>Receive push notifications in the app</p>
                                    </div>
                                    <label className="switch">
                                        <input type="checkbox" />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Privacy Settings Section */}
                    <div className="settings-section">
                        <div className="section-header" onClick={() => toggleSection('privacy')}>
                            <div className="section-title">
                                <span className="icon">🔒</span>
                                <h3>Privacy & Security</h3>
                            </div>
                            {expandedSections.privacy ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                        {expandedSections.privacy && (
                            <div className="section-content">
                                <p>Manage data privacy and account security</p>
                                <div className="setting-item">
                                    <div>
                                        <h4>Data Export</h4>
                                        <p>Download your account data</p>
                                    </div>
                                    <button className="export-btn" onClick={handleExport}>Export</button>
                                </div>
                                <div className="setting-item">
                                    <div>
                                        <h4 style={{ color: '#dc2626' }}>Delete Account</h4>
                                        <p>Permanently delete your account and data</p>
                                    </div>
                                    <button className="delete-btn" onClick={handleDelete}>Delete</button>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="action-buttons">
                        <button className="cancel-btn">Cancel</button>
                        <button className="save-btn">Save Changes</button>
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
    );
};

export default Settings;