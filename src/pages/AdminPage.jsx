import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import "./AdminPage.css";

function AdminPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this user?")) return;

  try {
    await api.delete(`/admin/users/${id}`);
    setUsers(users.filter((u) => u.id !== id)); // تحديث الواجهة
  } catch (err) {
    console.error(err);
  }
};
const handleMakeAdmin = async (id) => {
  if (!window.confirm("Make this user an admin?")) return;

  try {
    await api.put(`/admin/users/${id}/make-admin`);

    // تحديث الواجهة
    setUsers(
      users.map((u) =>
        u.id === id ? { ...u, role: "admin" } : u
      )
    );

  } catch (err) {
    console.error(err);
  }
};
const handleRemoveAdmin = async (id) => {
  if (!window.confirm("Remove admin privileges from this user?")) return;

  try {
    const res = await api.put(`/admin/users/${id}/remove-admin`);
    const updatedUser = res.data;

    setUsers(prev =>
      prev.map((u) => (u.id === id ? updatedUser : u))
    );

  } catch (err) {
    console.error(err);
  }
};

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("isAdmin");

  window.location.href = "/"; // إعادة التوجيه لصفحة تسجيل الدخول
};


useEffect(() => {
  api.get("/admin/users")
    .then((res) => {
      console.log("ADMIN DATA:", res.data);
      setUsers(res.data);
    })
    .catch((err) => console.error(err));
}, []);
  return (

    <div className="admin-container">

      <h1 className="admin-title">Admin Dashboard</h1>
      <p className="admin-subtitle">Manage users and system statistics</p>

      {/* STAT CARDS */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{users.length}</p>
        </div>

        <div className="stat-card">
          <h3>Today Registrations</h3>
          <p>
            {
              users.filter(
                (u) => new Date(u.createdAt).toDateString() === new Date().toDateString()
              ).length
            }
          </p>
        </div>

     

        <div className="stat-card">
          <h3>Admins</h3>
          <p>{users.filter((u) => u.role === "admin").length || 1}</p>
        </div>
      </div>
        <button 
    className="dashboard-btn" 
    onClick={() => navigate("/dashboard")}
  >
    Dashboard
  </button>
            <button className="logout-btn" onClick={handleLogout}>
  Logout
</button>


      {/* USERS TABLE */}
      <div className="table-container">
        <h2 className="table-title">All Users</h2>

      <table className="admin-table">
  <thead>
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Email</th>
      <th>Registered At</th>
      <th>Tasks</th>
      <th>Make Admin</th>
      <th>Actions</th>
    </tr>
  </thead>

  <tbody>
    {users.map((u) => (
      <tr key={u.id}>
        <td>{u.id}</td>
        <td>{u.name}</td>
        <td>{u.email}</td>
        <td>{new Date(u.createdAt).toLocaleString()}</td>
        <td>{u.taskCount}</td>
       <td>
  {u.role === "admin" ? (
    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
      <span className="admin-badge">Admin</span>

      <button
        className="remove-admin-btn"
        onClick={() => handleRemoveAdmin(u.id)}
      >
        Remove
      </button>
    </div>
  ) : (
    <button
      className="make-admin-btn"
      onClick={() => handleMakeAdmin(u.id)}
    >
      Make Admin
    </button>
  )}
</td>



        <td>
          <button className="delete-btn" onClick={() => handleDelete(u.id)}>
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>


      </div>

    </div>
  );
}

export default AdminPage;
