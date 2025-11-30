import React, { useEffect, useState } from "react";
import api from "../api/axios";
import "../components/Dashboard/dashboard.css";
import Layout from "../components/Layout/Layout";

function Completed() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  /* -------- Load completed tasks -------- */
  useEffect(() => {
    async function loadTasks() {
      try {
        const tenantId = localStorage.getItem("tenantId");

        const res = await api.get("/task", {
          headers: { "tenant-id": tenantId }
        });

        const tasksData = res.data;

        const completedTasks = tasksData.filter(
          (t) => t.status === "completed"
        );

        setTasks(completedTasks);

      } catch (err) {
        console.error("Error loading tasks:", err);
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, []);

  /* -------- Delete Task -------- */
  const handleDelete = async (taskId) => {
    try {
      await api.delete(`/task/${taskId}`, {
        headers: { "tenant-id": localStorage.getItem("tenantId") }
      });

      setTasks(prev => prev.filter(t => t.id !== taskId));

    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  /* -------- Render UI -------- */
  return (
    <Layout>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Completed Tasks</h1>
          <p>All tasks marked as completed</p>
        </div>

        <div className="dashboard-section expanded completed-section">
          <div className="section-content">
            {loading ? (
              <p>Loading...</p>
            ) : tasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🎉</div>
                <p>No completed tasks yet!</p>
              </div>
            ) : (
              <div className="tasks-list">
                {tasks.map(task => (
                  <div key={task.id} className="task-row completed-row">

                    <div className="task-main-info">
                      <h3 className="task-title">{task.title}</h3>
                      <p className="task-description">{task.description}</p>
                    </div>
   <div className={`priority-badge ${task.priority}`}>
  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
</div>
                    <div className="task-actions">
                      <button
                        className="btn-action btn-delete"
                        onClick={() => handleDelete(task.id)}
                      >
                        🗑
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Completed;
