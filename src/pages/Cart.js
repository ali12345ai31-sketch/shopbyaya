import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Cart() {

  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    if (!user_id) {
      navigate("/login");
      return;
    }
    loadCart();
  }, []);

  const loadCart = async () => {
    const res = await api.get(`/cart/get.php?user_id=${user_id}`);
    setCart(Array.isArray(res.data) ? res.data : []);
  };

  const total = (Array.isArray(cart) ? cart : []).reduce((sum, item) => {

    const price = parseFloat(item.offer_price) || parseFloat(item.price);
    return sum + price * item.quantity;
  }, 0);

  const removeItem = async (cart_id) => {
    const formData = new FormData();
    formData.append("cart_id", cart_id);
    formData.append("user_id", user_id);

    try {
      const res = await api.post("/cart/remove.php", formData);
      if (res.data.success) {
        loadCart();
      } else {
        alert(res.data.message || "Could not remove item");
      }
    } catch (err) {
      console.log(err);
      alert("Error removing item");
    }
  };

  const checkout = async () => {

    if (!address || !phone) {
      alert("Please enter your address and phone");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", user_id);
    formData.append("address", address);
    formData.append("phone", phone);

    const res = await api.post("/orders/create.php", formData);

    if (res.data.success) {
      alert("Order placed successfully!");
      loadCart();
    } else {
      alert(res.data.message || "Could not place order");
    }
  };

  return (
    <div style={{ padding: 20 }}>

      <h2>Cart</h2>

      {cart.length === 0 && <p>Your cart is empty</p>}

      {cart.map(item => (
        <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 16, borderBottom: "1px solid var(--border)", padding: "12px 0" }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0 }}>{item.name}</h3>
            <p style={{ margin: "4px 0" }}>Size: {item.size} | Qty: {item.quantity}</p>
            <p style={{ margin: 0, fontWeight: 600 }}>${(parseFloat(item.offer_price) || parseFloat(item.price)) * item.quantity}</p>
          </div>
          <button
            onClick={() => removeItem(item.id)}
            style={{ background: "transparent", color: "red", border: "1px solid red", borderRadius: 6, padding: "6px 14px", minHeight: "auto", fontSize: "0.8rem" }}
          >
            Remove
          </button>
        </div>
      ))}

      <hr />

      <h3>Subtotal: ${total.toFixed(2)}</h3>
      <h3>Delivery: $3</h3>
      <h2>Total: ${(total + 3).toFixed(2)}</h2>

      <br />

      <input
        placeholder="Delivery Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <br /><br />

      <button onClick={checkout}>
        Place Order (Cash on Delivery)
      </button>

    </div>
  );
}