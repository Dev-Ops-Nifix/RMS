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
  Trash,
  Plus,
  X,
  MoreVertical
} from 'lucide-react';
import './MyTeacher.css';

const MyTeacher = () => {
  const classOptions = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  const sectionOptions = ['A', 'B', 'C', 'D'];
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);

  const [teachers, setTeachers] = useState([
    { id: 'T101', teachername: 'Mr John', email: 'john@school.edu', course: 'Mathematics', class: 'IX', section: 'A' },
    { id: 'T102', teachername: 'Ms Bindhu', email: 'bindhu@school.edu', course: 'Science', class: 'I', section: 'C' },
    { id: 'T103', teachername: 'Mr Joshna', email: 'joshna@school.edu', course: 'English', class: 'III', section: 'A' },
    { id: 'T104', teachername: 'Ms Josephina', email: 'josephina@school.edu', course: 'History', class: 'VIII', section: 'B' }
  ]);
  const notifications = [
    { id: 1, message: 'New message from Principal about school event', time: '2 hours ago' },
    { id: 2, message: 'Parent-Teacher meeting scheduled for Oct 15', time: '1 day ago' },
  ];
  const toggleNotificationDropdown = () => {
    setNotificationDropdownOpen(!notificationDropdownOpen);
    setProfileDropdownOpen(false); // Close profile dropdown when opening notification
  };
  const [viewType, setViewType] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [viewData, setViewData] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [newTeacher, setNewTeacher] = useState({
    id: '',
    teachername: '',
    email: '',
    course: '',
    class: '',
    section: ''
  });
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState(null);

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const toggleMenu = (id) => {
    setMenuOpenId(menuOpenId === id ? null : id);
  };

  const filteredTeachers = teachers.filter(item => {
    const matchesSearch =
      item.teachername.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    setTeachers(teachers.map(teacher => (teacher.id === id ? editData : teacher)));
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      setTeachers(teachers.filter(teacher => teacher.id !== id));
    }
    setMenuOpenId(null);
  };

  const handleView = (item) => {
    setViewData(item);
    setMenuOpenId(null);
  };

  const handleAddTeacher = () => {
    if (!newTeacher.id || !newTeacher.teachername || !newTeacher.email || !newTeacher.course || !newTeacher.class || !newTeacher.section) {
      alert('Please fill all fields');
      return;
    }
    
    setTeachers([...teachers, newTeacher]);
    setNewTeacher({
      id: '',
      teachername: '',
      email: '',
      course: '',
      class: '',
      section: ''
    });
    setShowAddForm(false);
  };

  const handleNewTeacherChange = (e) => {
    const { name, value } = e.target;
    setNewTeacher(prev => ({
      ...prev,
      [name]: value
    }));
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

  return (
    <div className="container">
      <aside className="sidebar">
        <Link to="/dashboard" className="sidebar-item">
          <LayoutDashboard size={18} />
          Dashboard
        </Link>
        <Link to="/mystudent" className="sidebar-item">
          <User size={18} />
          My Student
        </Link>
        <Link to="/myteacher" className="sidebar-item active">
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
        <Link to="/Chat" className="sidebar-item">
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
        <div className="sidebar-item logout" onClick={() => setShowLogoutModal(true)}>
          <LogOut size={18} /> Logout
        </div>
      </aside>

      <div className="main-content">
        <header className="header">
          <h2>My Teacher</h2>
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
  )}</div>
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

        <div className="card">
          <div className="card-header">
            <h3>My Teacher</h3>
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
              <button
                className="add-teacher-btn"
                onClick={() => setShowAddForm(true)}
              >
                <Plus size={16} />
                Add Teacher
              </button>
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
                {sectionOptions.map((sec, index) => (
                  <option key={index} value={sec}>Section {sec}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="academic-performance">
            <h4 className="section-title">Teacher List</h4>
            {viewType === 'list' ? (
              <table className="performance-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Teacher Name</th>
                    <th>Email</th>
                    <th>Course Specialized</th>
                    <th>Class</th>
                    <th>Section</th>
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
                              value={editData.teachername}
                              onChange={(e) =>
                                setEditData({ ...editData, teachername: e.target.value })
                              }
                            />
                          ) : (
                            item.teachername
                          )}
                        </td>
                        <td>
                          {editingId === item.id ? (
                            <input
                              type="email"
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
                              value={editData.course}
                              onChange={(e) =>
                                setEditData({ ...editData, course: e.target.value })
                              }
                            />
                          ) : (
                            item.course
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
                      <td colSpan="7" style={{ textAlign: 'center' }}>
                        No results found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <div className="teacher-grid">
                {filteredTeachers.length > 0 ? (
                  filteredTeachers.map((item) => (
                    <div className="teacher-card" key={item.id}>
                      <h4>{item.teachername}</h4>
                      <p>ID: {item.id}</p>
                      <p>Email: {item.email}</p>
                      <p>Course: {item.course}</p>
                      <p>Class: {item.class}</p>
                      <p>Section: {item.section}</p>
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
                  <p className="card-subtext">
                    No results found
                  </p>
                )}
              </div>
            )}
          </div>

          {showAddForm && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h3>Add New Teacher</h3>
                  <button onClick={() => setShowAddForm(false)} className="close-btn">
                    <X size={20} />
                  </button>
                </div>
                <div className="form-group">
                  <label>Teacher ID</label>
                  <input
                    type="text"
                    name="id"
                    value={newTeacher.id}
                    onChange={handleNewTeacherChange}
                    placeholder="Enter teacher ID"
                  />
                </div>
                <div className="form-group">
                  <label>Teacher Name</label>
                  <input
                    type="text"
                    name="teachername"
                    value={newTeacher.teachername}
                    onChange={handleNewTeacherChange}
                    placeholder="Enter teacher name"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newTeacher.email}
                    onChange={handleNewTeacherChange}
                    placeholder="Enter teacher email"
                  />
                </div>
                <div className="form-group">
                  <label>Course Specialized</label>
                  <input
                    type="text"
                    name="course"
                    value={newTeacher.course}
                    onChange={handleNewTeacherChange}
                    placeholder="Enter course specialization"
                  />
                </div>
                <div className="form-group">
                  <label>Class</label>
                  <select
                    name="class"
                    value={newTeacher.class}
                    onChange={handleNewTeacherChange}
                    className="form-select"
                  >
                    <option value="">Select Class</option>
                    {classOptions.map((cls, index) => (
                      <option key={index} value={cls}>Class {cls}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Section</label>
                  <select
                    name="section"
                    value={newTeacher.section}
                    onChange={handleNewTeacherChange}
                    className="form-select"
                  >
                    <option value="">Select Section</option>
                    {sectionOptions.map((sec, index) => (
                      <option key={index} value={sec}>Section {sec}</option>
                    ))}
                  </select>
                </div>
                <div className="modal-actions">
                  <button onClick={() => setShowAddForm(false)} className="cancel-btn">
                    Cancel
                  </button>
                  <button onClick={handleAddTeacher} className="submit-btn">
                    Add Teacher
                  </button>
                </div>
              </div>
            </div>
          )}

          {viewData && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title">Teacher Information</h3>
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
                    <span className="detail-label">Teacher ID:</span>
                    <span className="detail-value">{viewData.id}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Full Name:</span>
                    <span className="detail-value">{viewData.teachername}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{viewData.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Course Specialized:</span>
                    <span className="detail-value">{viewData.course}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Class:</span>
                    <span className="detail-value">{viewData.class}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Section:</span>
                    <span className="detail-value">{viewData.section}</span>
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

export default MyTeacher;

