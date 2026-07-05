import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadStats = useCallback(async () => {
    try {
      const res = await api.get("/admin/stats.php");

      if (res.data?.success === false) {
        setError(res.data.message || "Unauthorized");
        setStats(null);
        return;
      }

      setStats(res.data.stats);
      setError("");
    } catch (err) {
      console.log(err);
      setError("Could not load dashboard stats.");
      setStats(null);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return (
    <>
      {error && (
        <div className="admin-alert">
          {error === "Unauthorized"
            ? "This dashboard is for admin accounts only. Please login with an admin account."
            : error}
        </div>
      )}

      {!stats && !error && <h2>Loading...</h2>}

      {stats && (
        <div className="admin-stats">
          <div className="admin-stat-card">
            <h3>Total Orders</h3>
            <h2>{stats.orders}</h2>
            <button className="admin-see-all" onClick={() => navigate("/admin/orders")}>See All</button>
          </div>

          <div className="admin-stat-card">
            <h3>Total Products</h3>
            <h2>{stats.products}</h2>
            <button className="admin-see-all" onClick={() => navigate("/admin/products")}>See All</button>
          </div>

          <div className="admin-stat-card">
            <h3>Total Revenue</h3>
            <h2>${stats.sales}</h2>
          </div>

          <div className="admin-stat-card">
            <h3>Total Users</h3>
            <h2>{stats.users}</h2>
          </div>

          <div className="admin-stat-card">
            <h3>Total Reviews</h3>
            <h2>{stats.reviews}</h2>
            <button className="admin-see-all" onClick={() => navigate("/admin/reviews")}>See All</button>
          </div>

          <div className="admin-stat-card">
            <h3>Total Comments</h3>
            <h2>{stats.comments ?? 0}</h2>
            <button className="admin-see-all" onClick={() => navigate("/admin/comments")}>See All</button>
          </div>
        </div>
      )}
    </>
  );
}

