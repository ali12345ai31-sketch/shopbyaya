import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {

  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState("M");

  const goToProduct = () => {
    navigate(`/product/${product.id}`);
  };

  const addToCart = async () => {

    const user_id = localStorage.getItem("user_id");

    if (!user_id) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", user_id);
    formData.append("product_id", product.id);
    formData.append("size", selectedSize);
    formData.append("quantity", 1);

    try {
      const res = await api.post("/cart/add.php", formData);

      if (res.data.success) {
        alert("Added to cart");
      } else {
        alert(res.data.message || "Could not add to cart");
      }

    } catch (err) {
      console.log(err);
      alert("Error adding to cart");
    }
  };

  const addFavorite = async () => {

    const user_id = localStorage.getItem("user_id");

    if (!user_id) {
      alert("Please login to add favorites");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", user_id);
    formData.append("product_id", product.id);

    try {
      const res = await api.post("/favorites/add.php", formData);

      if (res.data.success) {
        alert("Added to favorites");
      } else {
        alert(res.data.message || "Could not add to favorites");
      }

    } catch (err) {
      console.log(err);
      alert("Error adding favorite");
    }
  };

  const image =
    product.images && product.images.length > 0
      ? product.images[0]
      : null;

  return (
    <div className="card">

      <img
        onClick={goToProduct}
        src={
          image
            ? `http://localhost/shop-aya-backend/uploads/products/${image}`
            : "https://via.placeholder.com/300"
        }
        className="product-img"
        style={{ cursor: "pointer" }}
      />

      {product.is_new == 1 && (
        <span className="badge new">NEW</span>
      )}

      {product.is_offer == 1 && (
        <span className="badge offer">OFFER</span>
      )}

      <h3>{product.name}</h3>

      <p>
        {parseFloat(product.offer_price) > 0 ? (
          <>
            <span style={{ textDecoration: "line-through", color: "gray" }}>
              ${product.price}
            </span>{" "}
            <span style={{ color: "red" }}>
              ${product.offer_price}
            </span>
          </>
        ) : (
          <>${product.price}</>
        )}
      </p>

      <div className="sizes">
        {["S", "M", "L", "XL"].map(size => (
          <span
            key={size}
            onClick={() => setSelectedSize(size)}
            style={{
              margin: 2,
              padding: "4px 8px",
              border: "1px solid black",
              cursor: "pointer",
              background: selectedSize === size ? "black" : "white",
              color: selectedSize === size ? "white" : "black"
            }}
          >
            {size}
          </span>
        ))}
      </div>

      <p>Selected: {selectedSize}</p>

      <button onClick={addToCart}>
        Add to Cart
      </button>

      <button onClick={addFavorite}>
        Favorite
      </button>

    </div>
  );
}