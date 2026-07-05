import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Lock, User, Loader2, Car } from "lucide-react";
import { api } from "@/lib/api";
import { useAdminStore } from "@/store/useAdminStore";

export default function AdminLoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setAuth = useAdminStore((s) => s.setAuth);
  const token = useAdminStore((s) => s.token);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) navigate("/admin", { replace: true });
  }, [token, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", { username, password });
      setAuth(data.token, data.admin.username);
      navigate("/admin");
    } catch (err: any) {
      if (!err.response) {
        setError("Server bilan aloqa o'rnatilmadi. Backend ishlab turganini tekshiring.");
      } else if (err.response.status === 401) {
        setError(t("admin.loginError"));
      } else {
        setError(err.response.data?.message || "Kutilmagan xatolik yuz berdi");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="force-dark relative flex min-h-screen items-center justify-center overflow-hidden bg-night-950 px-5">
      <div className="pointer-events-none absolute inset-0 bg-aurora-gradient" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card relative w-full max-w-sm p-8"
      >
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient shadow-glow">
          <Car size={26} className="text-night-950" />
        </div>
        <h1 className="text-center font-display text-xl font-bold text-white">
          {t("admin.loginTitle")}
        </h1>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm text-white/70">
              <User size={14} /> {t("admin.username")}
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm text-white/70">
              <Lock size={14} /> {t("admin.password")}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
          </div>

          {error && <p className="text-center text-sm text-red-400">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <Loader2 size={16} className="animate-spin" /> : t("admin.login")}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
