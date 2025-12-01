import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiPlusCircle,
  FiHome,
  FiCalendar,
  FiClock,
  FiAlertOctagon ,
  FiCheckCircle,
  FiLogOut,
  FiMenu,
  FiX,
  FiActivity,

} from "react-icons/fi";
import { CgProfile } from "react-icons/cg";

import "./sidebar.css";

function Sidebar() {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
  };

  const handleLogout = () => {
    // Add your logout logic here
     localStorage.removeItem("token");
    localStorage.removeItem("tenantId");
    window.location.href = "/"
  };

  const menuItems = [
    { path: "/dashboard", icon: FiHome, label: "Dashboard" },
    { path: "/add-task", icon: FiPlusCircle, label: "Add Task" },
    { path: "/today", icon: FiCalendar, label: "Today" },
    { path: "/upcoming", icon: FiClock, label: "Upcoming" },
    { path: "/overdue", icon: FiAlertOctagon, label: "Overdue" },
    { path: "/completed", icon: FiCheckCircle, label: "Completed" ,},
    { path: "/statistics", icon: FiActivity, label: "Statistics" ,},
    { path: "/profile", icon: CgProfile, label: "Profile" ,}
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="mobile-header">
        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          {isMobileOpen ? <FiX /> : <FiMenu />}
        </button>
        <div className="mobile-logo">
          <span>Tenant</span><b>ToDo</b>
        </div>
      </div>

      {/* Overlay */}
      {isMobileOpen && (
        <div className="sidebar-overlay" onClick={closeMobileMenu}></div>
      )}

      {/* Sidebar */}
      <div className={`sidebar-modern ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo-modern">
            <span>Tenant</span><b>ToDo</b>
          </div>
          <button className="close-mobile-btn" onClick={closeMobileMenu}>
            <FiX />
          </button>
        </div>

        <ul className="sidebar-links-modern">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li 
                key={item.path} 
                className={location.pathname === item.path ? "active" : ""}
                onClick={closeMobileMenu}
              >
                <Link to={item.path}>
                  <IconComponent className="icon" /> 
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="sidebar-footer-modern">
          <button className="logout-modern" onClick={handleLogout}>
            <FiLogOut className="icon" /> Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;