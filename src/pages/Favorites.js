import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Favorites() {
  const [fav, setFav] = useState([]);
  const navigate = useNavigate();

  const user_id = localStorage.getItem("user_id");

  const normalizeFavorites = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.favorites)) return data.favorites;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.products)) return data.products;
    return [];
  };

  const loadFav = useCallback(async () => {
    if (!user_id) {
      setFav([]);
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost/shop-aya-backend/api/favorites/get.php?user_id=${user_id}`
      );

      setFav(normalizeFavorites(res.data));
    } catch (err) {
      console.log(err);
      setFav([]);
    }
  }, [user_id]);

  useEffect(() => {
    loadFav();
  }, [loadFav]);

  const removeFav = async (favId, e) => {
    e.stopPropagation();

    const formData = new FormData();
    formData.append("id", favId);
    if (user_id) formData.append("user_id", user_id);

    try {
      const res = await axios.post(
        "http://localhost/shop-aya-backend/api/favorites/remove.php",
        formData
      );

      if (res.data.success) {
        setFav((prev) => prev.filter((p) => (p.id || p.product_id) !== favId));
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="page-shell">
      <h2>Favorites</h2>

      {!user_id && (
        <p className="empty-state">Please login to see your favorites.</p>
      )}

      {user_id && fav.length === 0 && (
        <p className="empty-state">No favorites found.</p>
      )}

      {fav.length > 0 && (
        <div className="grid">
          {fav.map((p) => {
            const image =
              p.images && p.images.length > 0
                ? p.images[0]
                : p.image;

            return (
              <div
                key={p.id || p.product_id}
                className="card"
                onClick={() => navigate(`/product/${p.product_id || p.id}`)}
                style={{ cursor: "pointer", position: "relative" }}
              >
                <button
                  onClick={(e) => removeFav(p.id, e)}
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    background: "red",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    padding: "4px 8px",
                    cursor: "pointer",
                    zIndex: 2,
                  }}
                >
                  Remove
                </button>

                <img
                  className="product-img"
                  src={
                    image
                      ? `http://localhost/shop-aya-backend/uploads/products/${image}`
                      : "https://via.placeholder.com/300"
                  }
                  alt={p.name || "Favorite product"}
                />

                <h3>{p.name}</h3>
                <p>${parseFloat(p.offer_price) || parseFloat(p.price)}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
