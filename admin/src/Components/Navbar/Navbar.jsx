import React, { useState } from 'react';
import './Navbar.css';
import navlogo from '../../assets/nav-logo.svg';
import navProfile from '../../assets/nav-profile.svg';
import { Bell, Search, Settings, LogOut, User, Moon, Sun } from 'lucide-react';

const Navbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    { id: 1, title: 'New Order Received', message: 'Order #1234 has been placed', time: '2 min ago', unread: true },
    { id: 2, title: 'Product Added', message: 'Nike Air Max has been added', time: '1 hour ago', unread: true },
    { id: 3, title: 'User Registered', message: 'New user john@example.com', time: '2 hours ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleLogout = () => {
    // Clear admin session
    localStorage.removeItem('userRole');
    localStorage.removeItem('adminDashboard');
    localStorage.removeItem('auth-token');
    
    // Redirect to main site login
    window.location.href = 'http://localhost:3000/login';
  };

  return (
    <div className='modern-navbar'>
      {/* Left Section */}
      <div className="navbar-left">
        <div className="logo-section">
          <img src={navlogo} alt="Shopper Logo" className='nav-logo' />
          <div className="logo-text">
            <h2>SHOPPER</h2>
            <span>Admin Panel</span>
          </div>
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="navbar-center">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search products, orders, users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="navbar-right">
        {/* Theme Toggle */}
        <button 
          className="icon-button theme-toggle"
          onClick={() => setIsDarkMode(!isDarkMode)}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <div className="notification-container">
          <button 
            className="icon-button notification-button"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="dropdown-header">
                <h3>Notifications</h3>
                <span className="notification-count">{unreadCount} new</span>
              </div>
              <div className="notification-list">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${notification.unread ? 'unread' : ''}`}
                  >
                    <div className="notification-content">
                      <h4>{notification.title}</h4>
                      <p>{notification.message}</p>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                    {notification.unread && <div className="unread-dot"></div>}
                  </div>
                ))}
              </div>
              <div className="dropdown-footer">
                <button className="view-all-btn">View All Notifications</button>
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <button className="icon-button" title="Settings">
          <Settings size={20} />
        </button>

        {/* Profile Dropdown */}
        <div className="profile-container">
          <button 
            className="profile-button"
            onClick={() => setShowProfile(!showProfile)}
          >
            <img src={navProfile} alt="Admin Profile" className='profile-avatar'/>
            <div className="profile-info">
              <span className="profile-name">Admin User</span>
              <span className="profile-role">Administrator</span>
            </div>
          </button>

          {showProfile && (
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <img src={navProfile} alt="Admin" className="profile-avatar-large" />
                <div>
                  <h3>Admin User</h3>
                  <p>admin@shopper.com</p>
                </div>
              </div>
              <div className="dropdown-menu">
                <button className="dropdown-item">
                  <User size={16} />
                  <span>Profile Settings</span>
                </button>
                <button className="dropdown-item">
                  <Settings size={16} />
                  <span>Admin Settings</span>
                </button>
                <hr className="dropdown-divider" />
                <button className="dropdown-item logout" onClick={handleLogout}>
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showProfile) && (
        <div 
          className="dropdown-overlay"
          onClick={() => {
            setShowNotifications(false);
            setShowProfile(false);
          }}
        />
      )}
    </div>
  );
};

export default Navbar;