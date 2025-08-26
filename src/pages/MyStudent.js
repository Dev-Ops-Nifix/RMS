import React, { useState,useEffect } from 'react';
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
  Trash,
  Plus,
  X,
  MoreVertical,
  Menu,
} from 'lucide-react';
import './MyStudent.css';

const MyStudent = () => {
  const classOptions = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  const sectionOptions = ['A', 'B', 'C', 'D'];
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true); // New state for sidebar
  useEffect(() => {
    const savedSidebarState = localStorage.getItem('sidebarCollapsed');
    if (savedSidebarState !== null) {
      setIsSidebarExpanded(savedSidebarState === 'false');
    }
  }, []);

  const [subjects, setSubjects] = useState([
    { id: 'S101', studentname: 'John Doe', class: 'IX', section: 'A', teacher: 'Mr John' },
    { id: 'S102', studentname: 'Jane Smith', class: 'I', section: 'C', teacher: 'Ms Bindhu' },
    { id: 'S103', studentname: 'Alex Brown', class: 'III', section: 'A', teacher: 'Mr Joshna' },
    { id: 'S104', studentname: 'Chris Green', class: 'VIII', section: 'B', teacher: 'Ms Jenifer' },
  ]);

  const notifications = [
    { id: 1, message: 'New message from Principal about school event', time: '2 hours ago' },
    { id: 2, message: 'Parent-Teacher meeting scheduled for Oct 15', time: '1 day ago' },
  ];

  const [viewType, setViewType] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [viewData, setViewData] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStudent, setNewStudent] = useState({
    id: '',
    studentname: '',
    class: '',
    section: '',
    teacher: '',
  });

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
    setNotificationDropdownOpen(false);
  };

  const toggleNotificationDropdown = () => {
    setNotificationDropdownOpen(!notificationDropdownOpen);
    setProfileDropdownOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    sessionStorage.clear();
    setShowLogoutModal(false);
    window.location.href = '/login';
  };
  
  const toggleSidebar = () => {
    const newState = !isSidebarExpanded;
    setIsSidebarExpanded(newState);
    localStorage.setItem('sidebarCollapsed', (!newState).toString());
  };

  const toggleMenu = (id) => {
    setMenuOpenId(menuOpenId === id ? null : id);
  };

  const filteredSubjects = subjects.filter((item) => {
    const matchesSearch =
      item.studentname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClass = selectedClass ? item.class === selectedClass : true;
    const matchesSection = selectedSection ? item.section === selectedSection : true;

    return matchesSearch && matchesClass && matchesSection;
  });

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditData({ ...item });
    setMenuOpenId(null);
  };

  const handleSave = (id) => {
    setSubjects(subjects.map((sub) => (sub.id === id ? editData : sub)));
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setSubjects(subjects.filter((sub) => sub.id !== id));
    }
    setMenuOpenId(null);
  };

  const handleView = (item) => {
    setViewData(item);
    setMenuOpenId(null);
  };

  const handleAddStudent = () => {
    if (!newStudent.id || !newStudent.studentname || !newStudent.class || !newStudent.section || !newStudent.teacher) {
      alert('Please fill all fields');
      return;
    }

    setSubjects([...subjects, newStudent]);
    setNewStudent({
      id: '',
      studentname: '',
      class: '',
      section: '',
      teacher: '',
    });
    setShowAddForm(false);
  };

  const handleNewStudentChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        <Link to="/mystudent" className="sidebar-item active">
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
        <Link to="/Chat" className="sidebar-item">
          <Trophy size={18} />
          {isSidebarExpanded && <span>Leaderboard</span>}
        </Link>
        <Link to="/plan" className="sidebar-item">
          <MessageCircle size={18} />
          {isSidebarExpanded && <span>Chat</span>}
        </Link>
        <Link to="/support" className="sidebar-item">
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
          <h2>My Student</h2>
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
                        <span className="icon">
                          <i className="fas fa-cog"></i>
                        </span>{' '}
                        Settings
                      </Link>
                      <Link to="/profilesetting" className="profile-option">
                        <span className="icon">
                          <i className="fas fa-edit"></i>
                        </span>{' '}
                        Edit
                      </Link>
                      <div
                        className="profile-option logout"
                        onClick={() => setShowLogoutModal(true)}
                      >
                        <span className="icon">
                          <i className="fas fa-sign-out-alt"></i>
                        </span>{' '}
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

        <div className="card">
          <div className="card-header">
            <h3>My Student</h3>
            <div className="dropdowns">
              <div className="view-toggle">
                <button
                  className={`toggle-option ${viewType === 'list' ? 'active' : ''}`}
                  onClick={() => setViewType('list')}
                >
                  <FileText size={16} />
                </button>
                <button
                  className={`toggle-option ${viewType === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewType('grid')}
                >
                  <LayoutDashboard size={16} />
                </button>
              </div>
              <button className="add-student-btn" onClick={() => setShowAddForm(true)}>
                <Plus size={16} />
                Add Student
              </button>
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

          <div className="academic-performance">
            <h4 className="section-title">Academic Performance</h4>
            {viewType === 'list' ? (
              <table className="performance-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Student Name</th>
                    <th>Class</th>
                    <th>Section</th>
                    <th>Teacher</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubjects.length > 0 ? (
                    filteredSubjects.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>
                          {editingId === item.id ? (
                            <input
                              value={editData.studentname}
                              onChange={(e) =>
                                setEditData({ ...editData, studentname: e.target.value })
                              }
                            />
                          ) : (
                            item.studentname
                          )}
                        </td>
                        <td>
                          {editingId === item.id ? (
                            <input
                              value={editData.class}
                              onChange={(e) =>
                                setEditData({ ...editData, class: e.target.value })
                              }
                            />
                          ) : (
                            item.class
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
                              value={editData.teacher}
                              onChange={(e) =>
                                setEditData({ ...editData, teacher: e.target.value })
                              }
                            />
                          ) : (
                            item.teacher
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
                                  <li onClick={() => handleDelete(item.id)}>
                                    <Trash size={16} className="delete-icon" /> Delete
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
            ) : (
              <div className="student-grid">
                {filteredSubjects.length > 0 ? (
                  filteredSubjects.map((item) => (
                    <div className="student-card" key={item.id}>
                      <h4>{item.studentname}</h4>
                      <p>ID: {item.id}</p>
                      <p>Class: {item.class}</p>
                      <p>Section: {item.section}</p>
                      <p>Teacher: {item.teacher}</p>
                      <div className="card-actions">
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
                              <li onClick={() => handleDelete(item.id)}>
                                <Trash size={16} className="delete-icon" /> Delete
                              </li>
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="card-subtext">No results found</p>
                )}
              </div>
            )}
          </div>

          {showAddForm && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h3>Add New Student</h3>
                  <button onClick={() => setShowAddForm(false)} className="close-btn">
                    <X size={20} />
                  </button>
                </div>
                <div className="form-group">
                  <label>Student ID</label>
                  <input
                    type="text"
                    name="id"
                    value={newStudent.id}
                    onChange={handleNewStudentChange}
                    placeholder="Enter student ID"
                  />
                </div>
                <div className="form-group">
                  <label>Student Name</label>
                  <input
                    type="text"
                    name="studentname"
                    value={newStudent.studentname}
                    onChange={handleNewStudentChange}
                    placeholder="Enter student name"
                  />
                </div>
                <div className="form-group">
                  <label>Class</label>
                  <select
                    name="class"
                    value={newStudent.class}
                    onChange={handleNewStudentChange}
                    className="form-select"
                  >
                    <option value="">Select Class</option>
                    {classOptions.map((cls, index) => (
                      <option key={index} value={cls}>
                        Class {cls}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Section</label>
                  <select
                    name="section"
                    value={newStudent.section}
                    onChange={handleNewStudentChange}
                    className="form-select"
                  >
                    <option value="">Select Section</option>
                    {sectionOptions.map((sec, index) => (
                      <option key={index} value={sec}>
                        Section {sec}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Teacher</label>
                  <input
                    type="text"
                    name="teacher"
                    value={newStudent.teacher}
                    onChange={handleNewStudentChange}
                    placeholder="Enter teacher name"
                  />
                </div>
                <div className="modal-actions">
                  <button onClick={() => setShowAddForm(false)} className="cancel-btn">
                    Cancel
                  </button>
                  <button onClick={handleAddStudent} className="submit-btn">
                    Add Student
                  </button>
                </div>
              </div>
            </div>
          )}

          {viewData && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title">Student Information</h3>
                  <button
                    onClick={() => setViewData(null)}
                    className="close-btn"
                    aria-label="Close"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="student-details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Student ID:</span>
                    <span className="detail-value">{viewData.id}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Full Name:</span>
                    <span className="detail-value">{viewData.studentname}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Class:</span>
                    <span className="detail-value">{viewData.class}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Section:</span>
                    <span className="detail-value">{viewData.section}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Assigned Teacher:</span>
                    <span className="detail-value">{viewData.teacher}</span>
                  </div>
                </div>
                <div className="modal-footer">
                  <button onClick={() => setViewData(null)} className="close-modal-btn">
                    Close Details
                  </button>
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
        </div>
      </div>
    </div>
  );
};

export default MyStudent;