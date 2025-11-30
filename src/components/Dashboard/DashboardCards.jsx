import React from "react";
import "./dashboard.css";

function DashboardCards() {
  return (
    <div className="cards-container">
      <div className="card">
        <h3>Total Tasks</h3>
        <p>152</p>
      </div>

      <div className="card">
        <h3>Completed</h3>
        <p>76</p>
      </div>

      <div className="card">
        <h3>Pending</h3>
        <p>42</p>
      </div>

      <div className="card">
        <h3>Overdue</h3>
        <p>34</p>
      </div>
    </div>
  );
}

export default DashboardCards;
