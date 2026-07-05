import { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminOrders() {

  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await api.get("/admin/orders/get.php");

      if (Array.isArray(res.data?.orders)) {
        setOrders(res.data.orders);
      } else {
        console.error("Orders data is not an array:", res.data);
        setOrders([]);
      }
    } catch (err) {
      console.log(err);
      setError("Could not load orders.");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const formData = new FormData();
      formData.append("order_id", id);
      formData.append("status", status);

      await api.post("/admin/orders/update-status.php", formData);

      loadOrders();
    } catch (err) {
      console.log(err);
      setError("Could not update order status.");
    }
  };

  const openOrder = async (order) => {
    setSelectedOrder(order);

    try {
      const res = await api.get(`/admin/orders/items.php?order_id=${order.id}`);

      if (Array.isArray(res.data?.items)) {
        setItems(res.data.items);
      } else {
        console.error("Items data is not an array:", res.data);
        setItems([]);
      }
    } catch (err) {
      console.log(err);
      setError("Could not load order items.");
    }
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setItems([]);
  };

  return (
    <div style={{ padding: 20 }}>

      <h2>Admin Orders</h2>

      {error && <div className="admin-alert">{error}</div>}

      <table border="1" width="100%" cellPadding="10">

        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(orders) && orders.map(o => (
            <tr key={o.id}>

              <td>{o.id}</td>
              <td>{o.user_name}</td>
              <td>${o.total_price}</td>
              <td>{o.status}</td>

              <td>

                <button onClick={() => openOrder(o)}>
                  View
                </button>

                <button onClick={() => updateStatus(o.id, "processing")}>
                  Processing
                </button>

                <button onClick={() => updateStatus(o.id, "shipped")}>
                  Shipped
                </button>

                <button onClick={() => updateStatus(o.id, "delivered")}>
                  Delivered
                </button>

              </td>

            </tr>
          ))}
        </tbody>

      </table>

      {selectedOrder && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.5)"
        }}>

          <div style={{
            background: "#fff",
            padding: 20,
            width: "50%",
            margin: "50px auto"
          }}>

            <h2>Order #{selectedOrder.id}</h2>
            <p>Status: {selectedOrder.status}</p>

            <h3>Items</h3>

            {Array.isArray(items) && items.map(i => (
              <div key={i.id} style={{ borderBottom: "1px solid #ddd" }}>
                <p>{i.name}</p>
                <p>Size: {i.size}</p>
                <p>Qty: {i.quantity}</p>
                <p>Price: ${i.price}</p>
              </div>
            ))}

            <button onClick={closeModal}>
              Close
            </button>

          </div>

        </div>
      )}

    </div>
  );
}