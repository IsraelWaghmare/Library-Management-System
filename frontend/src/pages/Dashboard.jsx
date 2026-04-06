import React, { useEffect, useState } from "react";
import { getStats } from "../api";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalMembers: 0,
    issuedBooks: 0,
    overdueBooks: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await getStats();
        setStats(res?.data || {});
      } catch (err) {
        console.error("Failed to load stats", err);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">📚 Library Dashboard</h1>

      <div className="card-container">
        <div className="card blue">
          <h2>{stats.totalBooks || 0}</h2>
          <p>Total Books</p>
        </div>

        <div className="card green">
          <h2>{stats.totalMembers || 0}</h2>
          <p>Total Members</p>
        </div>

        <div className="card orange">
          <h2>{stats.issuedBooks || 0}</h2>
          <p>Issued Books</p>
        </div>

        <div className="card red">
          <h2>{stats.overdueBooks || 0}</h2>
          <p>Overdue Books</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
