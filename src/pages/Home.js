import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";

import CategorySection from "../components/CategorySection";
import Stars from "../components/Stars";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const category = searchParams.get("category");

  const normalizeProducts = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.products)) return data.products;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  };

  const loadProducts = useCallback(async () => {
    try {
      let url = "/products/get-with-rating.php";

      if (category) {
        url += `?category=${category}`;
      }

      const res = await api.get(url);

      setProducts(normalizeProducts(res.data));
    } catch (err) {
      console.log(err);
      setProducts([]);
    }
  }, [category]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <div className="home-page">
      <CategorySection />

      <div className="grid">
        {products.length === 0 ? (
          <p className="empty-state">No products found</p>
        ) : (
          products.map((p) => {
            const image =
              p.images && p.images.length > 0
                ? p.images[0]
                : null;

            return (
              <div
                key={p.id}
                className="card"
                onClick={() => navigate(`/product/${p.id}`)}
                style={{ cursor: "pointer" }}
              >
                <img
                  className="product-img"
                  src={
                    image
                      ? `http://localhost/shop-aya-backend/uploads/products/${image}`
                      : "https://via.placeholder.com/300"
                  }
                  alt={p.name}
                />

                <h3>{p.name}</h3>

                <Stars rating={p.avg_rating || 0} />

                <p>
                  {p.avg_rating ? p.avg_rating : "0"} stars (
                  {p.total_reviews || 0})
                </p>

                <p>
                  <b>${p.price}</b>
                </p>

                <div className="product-meta">
                  {Number(p.is_new) === 1 && (
                    <span className="badge new">NEW</span>
                  )}

                  {Number(p.is_offer) === 1 && (
                    <span className="badge offer">OFFER</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
