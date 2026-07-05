import { useCallback, useEffect, useState } from "react";
import axios from "axios";

export default function AdminAnalytics() {
  const [data, setData] = useState({});
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost/shop-aya-backend/api/admin/sales.php",
        { validateStatus: () => true, withCredentials: true }
      );

      // The backend may return different key casing.


      if (res.data?.success === false) {
        setError(res.data.message || "Could not load analytics.");
        setData({});
        return;
      }

      setData(res.data || {});
      setError("");
    } catch (err) {
      console.log(err);
      setError("Could not load analytics. Check that Apache and the PHP backend are running.");
      setData({});
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <p>Admin</p>
          <h1>Sales Analytics</h1>
        </div>
      </div>

      {error && <div className="admin-alert">{error}</div>}

      {!error && (
        <div className="admin-stats">
          <div className="admin-stat-card">
            <h3>Total Revenue</h3>
            <h2>${data.totalRevenue || 0}</h2>
          </div>

          <div className="admin-stat-card">
            <h3>Total Orders</h3>
            <h2>{data.totalOrders || 0}</h2>
          </div>

          <div className="admin-stat-card">
            <h3>Today Revenue</h3>
            <h2>${data.todayRevenue || 0}</h2>
          </div>

          <div className="admin-stat-card">
            <h3>Today Orders</h3>
            <h2>{data.todayOrders || 0}</h2>
          </div>

          <div className="admin-stat-card">
            <h3>Total Win (Profit)</h3>
            <h2>${data.totalWin || 0}</h2>
          </div>

          <div className="admin-stat-card">
            <h3>This Month Win</h3>
            <h2>${data.monthWin || 0}</h2>
          </div>

          <div className="admin-stat-card">
            <h3>Today Win</h3>
            <h2>${data.dayWin || 0}</h2>
          </div>

          <div className="admin-stat-card">
            <h3>Best Selling Product</h3>
            <h2>
              {data.bestProduct?.name || "None"} ({data.bestProduct?.total_sold || 0})
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}
