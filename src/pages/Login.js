import { useMemo, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const isSignup = location.pathname === "/signup";
  const adminMessage = location.state?.message;
  const requestedAdminPage = location.state?.from?.startsWith("/admin");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const title = useMemo(() => (isSignup ? "Create Account" : "Login"), [isSignup]);

  const saveUser = (user) => {
    if (!user) return;

    const id = user.id || user.user_id;
    const role = user.role || "user";

    if (id) {
      localStorage.setItem("user_id", id);
    }

    localStorage.setItem("role", role);
    localStorage.setItem("user", JSON.stringify(user));
    window.dispatchEvent(new Event("auth-changed"));
  };

  const submit = async () => {
    try {
      if (isSignup && !name.trim()) {
        alert("Please enter your name");
        return;
      }

      if (!email.trim() || !password.trim()) {
        alert("Please enter your email and password");
        return;
      }

      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      if (isSignup) {
        formData.append("name", name);
      }

      const endpoint = isSignup ? "register.php" : "login.php";
    const res = await axios.post(
  `http://localhost/shop-aya-backend/api/auth/${endpoint}`,
  formData,
  {
    validateStatus: () => true,
    withCredentials: true
  }
);

      if (res.data.success) {
        if (isSignup) {
          alert(res.data.message || "Account created successfully");
          navigate("/login");
          return;
        }

        if (!res.data.user) {
          alert("Login response is missing user data");
          return;
        }

        saveUser(res.data.user);

        if (requestedAdminPage && res.data.user.role !== "admin") {
          alert("This account is customer, not admin. Please login with an admin account.");
          return;
        }

        alert("Login successful");
        navigate(res.data.user?.role === "admin" ? location.state?.from || "/admin" : "/");
      } else {
        alert(res.data.message || "Please check your details");
      }
    } catch (err) {
      console.log(err);
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        (isSignup ? "Signup error" : "Login error");

      alert(message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-tabs">
          <Link className={!isSignup ? "active" : ""} to="/login">
            Login
          </Link>
          <Link className={isSignup ? "active" : ""} to="/signup">
            Sign Up
          </Link>
        </div>

        <h2>{title}</h2>

        {adminMessage && (
          <p className="auth-message">{adminMessage}</p>
        )}

        {isSignup && (
          <input
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={submit}>
          {isSignup ? "Create Account" : "Login"}
        </button>

        <button
          className="secondary-button"
          onClick={() => navigate("/admin")}
        >
          Open Dashboard
        </button>
      </div>
    </div>
  );
}
