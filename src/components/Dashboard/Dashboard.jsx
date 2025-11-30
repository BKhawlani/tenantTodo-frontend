import React, { useEffect, useState } from "react";
import { isToday, isUpcoming, isOverdue } from "../../utils/dateFilters";
import api from "../../api/axios";
import "./dashboard.css";
import { toast } from "react-toastify";


function Dashboard() {
  /* ---------------------- STATE ---------------------- */
  const [tasks, setTasks] = useState({
    today: [],
    upcoming: [],
    completed: [],
    overdue: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSection, setExpandedSection] = useState("today");

  // Edit modal state
  const [editingTask, setEditingTask] = useState(null);

  // Delete dialog state
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    taskId: null,
  });


  /* ---------------------- LOAD TASKS ---------------------- */
  useEffect(() => {
    async function loadTasks() {
      try {
        setLoading(true);

        const res = await api.get("/task", {
          headers: {
          }
        });

        const tasksData = res.data;

     setTasks({
  today: tasksData.filter(t => 
    isToday(t.dueDate) && t.status !== "completed"
  ),

  upcoming: tasksData.filter(t => 
    isUpcoming(t.dueDate) && t.status !== "completed"
  ),

  completed: tasksData.filter(t => 
    t.status === "completed"
  ),

  overdue: tasksData.filter(t => 
    isOverdue(t.dueDate) && t.status !== "completed"
  )
});

      } catch (err) {
        console.error("Failed to load tasks:", err);
        setError("Failed to load tasks. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, []);

  /* ---------------------- DELETE TASK ---------------------- */
  const handleDelete = async (taskId) => {
    try {
      await api.delete(`/task/${taskId}`);

      // Update UI
      setTasks(prev => ({
        today: prev.today.filter(t => t.id !== taskId),
        upcoming: prev.upcoming.filter(t => t.id !== taskId),
        completed: prev.completed.filter(t => t.id !== taskId),
        overdue: prev.overdue.filter(t => t.id !== taskId),
      }));

      setDeleteConfirm({ show: false, taskId: null });
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete task");
    }
  };

  /* ---------------------- UPDATE TASK ---------------------- */
  const handleUpdate = async () => {
    try {
      await api.put(`/task/${editingTask.id}`, editingTask);

      // Update UI
      setTasks(prev => {
        const update = (arr) =>
          arr.map(t => (t.id === editingTask.id ? editingTask : t));

        return {
          today: update(prev.today),
          upcoming: update(prev.upcoming),
          completed: update(prev.completed),
          overdue: update(prev.overdue),
        };
      });

      setEditingTask(null);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update task");
    }
  };
const handleComplete = async (task) => {
  try {
    await api.put(
      `/task/${task.id}`,
      { status: "completed" }, 
    
    );

    setTasks(prev => ({
      today: prev.today.filter(t => t.id !== task.id),
      upcoming: prev.upcoming.filter(t => t.id !== task.id),
      overdue: prev.overdue.filter(t => t.id !== task.id),
      completed: [
        ...prev.completed,
        { ...task, status: "completed" } 
      ]
    }));

  } catch (err) {
    console.error("Status update failed:", err);
    alert("Failed to mark task as completed");
  }
};



  /* ---------------------- UI HELPERS ---------------------- */
  const toggleSection = (section) =>
    setExpandedSection(expandedSection === section ? null : section);

  /* ---------------------- COMPONENTS ---------------------- */
  const TaskCard = ({ task, type = "default" }) => (
    <div className={`task-row ${type}-row`}>
      <div className="task-main-info">
        <h3 className="task-title">{task.title}</h3>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
      </div>
<div className={`priority-badge ${task.priority}`}>
  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
</div>

      <div className="task-meta-info">
        {task.dueDate && (
          <span className="task-date">
            <i className="icon-calendar"></i>
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="task-actions">
        {task.status !== "completed" && (
  <button 
    className="btn-action btn-complete"
    onClick={() => handleComplete(task)}
  >
    <i className="icon-check"></i>
  </button>

)}


        <button
          className="btn-action btn-delete"
          onClick={() => setDeleteConfirm({ show: true, taskId: task.id })}
        >
          <i className="icon-delete"></i>
        </button>
     

      </div>
    </div>
  );

  const Section = ({ title, tasks, type, emptyMessage }) => (
    <div className={`dashboard-section ${type}-section ${expandedSection === type ? "expanded" : ""}`}>
      <div className="section-header" onClick={() => toggleSection(type)}>
        <div className="section-title">
          <h2 className={`section-name ${type}`}>
            {title} <span className="task-count">{tasks.length}</span>
          </h2>
        </div>

        <div className="section-toggle">
          <i className={`icon-chevron ${expandedSection === type ? "up" : "down"}`}></i>
        </div>
      </div>

      <div className="section-content">
        {tasks.length > 0 ? (
          <div className="tasks-list">
            {tasks.map(task => (
              <TaskCard key={task.id} task={task} type={type} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <p>{emptyMessage}</p>
          </div>
        )}
      </div>
    </div>
  );

  /* ---------------------- LOADING / ERROR ---------------------- */
  if (loading) return <div className="dashboard-container">Loading...</div>;
  if (error) return <div className="dashboard-container">{error}</div>;

  /* ---------------------- RENDER ---------------------- */
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Task Dashboard</h1>
        <p>Manage your tasks efficiently</p>
      </div>

      <div className="dashboard-sections">
        <Section title="Today's Tasks" tasks={tasks.today} type="today" emptyMessage="No tasks for today." />
        <Section title="Upcoming Tasks" tasks={tasks.upcoming} type="upcoming" emptyMessage="No upcoming tasks." />
        <Section title="Completed Tasks" tasks={tasks.completed} type="completed" emptyMessage="No completed tasks." />
        <Section title="Overdue Tasks" tasks={tasks.overdue} type="overdue" emptyMessage="No overdue tasks." />
      </div>

      {/* ---------------------- DELETE DIALOG ---------------------- */}
      {deleteConfirm.show && (
        <div className="alert-overlay">
          <div className="alert-box">
            <h2>Delete Task</h2>
            <p>This action cannot be undone. Are you sure?</p>

            <div className="alert-actions">
              <button
                className="btn-cancel"
                onClick={() => setDeleteConfirm({ show: false, taskId: null })}
              >
                Cancel
              </button>

              <button
                className="btn-delete-dialog"
                onClick={() => handleDelete(deleteConfirm.taskId)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------- EDIT MODAL ---------------------- */}
      {editingTask && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Task</h2>

            <input
              type="text"
              value={editingTask.title}
              onChange={(e) =>
                setEditingTask({ ...editingTask, title: e.target.value })
              }
            />

            <textarea
              value={editingTask.description || ""}
              onChange={(e) =>
                setEditingTask({ ...editingTask, description: e.target.value })
              }
            ></textarea>

            <button className="btn-save" onClick={handleUpdate}>Save</button>
            <button className="btn-cancel" onClick={() => setEditingTask(null)}>Cancel</button>
          </div>
        </div>
      )}
      
    </div>
  );
}

export default Dashboard;
