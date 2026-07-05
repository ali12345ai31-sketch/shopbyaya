import { useCallback, useEffect, useState } from "react";
import api from "../services/api";

export default function AdminComments() {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");

  const loadComments = useCallback(async () => {
    try {
      const res = await api.get("/admin/comments/get.php");

      if (res.data?.success === false) {
        setError(res.data.message || "Unauthorized");
        return;
      }

      setComments(Array.isArray(res.data?.comments) ? res.data.comments : []);
      setError("");
    } catch (err) {
      console.log(err);
      setError("Could not load comments.");
    }
  }, []);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const deleteComment = async (id) => {
    if (!window.confirm("Delete this comment?")) return;

    const formData = new FormData();
    formData.append("id", id);

    try {
      const res = await api.post("/admin/comments/delete.php", formData);

      if (res.data.success) {
        setComments((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert(res.data.message || "Delete failed");
      }
    } catch (err) {
      console.log(err);
      alert("Error deleting comment");
    }
  };

  return (
    <>
      {error && <div className="admin-alert">{error}</div>}

      <h2>Site Comments</h2>

      {comments.length === 0 && !error && <p>No comments found.</p>}

      {comments.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Comment</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.user_name}</td>
                <td>{c.comment}</td>
                <td>{c.created_at ? new Date(c.created_at).toLocaleDateString() : "-"}</td>
                <td>
                  <button
                    onClick={() => deleteComment(c.id)}
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