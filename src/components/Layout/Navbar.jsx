import React, { useEffect, useState } from "react";
import "./navbar.css";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
    } catch (err) {
      console.log("Failed to load navbar user", err);
    }
  };

  return (
    <div className="navbar-modern">

      <div className="empty-space"></div>

      <div className="nav-right">

        {/* Profile Button */}
        <div className="user-info" onClick={() => navigate("/profile")}>
          <img
            src={
              user?.avatar ||
              "https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png"
            }
            className="avatar"
            alt="user"
          />

          <div className="user-text">
            <span className="user-name">{user?.name || "User"}</span>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Navbar;
