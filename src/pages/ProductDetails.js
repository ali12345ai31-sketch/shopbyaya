import { useEffect, useState } from "react";
import api from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import Stars from "../components/Stars";

export default function ProductDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("M");

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    loadProduct();
    loadReviews();
  }, []);

  const loadProduct = async () => {
    const res = await api.get(`/products/get-one.php?id=${id}`);

    const productData = res.data?.product;

    if (!productData) return;

    const images = Array.isArray(productData.images) ? productData.images : [];

    setProduct(productData);
    setSelectedImage(images[0] || "");
  };

  const loadReviews = async () => {
    const res = await api.get(`/reviews/get.php?product_id=${id}`);

    setReviews(Array.isArray(res.data) ? res.data : []);
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
    formData.append("product_id", id);
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
    formData.append("product_id", id);

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

  const addReview = async () => {
    const user_id = localStorage.getItem("user_id");

    if (!user_id) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", user_id);
    formData.append("product_id", id);
    formData.append("rating", rating);
    formData.append("comment", comment);

    try {
      const res = await api.post("/reviews/add.php", formData);

      if (res.data.success) {
        setComment("");
        setRating(5);
        loadReviews();
      } else {
        alert(res.data.message || "Could not submit review");
      }
    } catch (err) {
      console.log(err);
      alert("Error submitting review");
    }
  };

  if (!product) return <h2>Loading...</h2>;

  const imageSrc = selectedImage
    ? `http://localhost/shop-aya-backend/uploads/products/${selectedImage}`
    : "https://via.placeholder.com/350";

  return (
    <div style={{ padding: 20 }}>

      <div style={{ display: "flex", gap: 30 }}>

        <div>

          <img
            src={imageSrc}
            style={{
              width: 350,
              height: 350,
              objectFit: "cover",
              borderRadius: 10
            }}
          />

          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            {(Array.isArray(product.images) ? product.images : []).map((img, i) => (
              <img
                key={i}
                src={`http://localhost/shop-aya-backend/uploads/products/${img}`}
                style={{
                  width: 70,
                  height: 70,
                  objectFit: "cover",
                  cursor: "pointer",
                  border: selectedImage === img ? "2px solid black" : "1px solid #ddd"
                }}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>

        </div>

        <div style={{ maxWidth: 400 }}>

          <h1>{product.name}</h1>

          <p>{product.description}</p>

          <h2>${product.price}</h2>

          {parseFloat(product.offer_price) > 0 && (
            <h3 style={{ color: "red" }}>
              ${product.offer_price}
            </h3>
          )}

          <div>
            <h4>Select Size</h4>

            {["S", "M", "L", "XL"].map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                style={{
                  margin: 5,
                  padding: "8px 12px",
                  background: selectedSize === size ? "black" : "white",
                  color: selectedSize === size ? "white" : "black",
                  border: "1px solid #ddd",
                  cursor: "pointer"
                }}
              >
                {size}
              </button>
            ))}
          </div>

          <p>Selected Size: {selectedSize}</p>

          <div style={{ marginTop: 20 }}>

            <button onClick={addToCart} style={{ marginRight: 10 }}>
              Add to Cart
            </button>

            <button onClick={addFavorite}>
              Favorite
            </button>

          </div>

        </div>

      </div>

      <hr style={{ margin: "30px 0" }} />

      <h2>Reviews</h2>

      <div style={{ marginBottom: 20, maxWidth: 500 }}>

        <div style={{ marginBottom: 10 }}>
          <label>Rating: </label>
          <select onChange={(e) => setRating(e.target.value)} value={rating}>
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Good</option>
            <option value="3">3 - Average</option>
            <option value="2">2 - Poor</option>
            <option value="1">1 - Terrible</option>
          </select>
        </div>

        <textarea
          placeholder="Write your review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={{ width: "100%", height: 80, borderRadius: 6, padding: 8 }}
        />

        <br /><br />

        <button onClick={addReview}>
          Submit Review
        </button>

      </div>

      <div>

        {reviews.length === 0 && <p>No reviews yet.</p>}

        {reviews.map(r => (
          <div key={r.id} style={{
            borderBottom: "1px solid #ddd",
            padding: 12
          }}>
            <h4 style={{ margin: 0 }}>{r.name}</h4>
            <Stars rating={r.rating} />
            <p>{r.comment}</p>
          </div>
        ))}

      </div>

    </div>
  );
}