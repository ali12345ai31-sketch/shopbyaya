import { BrowserRouter } from "react-router-dom";

import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import FloatingWhatsapp from "./components/FloatingWhatsapp";
import Footer from "./pages/Footer";


function App() {
  return (
    <BrowserRouter>

      <ScrollToTop />

      {/* 🌐 TOP NAVBAR (VISIBLE ON ALL PAGES) */}
      <Navbar />

      {/* 📄 ALL ROUTES */}
      <AppRoutes />

      {/* 📱 FLOATING WHATSAPP BUTTON */}
      <FloatingWhatsapp />

      {/* 🌐 FOOTER */}
      <Footer />

    </BrowserRouter>
  );
}

export default App;