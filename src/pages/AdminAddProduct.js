import { useRef, useState } from "react";
import api from "../services/api";

export default function AdminAddProduct() {

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

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

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

      Object.keys(form).forEach(key => {
        data.append(key, form[key]);
      });

      for (let i = 0; i < images.length; i++) {
        data.append("images[]", images[i]);
      }

      const res = await api.post(
        "/products/add.php",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (res.data.success) {
        alert("Product added successfully");

        setForm({
          name: "",
          description: "",
          price: "",
          price_at_me: "",
          offer_price: "",
          category: "man",
          is_new: 0,
          is_offer: 0
        });

        setImages([]);
        if (fileRef.current) {
          fileRef.current.value = "";
        }

      } else {
        alert(res.data.message || "Unauthorized");
      }

    } catch (err) {
      console.log(err);
      alert("Network Error");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>➕ Add Product</h2>

      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
      <input name="price" placeholder="Price" value={form.price} onChange={handleChange} />
      <input name="price_at_me" placeholder="Price at me" value={form.price_at_me} onChange={handleChange} />
      <input name="offer_price" placeholder="Offer Price" value={form.offer_price} onChange={handleChange} />

      <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />

      <select name="category" value={form.category} onChange={handleChange}>
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

      <label style={{ display: "block", marginTop: 10 }}>
        Product Photos
        <input
          ref={fileRef}
          type="file"
          multiple
          onChange={handleImages}
          accept="image/*"
          style={{ marginTop: 8 }}
        />
      </label>

      {images?.length ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
          {Array.from(images).map((file, idx) => (
            <div key={idx} style={{ width: 90 }}>
              <img
                alt={file.name}
                src={URL.createObjectURL(file)}
                style={{ width: 90, height: 70, objectFit: "cover", borderRadius: 6 }}
              />
              <p style={{ fontSize: 11, margin: "6px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {file.name}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      <br /><br />

      <button onClick={submit} disabled={loading}>
        {loading ? "Uploading..." : "Add Product"}
      </button>
    </div>
  );
}
