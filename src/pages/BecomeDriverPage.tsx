import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  User,
  Car,
  Phone,
  Image as ImageIcon,
  CreditCard,
  Copy,
  Check,
  FileUp,
  Loader2,
  CheckCircle2,
  PhoneCall,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { api } from "@/lib/api";

const CARD_NUMBER = "8600 1234 5678 9012";
const CARD_OWNER = "AKRAMJONOV SARDOR";

export default function BecomeDriverPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [carName, setCarName] = useState("");
  const [experience, setExperience] = useState("");
  const [phone, setPhone] = useState("");
  const [carPhotos, setCarPhotos] = useState<File[]>([]);
  const [receiptImage, setReceiptImage] = useState<File | null>(null);
  const [receiptPdf, setReceiptPdf] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!success) return;
    if (countdown <= 0) {
      navigate("/");
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [success, countdown, navigate]);

  const step1Valid = fullName.trim() && carName.trim() && experience && phone.trim() && carPhotos.length === 3;
  const step2Valid = receiptImage || receiptPdf;

  function copyCard() {
    navigator.clipboard.writeText(CARD_NUMBER.replace(/\s/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []).slice(0, 3);
    setCarPhotos(files);
  }

  async function handleSubmit() {
    setError("");
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("carName", carName);
      formData.append("experience", experience);
      formData.append("phone", phone);
      carPhotos.forEach((f) => formData.append("carPhotos", f));
      if (receiptImage) formData.append("receiptImage", receiptImage);
      if (receiptPdf) formData.append("receiptPdf", receiptPdf);

      await api.post("/applications", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  }

  const steps = [1, 2, 3];

  return (
    <div className="mx-auto max-w-2xl px-5 py-16 lg:px-8">
      {!success ? (
        <>
          <h1 className="text-center font-display text-3xl font-extrabold text-white sm:text-4xl">
            {t("driverForm.title")}
          </h1>

          <div className="mx-auto mt-8 flex max-w-sm items-center justify-between">
            {steps.map((s, i) => (
              <div key={s} className="flex flex-1 items-center">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all ${
                    step >= s ? "bg-brand-gradient text-night-950 shadow-glow" : "glass text-white/40"
                  }`}
                >
                  {step > s ? <Check size={16} /> : s}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 flex-1 rounded transition-all ${
                      step > s ? "bg-brand-gradient" : "bg-white/10"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="glass-card mt-8 p-5 sm:p-7">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="mb-5 font-display text-lg font-bold text-white">
                    {t("driverForm.step1Title")}
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-sm text-white/70">
                        <User size={14} /> {t("driverForm.fullName")}
                      </label>
                      <input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={t("driverForm.fullNamePlaceholder")}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-sm text-white/70">
                        <Car size={14} /> {t("driverForm.carName")}
                      </label>
                      <input
                        value={carName}
                        onChange={(e) => setCarName(e.target.value)}
                        placeholder={t("driverForm.carNamePlaceholder")}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm text-white/70">{t("driverForm.experience")}</label>
                      <input
                        type="number"
                        min={0}
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-sm text-white/70">
                        <Phone size={14} /> {t("driverForm.phone")}
                      </label>
                      <input
                        type="tel"
                        placeholder="+998 90 123 45 67"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-sm text-white/70">
                        <ImageIcon size={14} /> {t("driverForm.carPhotos")}
                      </label>
                      <p className="mb-2 text-xs text-white/40">{t("driverForm.carPhotosHint")}</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoSelect}
                        className="input-field file:mr-3 file:rounded-full file:border-0 file:bg-brand-gradient file:px-4 file:py-1.5 file:text-xs file:font-semibold file:text-night-950"
                      />
                      {carPhotos.length > 0 && (
                        <div className="mt-3 flex gap-2">
                          {carPhotos.map((f, i) => (
                            <img
                              key={i}
                              src={URL.createObjectURL(f)}
                              alt={`car-${i}`}
                              className="h-16 w-16 rounded-xl object-cover"
                            />
                          ))}
                        </div>
                      )}
                      {carPhotos.length > 0 && carPhotos.length !== 3 && (
                        <p className="mt-1.5 text-xs text-amber-400">{t("driverForm.validation.photos")}</p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    disabled={!step1Valid}
                    className="btn-primary mt-7 w-full disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {t("driverForm.next")} <ArrowRight size={16} />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="mb-5 font-display text-lg font-bold text-white">
                    {t("driverForm.step2Title")}
                  </h2>

                  <div className="animated-border rounded-2xl bg-night-800 p-5">
                    <p className="text-center text-sm font-medium text-amber-300">
                      {t("driverForm.paymentInfo")}
                    </p>
                    <div className="mt-4 flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <CreditCard size={18} className="text-cyan-300" />
                        <div>
                          <p className="font-mono text-base font-bold tracking-wider text-white">
                            {CARD_NUMBER}
                          </p>
                          <p className="text-xs text-white/50">{CARD_OWNER}</p>
                        </div>
                      </div>
                      <button
                        onClick={copyCard}
                        className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/10"
                      >
                        {copied ? <Check size={13} className="text-cyan-300" /> : <Copy size={13} />}
                        {copied ? t("driverForm.copied") : t("driverForm.copy")}
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-sm text-white/70">
                        <FileUp size={14} /> {t("driverForm.uploadReceiptImage")}
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setReceiptImage(e.target.files?.[0] || null)}
                        className="input-field file:mr-3 file:rounded-full file:border-0 file:bg-brand-gradient file:px-4 file:py-1.5 file:text-xs file:font-semibold file:text-night-950"
                      />
                    </div>
                    <p className="text-center text-xs text-white/40">— yoki / или / or —</p>
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-sm text-white/70">
                        <FileUp size={14} /> {t("driverForm.uploadReceiptPdf")}
                      </label>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => setReceiptPdf(e.target.files?.[0] || null)}
                        className="input-field file:mr-3 file:rounded-full file:border-0 file:bg-brand-gradient file:px-4 file:py-1.5 file:text-xs file:font-semibold file:text-night-950"
                      />
                    </div>
                    {!step2Valid && (
                      <p className="text-xs text-amber-400">{t("driverForm.receiptRequired")}</p>
                    )}
                  </div>

                  <div className="mt-7 flex gap-3">
                    <button onClick={() => setStep(1)} className="btn-secondary flex-1">
                      <ArrowLeft size={16} /> {t("driverForm.back")}
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      disabled={!step2Valid}
                      className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {t("driverForm.next")} <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="mb-5 font-display text-lg font-bold text-white">
                    {t("driverForm.step3Title")}
                  </h2>

                  <div className="space-y-2 rounded-2xl bg-white/5 p-5 text-sm">
                    <p className="mb-3 text-xs uppercase tracking-wider text-cyan-300">
                      {t("driverForm.reviewTitle")}
                    </p>
                    <div className="flex justify-between text-white/70">
                      <span>{t("driverForm.fullName")}</span>
                      <span className="font-medium text-white">{fullName}</span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>{t("driverForm.carName")}</span>
                      <span className="font-medium text-white">{carName}</span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>{t("driverForm.experience")}</span>
                      <span className="font-medium text-white">
                        {experience} {t("common.years")}
                      </span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>{t("driverForm.phone")}</span>
                      <span className="font-medium text-white">{phone}</span>
                    </div>
                  </div>

                  {error && <p className="mt-4 text-center text-sm text-red-400">{error}</p>}

                  <div className="mt-7 flex gap-3">
                    <button onClick={() => setStep(2)} className="btn-secondary flex-1">
                      <ArrowLeft size={16} /> {t("driverForm.back")}
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> {t("driverForm.submitting")}
                        </>
                      ) : (
                        t("driverForm.submit")
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card flex flex-col items-center p-10 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            <CheckCircle2 size={76} className="text-cyan-400" />
          </motion.div>
          <h2 className="mt-6 font-display text-2xl font-bold text-white">
            {t("driverForm.successTitle")}
          </h2>
          <p className="mt-3 text-white/60">{t("driverForm.successPhone")}</p>
          <div className="mt-2 flex items-center gap-2 font-display text-lg font-bold text-white">
            <PhoneCall size={18} className="text-cyan-300" /> +998 95 287 16 66
          </div>
          <p className="mt-6 text-sm text-white/40">
            {countdown} {t("driverForm.redirecting")}
          </p>
        </motion.div>
      )}
    </div>
  );
}
