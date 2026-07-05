import { useEffect, useState } from "react";
import api from "../services/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [itemsMap, setItemsMap] = useState({});

  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await api.get(`/orders/get.php?user_id=${user_id}`);

      if (Array.isArray(res.data)) {
        setOrders(res.data);
      } else if (Array.isArray(res.data.orders)) {
        setOrders(res.data.orders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error(err);
      setOrders([]);
    }
  };

  const cancelOrder = async (order_id) => {
    if (!window.confirm("Cancel this order?")) return;

    const formData = new FormData();
    formData.append("order_id", order_id);
    formData.append("user_id", user_id);

    try {
      const res = await api.post("/orders/cancel.php", formData);
      if (res.data.success) {
        alert("Order cancelled");
        loadOrders();
      } else {
        alert(res.data.message || "Could not cancel");
      }
    } catch (err) {
      console.log(err);
      alert("Error cancelling order");
    }
  };

  const toggleItems = async (order_id) => {
    if (expandedId === order_id) {
      setExpandedId(null);
      return;
    }

    if (!itemsMap[order_id]) {
      try {
        const res = await api.get(`/orders/items.php?order_id=${order_id}`);

        const items = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.items)
            ? res.data.items
            : [];

        setItemsMap((prev) => ({ ...prev, [order_id]: items }));
      } catch (err) {
        console.error(err);
        return;
      }
    }

    setExpandedId(order_id);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            style={{
              border: "1px solid #ddd",
              padding: 15,
              marginBottom: 10,
              borderRadius: 8,
            }}
          >
            <h3 style={{ margin: 0 }}>Order #{order.id}</h3>
            <p>Total: ${order.total_price} | Delivery: ${order.delivery_price} | Payment: {order.payment_method} | Status: {order.status}</p>

            <button onClick={() => toggleItems(order.id)}>
              {expandedId === order.id ? "Hide Items" : "View Items"}
            </button>

            {order.status === "pending" && (
              <button
                onClick={() => cancelOrder(order.id)}
                style={{ marginLeft: 8, background: "#c9a96e" }}
              >
                Cancel
              </button>
            )}

            {expandedId === order.id && itemsMap[order.id] && (
              <div style={{ marginTop: 12, borderTop: "1px solid #eee", paddingTop: 10 }}>
                {itemsMap[order.id].length === 0 ? (
                  <p>No items</p>
                ) : (
                  itemsMap[order.id].map((item) => (
                    <div
                      key={item.id}
                      style={{
                        borderBottom: "1px solid #eee",
                        padding: "8px 0",
                      }}
                    >
                      <strong>{item.name}</strong> — Size: {item.size}, Qty: {item.quantity}, Price: ${item.price}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}