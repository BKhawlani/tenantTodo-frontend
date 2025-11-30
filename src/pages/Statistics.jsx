import { useEffect, useState } from "react";
import api from "../services/api";
import {
  FiCheckCircle,
  FiClock,
  FiAlertTriangle,
  FiCalendar,
  FiTrendingUp,
  FiList
} from "react-icons/fi";
import "./Statistics.css";
import Layout from "../components/Layout/Layout";
import { isToday, isUpcoming, isOverdue } from "../utils/dateFilters"

function Statistics() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("all"); // all, week, month
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState({
    today: [],
    upcoming: [],
    completed: [],
    overdue: []
  });

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




  const allTasks = [
  ...tasks.today,
  ...tasks.upcoming,
  ...tasks.completed,
  ...tasks.overdue
];

  // Filter tasks based on time range
 const filteredTasks = allTasks.filter(task => {
  if (timeRange === "all") return true;

  const dateField = task.createdAt || task.dueDate;
  const taskDate = new Date(dateField);
  const now = new Date();
  const diffDays = (now - taskDate) / (1000 * 60 * 60 * 24);

  if (timeRange === "week") return diffDays <= 7;
  if (timeRange === "month") return diffDays <= 30;

  return true;
});
 const total = filteredTasks.length;
const completed = filteredTasks.filter(t => t.status === "completed").length;

const todayTasks = filteredTasks.filter(t => 
  isToday(t.dueDate) && t.status !== "completed"
).length;

const upcoming = filteredTasks.filter(t => 
  isUpcoming(t.dueDate) && t.status !== "completed"
).length;

const overdue = filteredTasks.filter(t => 
  isOverdue(t.dueDate) && t.status !== "completed"
).length;

const inProgress = filteredTasks.filter(t => t.status === "in-progress").length;

  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);
  const progressRate = total === 0 ? 0 : Math.round((inProgress / total) * 100);

  // Priority distribution
  const priorityCounts = {
    high: filteredTasks.filter(t => t.priority === "high").length,
    medium: filteredTasks.filter(t => t.priority === "Medium").length,
    low: filteredTasks.filter(t => t.priority === "low").length
  };

  if (loading) {
    return (
      <div className="stats-loading">
        <div className="loading-spinner"></div>
        <p>Loading statistics...</p>
      </div>
    );
  }

  return (
    <Layout>
    <div className="stats-container">
      <div className="stats-header">
        <h2 className="stats-title">Statistics Overview</h2>
        <div className="time-filter">
          <button 
            className={`time-filter-btn ${timeRange === "all" ? "active" : ""}`}
            onClick={() => setTimeRange("all")}
          >
            All Time
          </button>
          <button 
            className={`time-filter-btn ${timeRange === "month" ? "active" : ""}`}
            onClick={() => setTimeRange("month")}
          >
            Last Month
          </button>
          <button 
            className={`time-filter-btn ${timeRange === "week" ? "active" : ""}`}
            onClick={() => setTimeRange("week")}
          >
            Last Week
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">
            <FiList />
          </div>
          <div className="stat-content">
            <span className="stat-title">Total Tasks</span>
            <span className="stat-number">{total}</span>
          </div>
        </div>

        <div className="stat-card completed">
          <div className="stat-icon">
            <FiCheckCircle />
          </div>
          <div className="stat-content">
            <span className="stat-title">Completed</span>
            <span className="stat-number">{completed}</span>
            <span className="stat-percentage">{completionRate}%</span>
          </div>
        </div>



        <div className="stat-card today">
          <div className="stat-icon">
            <FiCalendar />
          </div>
          <div className="stat-content">
            <span className="stat-title">Due Today</span>
            <span className="stat-number">{todayTasks}</span>
          </div>
        </div>

        <div className="stat-card upcoming">
          <div className="stat-icon">
            <FiClock />
          </div>
          <div className="stat-content">
            <span className="stat-title">Upcoming</span>
            <span className="stat-number">{upcoming}</span>
          </div>
        </div>

        <div className="stat-card overdue">
          <div className="stat-icon">
            <FiAlertTriangle />
          </div>
          <div className="stat-content">
            <span className="stat-title">Overdue</span>
            <span className="stat-number">{overdue}</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Completion Chart */}
        <div className="chart-card">
          <h3 className="chart-title">Task Completion</h3>
          <div className="completion-chart">
            <div className="chart-bars">
              <div className="chart-bar-container">
                <div 
                  className="chart-bar completed-bar" 
                  style={{ height: `${(completed / Math.max(total, 1)) * 100}%` }}
                >
                  <span className="bar-label">{completed}</span>
                </div>
                <span className="bar-title">Completed</span>
              </div>
              <div className="chart-bar-container">
               
              </div>
              <div className="chart-bar-container">
                <div 
                  className="chart-bar pending-bar" 
                  style={{ height: `${((total - completed - inProgress) / Math.max(total, 1)) * 100}%` }}
                >
                  <span className="bar-label">{total - completed - inProgress}</span>
                </div>
                <span className="bar-title">Pending</span>
              </div>
            </div>
          </div>
        </div>

        {/* Priority Chart */}
        <div className="chart-card">
          <h3 className="chart-title">Priority Distribution</h3>
          <div className="priority-chart">
            <div className="priority-item">
              <div className="priority-dot high"></div>
              <span className="priority-label">High</span>
              <span className="priority-count">{priorityCounts.high}</span>
              <div className="priority-bar">
                <div 
                  className="priority-fill high" 
                  style={{ width: `${(priorityCounts.high / Math.max(total, 1)) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="priority-item">
              <div className="priority-dot medium"></div>
              <span className="priority-label">Medium</span>
              <span className="priority-count">{priorityCounts.medium}</span>
              <div className="priority-bar">
                <div 
                  className="priority-fill medium" 
                  style={{ width: `${(priorityCounts.medium / Math.max(total, 1)) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="priority-item">
              <div className="priority-dot low"></div>
              <span className="priority-label">Low</span>
              <span className="priority-count">{priorityCounts.low}</span>
              <div className="priority-bar">
                <div 
                  className="priority-fill low" 
                  style={{ width: `${(priorityCounts.low / Math.max(total, 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="summary-card">
        <h3 className="summary-title">Performance Summary</h3>
        <div className="summary-content">
          <div className="summary-item">
            <span className="summary-label">Overall Completion Rate</span>
            <div className="summary-progress">
              <div 
                className="summary-progress-bar" 
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
            <span className="summary-value">{completionRate}%</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Productivity Score</span>
            <div className="summary-progress">
              <div 
                className="summary-progress-bar productivity" 
                style={{ width: `${Math.min(completionRate + progressRate, 100)}%` }}
              ></div>
            </div>
            <span className="summary-value">{Math.min(completionRate + progressRate, 100)}%</span>
          </div>
        </div>
      </div>
    </div></Layout>
  );
}

export default Statistics;