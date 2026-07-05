import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import api from "../services/api";
import logo from "../assets/logo.png.jpg";


function SearchLink({ navigate }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const onSearch = () => {
    const q = value.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setOpen(false);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        className="settings-button"
        style={{ padding: "8px 13px", background: "transparent", border: "1px solid transparent" }}
        onClick={() => setOpen((s) => !s)}
        aria-expanded={open}
      >
        Search
      </button>

      {open && (
        <div className="settings-dropdown" style={{ minWidth: 260 }}>
          <div style={{ display: "grid", gap: 8 }}>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Search products..."
            />
            <button onClick={onSearch}>Search</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {

  const [user, setUser] = useState(null);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchCounts = async (userId) => {
    if (!userId) {
      setFavoriteCount(0);
      setCartCount(0);
      return;
    }

    try {
      const [favRes, cartRes] = await Promise.all([
        api.get(`/favorites/get.php?user_id=${userId}`),
        api.get(`/cart/get.php?user_id=${userId}`)
      ]);

      if (favRes.data?.success) {
        setFavoriteCount(favRes.data.favorites?.length || 0);
      }

      if (Array.isArray(cartRes.data)) {
        setCartCount(cartRes.data.length);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const syncUser = () => {
      const id = localStorage.getItem("user_id");
      const role = localStorage.getItem("role");

      if (id) {
        setUser({ id, role });
        fetchCounts(id);
        return;
      }

      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          const parsedId = parsedUser.id || parsedUser.user_id;
          const parsedRole = parsedUser.role || "user";

          if (parsedId) {
            localStorage.setItem("user_id", parsedId);
            localStorage.setItem("role", parsedRole);
            setUser({ id: parsedId, role: parsedRole });
            fetchCounts(parsedId);
            return;
          }
        } catch (err) {
          localStorage.removeItem("user");
        }
      }

      setUser(null);
      setFavoriteCount(0);
      setCartCount(0);
    };

    syncUser();
    window.addEventListener("storage", syncUser);
    window.addEventListener("auth-changed", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("auth-changed", syncUser);
    };
  }, [location.pathname]);

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setSettingsOpen(false);
    window.dispatchEvent(new Event("auth-changed"));
    navigate("/login");
  };

  const openDashboard = () => {
    const id = localStorage.getItem("user_id");
    const role = localStorage.getItem("role");

    if (!id || role !== "admin") {
      setSettingsOpen(false);
      navigate("/login");
      return;
    }

    setSettingsOpen(false);
    navigate("/admin");
  };

  const goTo = (path) => {
    setSettingsOpen(false);
    navigate(path);
  };

  return (
    <div className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="brand-link" onClick={() => window.scrollTo(0, 0)}>
          <img src={logo} alt="Shop Aya logo" className="brand-logo" />
          Shop Aya
        </Link>

        <img
          src="https://flagcdn.com/w40/lb.png"
          alt="Lebanon"
          className="flag-icon"
        />
      </div>

      <div className="navbar-menu">
        <Link to="/" onClick={() => window.scrollTo(0, 0)}>Home</Link>
        <Link to="/favorites" style={{ position: "relative" }}>
          Favorite
          {favoriteCount > 0 && <span className="badge-count">{favoriteCount}</span>}
        </Link>
        <Link to="/cart" style={{ position: "relative" }}>
          Cart
          {cartCount > 0 && <span className="badge-count">{cartCount}</span>}
        </Link>

        {user && <Link to="/orders">Orders</Link>}

        <SearchLink navigate={navigate} />

        <div className="settings-menu">
          <button
            className="settings-button"
            onClick={() => setSettingsOpen((open) => !open)}
            aria-expanded={settingsOpen}
            aria-haspopup="menu"
          >
            Settings
          </button>

          {settingsOpen && (
            <div className="settings-dropdown" role="menu">
              {!user && (
                <>
                  <button onClick={() => goTo("/login")}>Login</button>
                  <button onClick={() => goTo("/signup")}>Sign Up</button>
                </>
              )}

              <button onClick={openDashboard}>Dashboard</button>

              {user && (
                <button onClick={logout}>Logout</button>
              )}
            </div>
          )}
        </div>
      </div>

      <button
        className="hamburger"
        onClick={() => setMenuOpen((s) => !s)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {menuOpen && (
        <div className="nav-overlay" onClick={() => setMenuOpen(false)}>
          <div className="nav-overlay-content" onClick={(e) => e.stopPropagation()}>
            <button className="nav-overlay-close" onClick={() => setMenuOpen(false)}>✕</button>
            <div className="nav-overlay-links">
              <Link to="/" onClick={() => { setMenuOpen(false); window.scrollTo(0, 0); }}>Home</Link>
              <Link to="/favorites" onClick={() => setMenuOpen(false)}>
                Favorite
                {favoriteCount > 0 && <span className="badge-count">{favoriteCount}</span>}
              </Link>
              <Link to="/cart" onClick={() => setMenuOpen(false)}>
                Cart
                {cartCount > 0 && <span className="badge-count">{cartCount}</span>}
              </Link>
              {user && <Link to="/orders" onClick={() => setMenuOpen(false)}>Orders</Link>}
              <Link to="/search" onClick={() => setMenuOpen(false)}>Search</Link>
              {!user && (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
                  <Link to="/signup" onClick={() => setMenuOpen(false)}>Sign Up</Link>
                </>
              )}
              <button onClick={() => { setMenuOpen(false); openDashboard(); }}>Dashboard</button>
              {user && <button onClick={() => { setMenuOpen(false); logout(); }}>Logout</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
