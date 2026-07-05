import { useCallback, useEffect, useState } from "react";
import api from "../services/api";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");

  const loadReviews = useCallback(async () => {
    try {
      const res = await api.get("/admin/reviews/get.php");

      if (res.data?.success === false) {
        setError(res.data.message || "Unauthorized");
        return;
      }

      setReviews(Array.isArray(res.data?.reviews) ? res.data.reviews : []);
      setError("");
    } catch (err) {
      console.log(err);
      setError("Could not load reviews.");
    }
  }, []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const deleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;

    const formData = new FormData();
    formData.append("id", id);

    try {
      const res = await api.post("/admin/reviews/delete.php", formData);

      if (res.data.success) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
      } else {
        alert(res.data.message || "Delete failed");
      }
    } catch (err) {
      console.log(err);
      alert("Error deleting review");
    }
  };

  return (
    <>
      {error && <div className="admin-alert">{error}</div>}

      <h2>Reviews</h2>

      {reviews.length === 0 && !error && <p>No reviews found.</p>}

      {reviews.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Product</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.user_name}</td>
                <td>{r.product_name}</td>
                <td>{r.rating} / 5</td>
                <td>{r.comment || "-"}</td>
                <td>{r.created_at ? new Date(r.created_at).toLocaleDateString() : "-"}</td>
                <td>
                  <button
                    onClick={() => deleteReview(r.id)}
                    style={{ background: "red", color: "white", border: "none", borderRadius: 4, padding: "4px 10px", cursor: "pointer" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}