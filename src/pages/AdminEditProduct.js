import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    price_at_me: "",
    offer_price: "",
    category: "man",
    is_new: 0,
    is_offer: 0
  });

  const [existingImages, setExistingImages] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadProduct = useCallback(async () => {
    try {
      const res = await api.get(`/products/get-one.php?id=${id}`);

      if (res.data.success && res.data.product) {
        const data = res.data.product;

        setForm({
          name: data.name || "",
          description: data.description || "",
          price: data.price || "",
          price_at_me: data.price_at_me || "",
          offer_price: data.offer_price || "",
          category: data.category || "man",
          is_new: data.is_new === 1 ? 1 : 0,
          is_offer: data.is_offer === 1 ? 1 : 0
        });

        setExistingImages(data.images || []);
        setError("");
      } else {
        setError("Product not found");
      }
    } catch (err) {
      console.log(err);
      setError("Could not load product.");
    }
  }, [id]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImages = (e) => {
    setImages(e.target.files);
  };

  const submit = async () => {
    if (!form.name || !form.price) {
      alert("Name and Price are required");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("id", id);

      Object.keys(form).forEach(key => {
        data.append(key, form[key]);
      });

      for (let i = 0; i < images.length; i++) {
        data.append("images[]", images[i]);
      }

      const res = await api.post(
        "/products/update.php",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert(res.data.message || "Product updated successfully");
      navigate("/admin/products");
    } catch (err) {
      console.log(err);
      alert("Error updating product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>✏️ Edit Product</h2>

      {error && <p className="admin-alert">{error}</p>}

      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
      />

      <input
        name="price"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
      />

      <input
        name="price_at_me"
        placeholder="Price at me"
        value={form.price_at_me}
        onChange={handleChange}
      />

      <input
        name="offer_price"
        placeholder="Offer Price"
        value={form.offer_price}
        onChange={handleChange}
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
      >
        <option value="all">All</option>
        <option value="man">Man</option>
        <option value="woman">Woman</option>
        <option value="kids">Kids</option>
      </select>

      <br /><br />

      <label>
        <input
          type="checkbox"
          checked={form.is_new === 1}
          onChange={(e) =>
            setForm({ ...form, is_new: e.target.checked ? 1 : 0 })
          }
        />
        New Product
      </label>

      <br />

      <label>
        <input
          type="checkbox"
          checked={form.is_offer === 1}
          onChange={(e) =>
            setForm({ ...form, is_offer: e.target.checked ? 1 : 0 })
          }
        />
        Offer Product
      </label>

      <br /><br />

      {existingImages.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
          {existingImages.map((img, idx) => (
            <div key={idx} style={{ width: 90 }}>
              <img
                alt="product"
                src={`http://localhost/shop-aya-backend/uploads/products/${img}`}
                style={{ width: 90, height: 70, objectFit: "cover", borderRadius: 6 }}
              />
            </div>
          ))}
        </div>
      )}

      <br />

      <input ref={fileRef} type="file" multiple onChange={handleImages} />

      <br /><br />

      <button onClick={submit} disabled={loading}>
        {loading ? "Saving..." : "Update Product"}
      </button>
    </div>
  );
}
