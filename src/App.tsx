import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LoadingScreen from "@/components/layout/LoadingScreen";
import BackToTop from "@/components/common/BackToTop";
import InstallAppButton from "@/components/common/InstallAppButton";
import OrderModal from "@/components/order/OrderModal";
import HomePage from "@/pages/HomePage";
import BecomeDriverPage from "@/pages/BecomeDriverPage";
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import NotFoundPage from "@/pages/NotFoundPage";
import AdminGuard from "@/components/admin/AdminGuard";
import { useThemeStore } from "@/store/useThemeStore";

function App() {
  const [loading, setLoading] = useState(true);
  const isDark = useThemeStore((s) => s.isDark);

  useEffect(() => {
    document.body.classList.toggle("light-mode", !isDark);
  }, [isDark]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 bg-aurora-gradient" aria-hidden="true" />
      <Routes>
        <Route
          path="/admin/login"
          element={<AdminLoginPage />}
        />
        <Route
          path="/admin/*"
          element={
            <AdminGuard>
              <AdminDashboardPage />
            </AdminGuard>
          }
        />
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <main className="relative z-10">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/become-driver" element={<BecomeDriverPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
              <BackToTop />
              <InstallAppButton />
              <OrderModal />
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
