import { Outlet, Link } from "react-router-dom";


export default function AdminLayout() {
  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <p>Admin</p>
          <h1>Dashboard</h1>
        </div>

        <div className="admin-actions">
          <Link to="/admin/products">Products</Link>
          <Link to="/admin/products/add">Add Product</Link>
          <Link to="/admin/orders">Orders</Link>
          <Link to="/admin/reviews">Reviews</Link>
          <Link to="/admin/comments">Comments</Link>
          <Link to="/admin/analytics">Analytics</Link>
        </div>
      </div>

      <Outlet />
    </div>
  );
}

