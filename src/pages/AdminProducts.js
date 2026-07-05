import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  const normalizeProducts = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.products)) return data.products;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  };

  const load = useCallback(async () => {
    try {
      const res = await api.get("/products/get.php");

      setProducts(normalizeProducts(res.data));
      setError("");
    } catch (err) {
      console.log(err);
      setProducts([]);
      setError("Could not load products. Check that Apache and the PHP backend are running.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const deleteProduct = async (id) => {
    try {
      const formData = new FormData();
      formData.append("id", id);

      const res = await api.post("/products/delete.php", formData);

      if (res.data?.success === false) {
        alert(res.data.message || "Could not delete product");
        return;
      }

      load();
    } catch (err) {
      console.log(err);
      alert("Could not delete product. Check the backend connection.");
    }
  };

  return (
    <div className="page-shell">
      <h2>Products</h2>

      {error && <p className="admin-alert">{error}</p>}

      {products.length === 0 && !error && (
        <p className="empty-state">No products found.</p>
      )}

      {products.map((p) => (
        <div
          key={p.id}
          className="card admin-list-card"
          onClick={() => navigate(`/admin/products/${p.id}`)}
          style={{ cursor: "pointer" }}
        >
          <h3>{p.name}</h3>
          <p>${p.price}</p>

          <button
            onClick={(e) => {
              e.stopPropagation();
              const ok = window.confirm(
                `Are you sure you want to delete "${p.name}"?`
              );
              if (!ok) return;
              deleteProduct(p.id);
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
