import React, { useState, useRef, useEffect } from 'react';
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
  Paperclip,
  Smile,
  Send,
  ArrowLeft,
  Menu,
  X,
} from 'lucide-react';
import './Chat.css';

const Chat = () => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState({}); // { studentId: [messages] }
  const [selectedClassSection, setSelectedClassSection] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true); // New state for sidebar
  useEffect(() => {
    const savedSidebarState = localStorage.getItem('sidebarCollapsed');
    if (savedSidebarState !== null) {
      setIsSidebarExpanded(savedSidebarState === 'false');
    }
  }, []);
  const fileInputRef = useRef(null);
  const chatBodyRef = useRef(null);

  const classSections = [
    { name: '1-A', students: [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Smith' }] },
    { name: '1-B', students: [{ id: 3, name: 'Alex Brown' }, { id: 4, name: 'Chris Green' }] },
    { name: '1-C', students: [{ id: 5, name: 'Emma Wilson' }, { id: 6, name: 'Liam Davis' }] },
    { name: '2-A', students: [{ id: 7, name: 'Olivia Taylor' }, { id: 8, name: 'Noah Miller' }] },
    { name: '2-B', students: [{ id: 9, name: 'Sophia Lee' }, { id: 10, name: 'Mason Clark' }] },
    { name: '2-C', students: [{ id: 11, name: 'Isabella Adams' }, { id: 12, name: 'Ethan King' }] },
    { name: '3-A', students: [{ id: 13, name: 'Ava Scott' }, { id: 14, name: 'James Hall' }] },
    { name: '3-B', students: [{ id: 15, name: 'Mia Young' }, { id: 16, name: 'Lucas Hill' }] },
    { name: '3-C', students: [{ id: 17, name: 'Charlotte Evans' }, { id: 18, name: 'Henry Wright' }] },
    { name: '4-A', students: [{ id: 19, name: 'Amelia Baker' }, { id: 20, name: 'Benjamin Lewis' }] },
    { name: '4-B', students: [{ id: 21, name: 'Harper Moore' }, { id: 22, name: 'Elijah Walker' }] },
    { name: '4-C', students: [{ id: 23, name: 'Evelyn Allen' }, { id: 24, name: 'Daniel Turner' }] },
    { name: '5-A', students: [{ id: 25, name: 'Abigail Green' }, { id: 26, name: 'Michael Harris' }] },
    { name: '5-B', students: [{ id: 27, name: 'Emily Nelson' }, { id: 28, name: 'William Carter' }] },
    { name: '5-C', students: [{ id: 29, name: 'Elizabeth Mitchell' }, { id: 30, name: 'Alexander Parker' }] },
    { name: '6-A', students: [{ id: 31, name: 'Sofia Roberts' }, { id: 32, name: 'Jameson Lee' }] },
    { name: '6-B', students: [{ id: 33, name: 'Avery Cook' }, { id: 34, name: 'Logan Bell' }] },
    { name: '6-C', students: [{ id: 35, name: 'Grace Ward' }, { id: 36, name: 'Jackson Reed' }] },
    { name: '7-A', students: [{ id: 37, name: 'Chloe Brooks' }, { id: 38, name: 'Samuel Gray' }] },
    { name: '7-B', students: [{ id: 39, name: 'Zoe Morgan' }, { id: 40, name: 'Joseph Adams' }] },
    { name: '7-C', students: [{ id: 41, name: 'Hannah Cooper' }, { id: 42, name: 'David Kelly' }] },
    { name: '8-A', students: [{ id: 43, name: 'Lily Price' }, { id: 44, name: 'Andrew Wood' }] },
    { name: '8-B', students: [{ id: 45, name: 'Ella Hughes' }, { id: 46, name: 'Matthew Collins' }] },
    { name: '8-C', students: [{ id: 47, name: 'Aria Bailey' }, { id: 48, name: 'Daniel Rivera' }] },
    { name: '9-A', students: [{ id: 49, name: 'Scarlett Gomez' }, { id: 50, name: 'Thomas White' }] },
    { name: '9-B', students: [{ id: 51, name: 'Penelope James' }, { id: 52, name: 'Josephine Brown' }] },
    { name: '9-C', students: [{ id: 53, name: 'Layla Davis' }, { id: 54, name: 'Henry Martinez' }] },
    { name: '10-A', students: [{ id: 55, name: 'Victoria Garcia' }, { id: 56, name: 'Gabriel Lopez' }] },
    { name: '10-B', students: [{ id: 57, name: 'Nora Perez' }, { id: 58, name: 'Julian Smith' }] },
    { name: '10-C', students: [{ id: 59, name: 'Eleanor Young' }, { id: 60, name: 'Sebastian King' }] },
    { name: '10-D', students: [{ id: 59, name: 'Eleanor Young' }, { id: 60, name: 'Sebastian King' }] },
  ];
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

  const handleImageUpload = (e) => {
    if (!selectedStudent) return;
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const now = new Date();
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages((prev) => {
        const studentMessages = prev[selectedStudent.id] || [];
        return {
          ...prev,
          [selectedStudent.id]: [
            ...studentMessages,
            { sender: "You", image: event.target.result, time, side: "right" }
          ]
        };
      });
      setTimeout(() => {
        setMessages((prev) => {
          const studentMessages = prev[selectedStudent.id] || [];
          return {
            ...prev,
            [selectedStudent.id]: [
              ...studentMessages,
              { sender: selectedStudent.name, text: "Received your image!", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), side: "left" }
            ]
          };
        });
      }, 800);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, selectedStudent]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedStudent) return;
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => {
      const studentMessages = prev[selectedStudent.id] || [];
      return {
        ...prev,
        [selectedStudent.id]: [
          ...studentMessages,
          { sender: "You", text: input, time, side: "right" }
        ]
      };
    });
    setInput("");
    setTimeout(() => {
      setMessages((prev) => {
        const studentMessages = prev[selectedStudent.id] || [];
        return {
          ...prev,
          [selectedStudent.id]: [
            ...studentMessages,
            { sender: selectedStudent.name, text: "Received: " + input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), side: "left" }
          ]
        };
      });
    }, 800);
  };

  const selectClassSection = (section) => {
    setSelectedClassSection(section);
    setSelectedStudent(null);
  };

  const selectStudent = (student) => {
    setSelectedStudent(student);
  };

  const goBackToClasses = () => {
    setSelectedClassSection(null);
    setSelectedStudent(null);
  };

  const toggleSidebar = () => {
    const newState = !isSidebarExpanded;
    setIsSidebarExpanded(newState);
    localStorage.setItem('sidebarCollapsed', (!newState).toString());
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.clear();
    setShowLogoutModal(false);
    window.location.href = "/login";
  };

  const filteredClassSections = classSections.filter(section =>
    section.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStudents = selectedClassSection
    ? selectedClassSection.students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

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
        <Link to="/chat" className="sidebar-item active">
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
        {/* Navbar */}
        <header className="header">
          <h2>Chat</h2>
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

        {/* Chat UI */}
        <div className="chat-container">
          {!selectedClassSection && !selectedStudent ? (
            <div className="dashboard-class-grid">
              {filteredClassSections.length > 0 ? (
                filteredClassSections.map((section) => (
                  <div
                    key={section.name}
                    className="dashboard-class-card"
                    onClick={() => selectClassSection(section)}
                  >
                    <h3>{section.name}</h3>
                    <p>{section.students.length} students</p>
                  </div>
                ))
              ) : (
                <p>No classes match your search.</p>
              )}
            </div>
          ) : (
            <div className="chat-content">
              {/* Left Sidebar for Students (only when a class is selected) */}
              <div className="chat-sidebar">
                {selectedClassSection && (
                  <>
                    <div className="chat-sidebar-header">
                      <button onClick={goBackToClasses}>
                        <ArrowLeft size={18} />
                      </button>
                      <h3>{selectedClassSection.name}</h3>
                    </div>
                    <ul className="student-list-scroll">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                          <li
                            key={student.id}
                            className={`student-item ${selectedStudent?.id === student.id ? 'active' : ''}`}
                            onClick={() => selectStudent(student)}
                          >
                            <div className="student-avatar">👤</div>
                            <span>{student.name}</span>
                          </li>
                        ))
                      ) : (
                        <p>No students match your search.</p>
                      )}
                    </ul>
                  </>
                )}
              </div>

              {/* Right Chat Box */}
              <div className="chat-box">
                {selectedStudent ? (
                  <>
                    <div className="chat-header">
                      <div className="chat-user-info">
                        <div className="chat-user-avatar">👤</div>
                        <div>
                          <div className="chat-username">{selectedStudent.name}</div>
                          <div className="chat-status">Online</div>
                        </div>
                      </div>
                    </div>

                    <div className="chat-body-scroll" ref={chatBodyRef}>
                      {(messages[selectedStudent.id] || []).map((msg, idx) => (
                        <div key={idx} className={`message ${msg.side}`}>
                          {msg.side === "left" && <div className="message-sender">{msg.sender}</div>}
                          <div className={`message-bubble ${msg.side === "right" ? "dark" : "light"}`}>
                            {msg.text && <span>{msg.text}</span>}
                            {msg.image && (
                              <img
                                src={msg.image}
                                alt="uploaded"
                                style={{ maxWidth: 180, maxHeight: 180, borderRadius: 8, margin: '8px 0' }}
                              />
                            )}
                            <span className="message-time">{msg.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <form className="chat-input-area" onSubmit={handleSend}>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                      >
                        <Paperclip size={18} />
                      </button>
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleImageUpload}
                      />
                      <input
                        type="text"
                        placeholder={`Message to ${selectedStudent.name}...`}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                      />
                      <Smile size={18} />
                      <button type="submit" className="send-btn">
                        <Send size={18} />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="no-chat-selected">
                    Select a student to start chatting
                  </div>
                )}
              </div>
            </div>
          )}
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

export default Chat;