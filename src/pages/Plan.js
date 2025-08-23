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
  Pencil,
  Eye,
  MoreVertical,
  X
} from 'lucide-react';
import './Plan.css';

const Plan = () => {
  const [teachers, setTeachers] = useState([
    { id: 'T101', name: 'Mr John', email: 'john@school.edu', section: 'IX', plans: 'premium' },
    { id: 'T102', name: 'Ms Bindhu', email: 'bindhu@school.edu', section: 'I', plans: 'regular' },
    { id: 'T103', name: 'Mr Joshna', email: 'joshna@school.edu', section: 'III', plans: 'not activated' },
    { id: 'T104', name: 'Ms Josephina', email: 'josephina@school.edu', section: 'VIII', plans: 'premium' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [viewData, setViewData] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const classOptions = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  const sectionOptions = ['A', 'B', 'C', 'D', 'E'];
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const notifications = [
    { id: 1, message: 'New message from Principal about school event', time: '2 hours ago' },
    { id: 2, message: 'Parent-Teacher meeting scheduled for Oct 15', time: '1 day ago' },
  ];

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

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const toggleMenu = (id) => {
    setMenuOpenId(menuOpenId === id ? null : id);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditData({ ...item });
    setMenuOpenId(null);
  };

  const handleSave = (id) => {
    setTeachers(teachers.map(teacher => (teacher.id === id ? editData : teacher)));
    setEditingId(null);
  };

  const handleView = (item) => {
    setViewData(item);
    setMenuOpenId(null);
  };

  const filteredTeachers = teachers.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.plans.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClass = selectedClass ? item.section === selectedClass : true;
    const matchesSection = selectedSection ? item.section === selectedSection : true;

    return matchesSearch && matchesClass && matchesSection;
  });

  return (
    <div className="container">
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

      <div className="main-content">
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
            </div>
            <div className="user-info">
              <div
                className="user-avatar"
                onClick={toggleProfileDropdown}
                style={{ cursor: 'pointer', position: 'relative' }}
              >
                <User size={16} />
                {profileDropdownOpen && (
                  <ul className="profile-dropdown">
                  
                  
                   <li>
                      <Link to="/profilesetting">Edit Profile</Link>
                    </li>
                    <li><Link to="/settings">Settings</Link></li>
                  
                    <li>Logout</li>
                  </ul>
                )}
              </div>
              <span className="user-name">Admin</span>
            </div>
          </div>
        </header>

        <div className="card">
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3>Plan</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <select
                className="dropdown"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">All Classes</option>
                {classOptions.map((cls, index) => (
                  <option key={index} value={cls}>Class {cls}</option>
                ))}
              </select>
              <select
                className="dropdown"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                <option value="">All Sections</option>
                {sectionOptions.map((section, index) => (
                  <option key={index} value={section}>Section {section}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="academic-performance">
            <h4 className="section-title">Teachers Plan</h4>
            <table className="performance-table">
              <thead>
                <tr>
                  <th>Teacher ID</th>
                  <th>Teacher Name</th>
                  <th>Email</th>
                  <th>Section</th>
                  <th>Plans</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.length > 0 ? (
                  filteredTeachers.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>
                        {editingId === item.id ? (
                          <input
                            value={editData.name}
                            onChange={(e) =>
                              setEditData({ ...editData, name: e.target.value })
                            }
                          />
                        ) : (
                          item.name
                        )}
                      </td>
                      <td>
                        {editingId === item.id ? (
                          <input
                            value={editData.email}
                            onChange={(e) =>
                              setEditData({ ...editData, email: e.target.value })
                            }
                          />
                        ) : (
                          item.email
                        )}
                      </td>
                      <td>
                        {editingId === item.id ? (
                          <input
                            value={editData.section}
                            onChange={(e) =>
                              setEditData({ ...editData, section: e.target.value })
                            }
                          />
                        ) : (
                          item.section
                        )}
                      </td>
                      <td>
                        {editingId === item.id ? (
                          <input
                            value={editData.plans}
                            onChange={(e) =>
                              setEditData({ ...editData, plans: e.target.value })
                            }
                          />
                        ) : (
                          <span className="plan-with-dot">
                            <span
                              className={`plan-dot ${
                                item.plans === 'premium'
                                  ? 'premium-dot'
                                  : item.plans === 'regular'
                                  ? 'regular-dot'
                                  : 'not-activated-dot'
                              }`}
                            ></span>
                            {item.plans}
                          </span>
                        )}
                      </td>
                      <td className="action-icons">
                        {editingId === item.id ? (
                          <>
                            <button
                              className="icon-btn save-btn"
                              onClick={() => handleSave(item.id)}
                            >
                              ✔
                            </button>
                            <button
                              className="icon-btn cancel-btn"
                              onClick={() => setEditingId(null)}
                            >
                              ✖
                            </button>
                          </>
                        ) : (
                          <div className="action-menu">
                            <MoreVertical
                              size={18}
                              className="icon more-icon"
                              onClick={() => toggleMenu(item.id)}
                              title="More options"
                            />
                            {menuOpenId === item.id && (
                              <ul className="action-dropdown">
                                <li onClick={() => handleEdit(item)}>
                                  <Pencil size={16} className="edit-icon" /> Edit
                                </li>
                                <li onClick={() => handleView(item)}>
                                  <Eye size={16} className="view-icon" /> View
                                </li>
                              </ul>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>
                      No results found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {viewData && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title">Plans</h3>
                  <button 
                    onClick={() => setViewData(null)} 
                    className="close-btn"
                    aria-label="Close"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="teacher-details-grid">
                  <div className="class-section-row">
                    <div className="detail-item">
                      <span className="detail-label">Teacher ID:</span>
                      <span className="detail-value">{viewData.id}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Teacher Name:</span>
                      <span className="detail-value">{viewData.name}</span>
                    </div>
                  </div>
                  <div className="detail-item email-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{viewData.email}</span>
                  </div>
                  <div className="class-section-row">
                    <div className="detail-item">
                      <span className="detail-label">Section:</span>
                      <span className="detail-value">{viewData.section}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Plan:</span>
                      <span className="detail-value">
                        <span
                          className={`plan-dot ${
                            viewData.plans === 'premium'
                              ? 'premium-dot'
                              : viewData.plans === 'regular'
                              ? 'regular-dot'
                              : 'not-activated-dot'
                          }`}
                        ></span>
                        {viewData.plans}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    onClick={() => setViewData(null)} 
                    className="close-modal-btn"
                  >
                    Close Details
                  </button>
                </div>
              </div>
            </div>
          )}

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

export default Plan;