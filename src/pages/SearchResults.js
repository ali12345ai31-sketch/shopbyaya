import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const q = searchParams.get("q") || "";

  const [products, setProducts] = useState([]);

  const normalizeProducts = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.products)) return data.products;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  };

  useEffect(() => {
    if (!q.trim()) {
      setProducts([]);
      return;
    }

    const searchProducts = async () => {
      try {
        const res = await api.get(`/products/search.php?q=${encodeURIComponent(q)}`);
        setProducts(normalizeProducts(res.data));
      } catch (err) {
        console.log(err);
        setProducts([]);
      }
    };

    searchProducts();
  }, [q]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [];

    return (products || []).filter((p) => {
      return p.name && p.name.toLowerCase().includes(query);
    });
  }, [products, q]);

  return (
    <div style={{ padding: 20 }}>
      <h2>
        Search Results{q ? ` for: "${q}"` : ""}
      </h2>

      {filtered.length === 0 && <p>No products found</p>}

      <div className="grid">
        {filtered.map((p) => {
          const image = p.images?.[0]
            ? `http://localhost/shop-aya-backend/uploads/products/${p.images[0]}`
            : "https://via.placeholder.com/300";

          return (
            <div
              key={p.id}
              className="card"
              onClick={() => navigate(`/product/${p.id}`)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={image}
                style={{ width: "100%", height: 200, objectFit: "cover" }}
              />

              <h3>{p.name}</h3>
              <p>${p.price}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}