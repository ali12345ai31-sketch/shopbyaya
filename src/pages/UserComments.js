import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserComments() {
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  const loadComments = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost/shop-aya-backend/api/comments/get.php"
      );

      setComments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
      setComments([]);
    }
  }, []);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  return (
    <div className="page-shell">
      <h2>All Comments</h2>

      {comments.length === 0 && <p className="empty-state">No comments yet.</p>}

      {comments.map((c) => (
        <div
          key={c.id}
          style={{
            borderBottom: "1px solid #ddd",
            padding: 12,
          }}
        >
          <h4 style={{ margin: 0 }}>{c.name}</h4>
          <p style={{ margin: "4px 0" }}>{c.comment}</p>
          <small style={{ color: "#888" }}>
            {c.created_at ? new Date(c.created_at).toLocaleDateString() : ""}
          </small>
        </div>
      ))}

      <button
        onClick={() => navigate(-1)}
        style={{ marginTop: 20 }}
      >
        Back
      </button>
    </div>
  );
}