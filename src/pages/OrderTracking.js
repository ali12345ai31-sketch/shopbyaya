import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function OrderTracking() {

  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const res = await api.get(`/orders/get-one.php?id=${id}`);

      if (res.data.success) {
        setOrder(res.data.order);
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (!order) return <h2>Loading...</h2>;

  const steps = ["pending", "processing", "shipped", "delivered"];
  const isCancelled = order.status === "cancelled";

  return (
    <div style={{ padding: 20 }}>

      <h2>Order Tracking</h2>

      <h3>Order #{order.id}</h3>

      <p>
        Status: <b>{order.status}</b>
      </p>

      {order.address && <p>Address: {order.address}</p>}
      {order.phone && <p>Phone: {order.phone}</p>}

      {isCancelled ? (
        <div style={{
          padding: "10px 15px",
          borderRadius: 6,
          background: "#c9a96e",
          color: "white",
          display: "inline-block",
          textTransform: "capitalize",
          fontWeight: 600
        }}>
          Cancelled
        </div>
      ) : (
        <div style={{
          display: "flex",
          gap: 10,
          margin: "20px 0",
          flexWrap: "wrap"
        }}>
          {steps.map((step) => (
            <div
              key={step}
              style={{
                padding: "10px 15px",
                borderRadius: 6,
                background: order.status === step ? "black" : "#ddd",
                color: order.status === step ? "white" : "black",
                textTransform: "capitalize"
              }}
            >
              {step}
            </div>
          ))}
        </div>
      )}

      <h2>Items</h2>

      {(!order.items || order.items.length === 0) ? (
        <p>No items found</p>
      ) : (
        order.items.map(item => (
          <div
            key={item.id}
            style={{
              borderBottom: "1px solid #ddd",
              padding: 10
            }}
          >
            <p><b>{item.name}</b></p>
            <p>Size: {item.size}</p>
            <p>Qty: {item.quantity}</p>
            <p>Price: ${item.price}</p>
          </div>
        ))
      )}

      <h3 style={{ marginTop: 20 }}>
        Total: ${order.total_price}
      </h3>

      {order.status === "pending" && (
        <button
          onClick={async () => {
            if (!window.confirm("Cancel this order?")) return;
            const user_id = localStorage.getItem("user_id");
            const formData = new FormData();
            formData.append("order_id", order.id);
            formData.append("user_id", user_id);
            try {
              const res = await api.post("/orders/cancel.php", formData);
              if (res.data.success) {
                alert("Order cancelled");
                navigate("/orders");
              } else {
                alert(res.data.message || "Could not cancel");
              }
            } catch (err) {
              console.log(err);
              alert("Error cancelling order");
            }
          }}
          style={{ marginTop: 16, background: "#c9a96e" }}
        >
          Cancel Order
        </button>
      )}

    </div>
  );
}