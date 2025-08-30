import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
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
  Plus,
  Trash,
  Menu,
  MoreVertical,
  X,
} from 'lucide-react';
import './StudentDetail.css';

const StudentDetail = () => {
  const { id } = useParams();
  const [openSection, setOpenSection] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showAddMarksModal, setShowAddMarksModal] = useState(false);
  const [newMark, setNewMark] = useState({
    semester: 'FA1',
    subject: '',
    grade: '',
    mark: '',
    comments: ''
  });
  const [semesters, setSemesters] = useState({
    FA1: [
      { subject: "Mathematics", grade: "B+ (87%)", mark: "87/100", comments: "Good progress, but needs improvement in algebra." },
      { subject: "Science", grade: "A (95%)", mark: "95/100", comments: "Excellent understanding of scientific concepts." },
      { subject: "English", grade: "A- (92%)", mark: "92/100", comments: "Strong writing skills, could improve on grammar." },
      { subject: "History", grade: "A (96%)", mark: "96/100", comments: "Exceptional knowledge and participation in class." },
      { subject: "Art", grade: "A+ (98%)", mark: "98/100", comments: "Creative and talented artist." },
      { subject: "Physical Education", grade: "A (94%)", mark: "94/100", comments: "Great teamwork and physical abilities." },
    ],
    FA2: [],
    SA1: []
  });

  useEffect(() => {
    const savedSidebarState = localStorage.getItem('sidebarCollapsed');
    if (savedSidebarState !== null) {
      setIsSidebarExpanded(savedSidebarState === 'false');
    }
  }, []);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

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

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.clear();
    setShowLogoutModal(false);
    window.location.href = "/login";
  };

  const toggleSidebar = () => {
    const newState = !isSidebarExpanded;
    setIsSidebarExpanded(newState);
    localStorage.setItem('sidebarCollapsed', (!newState).toString());
  };

  const toggleMenu = (index) => {
    setMenuOpenId(menuOpenId === index ? null : index);
  };

  const handleEdit = (index, subject, semester) => {
    setEditingId(index);
    setEditData({ ...subject, semester });
    setMenuOpenId(null);
  };

  const handleSave = (index, semester) => {
    setSemesters(prev => ({
      ...prev,
      [semester]: prev[semester].map((sub, i) => (i === index ? editData : sub))
    }));
    setEditingId(null);
  };

  const handleDelete = (index, semester) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      setSemesters(prev => ({
        ...prev,
        [semester]: prev[semester].filter((_, i) => i !== index)
      }));
    }
    setMenuOpenId(null);
  };

  const handleChange = (e, index, semester) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
    setSemesters((prev) => ({
      ...prev,
      [semester]: prev[semester].map((sub, i) => (i === index ? { ...sub, [name]: value } : sub))
    }));
  };

  const handleNewMarkChange = (e) => {
    const { name, value } = e.target;
    setNewMark((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMark = () => {
    setSemesters(prev => ({
      ...prev,
      [newMark.semester]: [
        ...prev[newMark.semester],
        {
          subject: newMark.subject,
          grade: newMark.grade,
          mark: newMark.mark,
          comments: newMark.comments
        }
      ]
    }));
    setNewMark({
      semester: 'FA1',
      subject: '',
      grade: '',
      mark: '',
      comments: ''
    });
    setShowAddMarksModal(false);
  };

  const handleCancelAddMark = () => {
    setNewMark({
      semester: 'FA1',
      subject: '',
      grade: '',
      mark: '',
      comments: ''
    });
    setShowAddMarksModal(false);
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

      <div
        className="main-content"
        style={{ marginLeft: isSidebarExpanded ? '220px' : '60px', transition: 'margin-left 0.3s ease' }}
      >
        <header className="header">
          <h2>Student Detail</h2>
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

        <div className="report-quarter-card">
          <div className="report-quarter-header">
            <div className="title-left">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M20 2H8c-1.1 0-2 .9-2 2v14H4v2h16v-2h-2V4c0-1.1-.9-2-2-2m0 16H8V4h12Z"
                />
              </svg>
              <span>Student Detail</span>
            </div>
          </div>

          <div className="report-quarter-content">
            <div className="card-box">
              <h4>Student Information</h4>
              <div className="card-grid">
                <div><span className="label">Name:</span> {id === 'S101' ? 'John Doe' : id === 'S102' ? 'Jane Smith' : id === 'S103' ? 'Alex Brown' : 'Chris Green'}</div>
                <div><span className="label">ID:</span> {id}</div>
                <div><span className="label">Grade:</span> {id === 'S101' ? 'IX' : id === 'S102' ? 'I' : id === 'S103' ? 'III' : 'VIII'}</div>
                <div><span className="label">Class:</span> {id === 'S101' || id === 'S103' ? 'A' : id === 'S102' ? 'C' : 'B'}</div>
                <div><span className="label">Academic Year:</span> 2024-2025</div>
                <div><span className="label">Period:</span> Semester 1</div>
              </div>
            </div>

            <div className="card-box">
              <h4>Summary</h4>
              <div className="card-grid">
                <div><span className="label">Overall Grade:</span> A-</div>
                <div><span className="label">Attendance:</span> 95%</div>
                <div><span className="label">Class Rank:</span> 3/30</div>
                <div><span className="label">Behavior:</span> Excellent</div>
              </div>
            </div>
          </div>
        </div>

        <div className="semester-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4>Semester Wise</h4>
            <button className="add-student-btn" onClick={() => setShowAddMarksModal(true)}>
              <Plus size={16} />
              Add Marks
            </button>
          </div>

          {['FA1', 'FA2', 'SA1'].map((semester) => (
            <div className="accordion" key={semester}>
              <div className="accordion-header" onClick={() => toggleSection(semester)}>
                <span>{semester}</span>
                <span>{openSection === semester ? "−" : "+"}</span>
              </div>
              {openSection === semester && (
                <div className="accordion-content">
                  {semesters[semester].length > 0 ? (
                    <table className="performance-table">
                      <thead>
                        <tr>
                          <th>Subject</th>
                          <th>Grade</th>
                          <th>Mark</th>
                          <th>Comments</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {semesters[semester].map((subject, index) => (
                          <tr key={index}>
                            <td>
                              {editingId === index ? (
                                <input
                                  name="subject"
                                  value={editData.subject || subject.subject}
                                  onChange={(e) => handleChange(e, index, semester)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              ) : (
                                subject.subject
                              )}
                            </td>
                            <td>
                              {editingId === index ? (
                                <input
                                  name="grade"
                                  value={editData.grade || subject.grade}
                                  onChange={(e) => handleChange(e, index, semester)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              ) : (
                                subject.grade
                              )}
                            </td>
                            <td>
                              {editingId === index ? (
                                <input
                                  name="mark"
                                  value={editData.mark || subject.mark}
                                  onChange={(e) => handleChange(e, index, semester)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              ) : (
                                subject.mark
                              )}
                            </td>
                            <td>
                              {editingId === index ? (
                                <input
                                  name="comments"
                                  value={editData.comments || subject.comments}
                                  onChange={(e) => handleChange(e, index, semester)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              ) : (
                                subject.comments
                              )}
                            </td>
                            <td className="action-icons" onClick={(e) => e.stopPropagation()}>
                              {editingId === index ? (
                                <>
                                  <button
                                    className="icon-btn save-btn"
                                    onClick={() => handleSave(index, semester)}
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
                                    onClick={() => toggleMenu(index)}
                                    title="More options"
                                  />
                                  {menuOpenId === index && (
                                    <ul className="action-dropdown">
                                      <li onClick={() => handleEdit(index, subject, semester)}>
                                        <Pencil size={16} className="edit-icon" /> Edit
                                      </li>
                                      <li onClick={() => handleDelete(index, semester)}>
                                        <Trash size={16} className="delete-icon" /> Delete
                                      </li>
                                    </ul>
                                  )}
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No data available yet.</p>
                  )}
                </div>
              )}
            </div>
          ))}
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

        {showAddMarksModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Add New Marks</h3>
                <button className="close-btn" onClick={handleCancelAddMark}>
                  <X size={20} />
                </button>
              </div>
              <div className="form-group">
                <label>Semester</label>
                <select
                  name="semester"
                  value={newMark.semester}
                  onChange={handleNewMarkChange}
                  className="form-select"
                >
                  <option value="FA1">FA 1</option>
                  <option value="FA2">FA 2</option>
                  <option value="SA1">SA 1</option>
                </select>
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={newMark.subject}
                  onChange={handleNewMarkChange}
                  placeholder="Enter Subject Name"
                />
              </div>
              <div className="form-group">
                <label>Grade</label>
                <input
                  type="text"
                  name="grade"
                  value={newMark.grade}
                  onChange={handleNewMarkChange}
                  placeholder="Enter grade"
                />
              </div>
              <div className="form-group">
                <label>Mark</label>
                <input
                  type="text"
                  name="mark"
                  value={newMark.mark}
                  onChange={handleNewMarkChange}
                  placeholder="Enter marks"
                />
              </div>
              <div className="form-group">
                <label>Comment</label>
                <input
                  type="text"
                  name="comments"
                  value={newMark.comments}
                  onChange={handleNewMarkChange}
                  placeholder="Enter comment"
                />
              </div>
              <div className="modal-actions">
                <button onClick={handleCancelAddMark} className="cancel-btn">
                  Cancel
                </button>
                <button onClick={handleAddMark} className="submit-btn">
                  Add Marks
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDetail;