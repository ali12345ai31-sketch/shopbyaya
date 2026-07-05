import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Footer() {
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    const text = comment.trim();
    if (!text) return;

    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
      alert("Please login to send a comment.");
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", user_id);
    formData.append("comment", text);

    try {
      const res = await axios.post(
        "http://localhost/shop-aya-backend/api/comments/add.php",
        formData
      );

      if (res.data.success) {
        alert("Thank you! Your comment was sent. ✅");
        setComment("");
      } else {
        alert(res.data.message || "Could not send comment");
      }
    } catch (err) {
      console.log(err);
      alert("Error sending comment");
    }
  };

  return (
    <footer className="footer-page">
      <div className="footer-inner">
        <div className="footer-col">
          <h3>Information</h3>
          <p>
            Shop Aya — products you love, fast delivery, and great customer service.
          </p>
          <p>
            For any question, contact us on WhatsApp: <b><a href="https://wa.me/96103455670" target="_blank" rel="noopener noreferrer" style={{ color: "#c9a96e" }}>03/455670</a></b>
          </p>
        </div>

        <div className="footer-col">
          <h3>Privacy Policy</h3>
          <p>
            Your data is handled responsibly. This is a frontend demo layout—connect
            with your real policy page when available.
          </p>
        </div>

        <div className="footer-col">
          <h3>Send Comment</h3>
          <div className="footer-comment-box">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comment..."
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={submit} disabled={!comment.trim()}>
                Send
              </button>
              <button onClick={() => navigate("/comments")}>
                See All
              </button>
            </div>
          </div>

          <div className="footer-social">
            <a
              href="https://www.tiktok.com/@ayas.shopp"
              target="_blank"
              rel="noopener noreferrer"
            >
              TikTok
            </a>
            <a
              href="https://www.instagram.com/trendyyby.ayaa/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            <a
              className="footer-whatsapp-link"
              href="https://wa.me/96103455670"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 6, verticalAlign: "middle" }}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">© {new Date().getFullYear()} Shop Aya</div>
    </footer>
  );
}