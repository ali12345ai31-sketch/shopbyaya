import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Checkout({ cart, total }) {

  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const user_id = localStorage.getItem("user_id");

  const placeOrder = async () => {

    if (!address || !phone) {
      alert("Please fill all fields");
      return;
    }

    if (!user_id) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", user_id);
    formData.append("address", address);
    formData.append("phone", phone);

    const res = await api.post("/orders/create.php", formData);

    if (res.data.success) {
      alert("Order placed successfully!");
      navigate(`/order/${res.data.order_id}`);
    } else {
      alert(res.data.message || "Could not place order");
    }
  };

  return (
    <div style={{ padding: 20 }}>

      <h1>Checkout</h1>

      {/* ADDRESS */}
      <input
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <br /><br />

      {/* PHONE */}
      <input
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <br /><br />

      {/* SUMMARY */}
      <h3>Subtotal: ${total}</h3>
      <h3>Delivery: $3</h3>
      <h2>Total: ${parseFloat(total) + 3}</h2>

      <br />

      <button onClick={placeOrder}>
        Place Order (Cash on Delivery)
      </button>

    </div>
  );
}