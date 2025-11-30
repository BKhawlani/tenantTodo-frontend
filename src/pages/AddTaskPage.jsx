import React, { useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout/Layout";
import "./taskform.css";

function AddTaskPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("normal");
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState(""); // "success" or "error"

  const showCustomAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    
    // Hide alert after 3 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const tenantId = localStorage.getItem("tenantId");
      const token = localStorage.getItem("token");

     await api.post(
  "/task",
  {
    
    title,
    description,
    dueDate,
    priority,
     // مثلاً "2025-11-25"
  },
  {
    headers: {
      "tenant-id": localStorage.getItem("tenantId") || null
    }
  }
);


      showCustomAlert("Task added successfully! 🎉", "success");

      // Reset form
      setTitle("");
      setDescription("");
      setDueDate("");

    } catch (error) {
      console.error("Error adding task:", error);
      const errorMessage = error.response?.data?.message || "Failed to add task";
      showCustomAlert(`Error: ${errorMessage} ❌`, "error");
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <Layout>
      {/* Custom Alert */}
      {showAlert && (
        <div className={`custom-alert ${alertType}`}>
          <div className="alert-content">
            <span className="alert-icon">
              {alertType === "success" ? "✅" : "❌"}
            </span>
            <span className="alert-message">{alertMessage}</span>
            <button 
              className="alert-close"
              onClick={() => setShowAlert(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="task-form-container">
        <div className="task-form-header">
          <h2>Add New Task</h2>
          <p>Create a new task to stay organized</p>
        </div>

        <form className="task-form" onSubmit={handleAddTask}>
          {/* Title */}
          <div className="form-group">
            <label className="form-label">Task Title </label>
            <input
              type="text"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={loading}
              minLength={3}
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              placeholder="Describe the task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              rows="4"
            />
          </div>

          {/* Due Date */}
          <div className="form-group">
            <label className="form-label">Due Date </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              disabled={loading}
              min={getMinDate()}
            />
          </div>
<div className="form-group">
  <label className="form-label">Priority</label>
  <div className="select-wrapper">

  <select
    value={priority}
    onChange={(e) => setPriority(e.target.value)}
    disabled={loading}
    className="priority-select"
  >
    <option value="low">Low</option>
    <option value="Medium">Medium</option>
    <option value="high">High</option>
  </select>
  </div>
</div>
          {/* Submit */}
          <div className="form-actions">
            <button 
              type="submit" 
              className={`task-btn ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Adding Task...
                </>
              ) : (
                " Add Task"
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default AddTaskPage;