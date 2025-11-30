import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "./layout.css";

function Layout({ children }) {
  return (
    <div className="layout-container">
      <Sidebar />
      <div className="layout-content">
        <Navbar />
        <div className="content-area">{children}</div>
      </div>
    </div>
  );
}

export default Layout;
