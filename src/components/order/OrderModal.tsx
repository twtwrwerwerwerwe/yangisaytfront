import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { X, User, Package, MapPin, Loader2, CheckCircle2, PhoneCall } from "lucide-react";
import { useOrderModalStore } from "@/store/useOrderModalStore";
import DepartureTimePicker from "./DepartureTimePicker";
import { useRoutes } from "@/hooks/useRoutes";
import { useLocalized } from "@/hooks/useLocalized";
import { api } from "@/lib/api";
import { OrderType, SeatType } from "@/types";

export default function OrderModal() {
  const { t } = useTranslation();
  const { isOpen, close, prefillRouteId } = useOrderModalStore();
  const { data: routes } = useRoutes();
  const pick = useLocalized();

  const [type, setType] = useState<OrderType>("PASSENGER");
  const [routeId, setRouteId] = useState("");
  const [seatType, setSeatType] = useState<SeatType>("BACK");
  const [passengerCount, setPassengerCount] = useState(1);
  const [luggage, setLuggage] = useState(false);
  const [departureTime, setDepartureTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (isOpen && prefillRouteId) setRouteId(prefillRouteId);
  }, [isOpen, prefillRouteId]);

  useEffect(() => {
    if (passengerCount >= 2 && seatType === "FRONT") setSeatType("MIDDLE");
  }, [passengerCount, seatType]);

  useEffect(() => {
    if (!success) return;
    if (countdown <= 0) {
      resetAndClose();
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [success, countdown]);

  const selectedRoute = useMemo(() => routes?.find((r) => r.id === routeId), [routes, routeId]);

  const price = useMemo(() => {
    if (!selectedRoute) return 0;
    if (type === "PARCEL") return selectedRoute.parcelPrice;
    const effectiveSeat = passengerCount >= 2 && seatType === "FRONT" ? "MIDDLE" : seatType;
    const perSeat =
      effectiveSeat === "FRONT"
        ? selectedRoute.frontSeatPrice
        : effectiveSeat === "MIDDLE"
        ? selectedRoute.middleSeatPrice
        : selectedRoute.backSeatPrice;
    return perSeat * Math.max(1, passengerCount);
  }, [selectedRoute, type, seatType, passengerCount]);

  function resetAndClose() {
    close();
    setType("PASSENGER");
    setRouteId("");
    setSeatType("BACK");
    setPassengerCount(1);
    setLuggage(false);
    setDepartureTime("");
    setName("");
    setPhone("");
    setCoords(null);
    setLocationError(false);
    setSuccess(false);
    setCountdown(10);
  }

  function getLocation() {
    if (!navigator.geolocation) {
      setLocationError(true);
      return;
    }
    setLocating(true);
    setLocationError(false);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setLocationError(true);
        setLocating(false);
      },
      { timeout: 10000 }
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!routeId || !name || !phone) return;
    if (type === "PASSENGER" && !departureTime) return;
    setSubmitting(true);
    try {
      await api.post("/orders", {
        type,
        routeId,
        seatType: type === "PASSENGER" ? seatType : undefined,
        passengerCount: type === "PASSENGER" ? passengerCount : undefined,
        luggage: type === "PASSENGER" ? luggage : undefined,
        departureTime: type === "PASSENGER" ? departureTime : undefined,
        name,
        phone,
        latitude: coords?.lat,
        longitude: coords?.lng,
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-night-950/80 backdrop-blur-sm p-4"
          onClick={resetAndClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card relative max-h-[90vh] w-full max-w-lg overflow-y-auto p-5 sm:p-7"
          >
            <button
              onClick={resetAndClose}
              className="absolute right-5 top-5 rounded-full p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              aria-label={t("orderModal.close")}
            >
              <X size={20} />
            </button>

            {!success ? (
              <>
                <h3 className="font-display text-2xl font-bold text-white">{t("orderModal.title")}</h3>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setType("PASSENGER")}
                    className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3.5 font-medium transition-all ${
                      type === "PASSENGER"
                        ? "bg-brand-gradient text-night-950 shadow-glow"
                        : "glass text-white/70"
                    }`}
                  >
                    <User size={16} /> {t("orderModal.typePassenger")}
                  </button>
                  <button
                    onClick={() => setType("PARCEL")}
                    className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3.5 font-medium transition-all ${
                      type === "PARCEL"
                        ? "bg-brand-gradient text-night-950 shadow-glow"
                        : "glass text-white/70"
                    }`}
                  >
                    <Package size={16} /> {t("orderModal.typeParcel")}
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm text-white/70">{t("orderModal.route")}</label>
                    <select
                      required
                      value={routeId}
                      onChange={(e) => setRouteId(e.target.value)}
                      className="input-field"
                    >
                      <option value="">{t("orderModal.selectRoute")}</option>
                      {routes?.map((r) => (
                        <option key={r.id} value={r.id} className="bg-night-800">
                          {pick(r, "name")}
                        </option>
                      ))}
                    </select>
                  </div>

                  {type === "PASSENGER" && (
                    <>
                      <div>
                        <label className="mb-1.5 block text-sm text-white/70">
                          {t("orderModal.passengerCount")}
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={4}
                          value={passengerCount}
                          onChange={(e) => setPassengerCount(Number(e.target.value) || 1)}
                          className="input-field"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm text-white/70">{t("orderModal.seat")}</label>
                        <div className="grid grid-cols-3 gap-2">
                          {(["FRONT", "MIDDLE", "BACK"] as SeatType[]).map((seat) => {
                            const disabled = passengerCount >= 2 && seat === "FRONT";
                            return (
                              <button
                                type="button"
                                key={seat}
                                disabled={disabled}
                                onClick={() => setSeatType(seat)}
                                className={`rounded-xl px-1.5 py-2.5 text-[10px] leading-tight font-medium transition-all disabled:cursor-not-allowed disabled:opacity-30 sm:px-2 sm:text-xs ${
                                  seatType === seat ? "bg-brand-gradient text-night-950" : "glass text-white/70"
                                }`}
                              >
                                {t(`routesSection.${seat === "FRONT" ? "frontSeat" : seat === "MIDDLE" ? "middleSeat" : "backSeat"}`)}
                              </button>
                            );
                          })}
                        </div>
                        {passengerCount >= 2 && (
                          <p className="mt-1.5 text-xs text-amber-400">{t("orderModal.frontSeatUnavailable")}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-sm text-white/70">{t("orderModal.luggage")}</label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setLuggage(true)}
                            className={`rounded-full px-4 py-1.5 text-xs font-medium ${
                              luggage ? "bg-brand-gradient text-night-950" : "glass text-white/70"
                            }`}
                          >
                            {t("orderModal.yes")}
                          </button>
                          <button
                            type="button"
                            onClick={() => setLuggage(false)}
                            className={`rounded-full px-4 py-1.5 text-xs font-medium ${
                              !luggage ? "bg-brand-gradient text-night-950" : "glass text-white/70"
                            }`}
                          >
                            {t("orderModal.no")}
                          </button>
                        </div>
                      </div>

                      <DepartureTimePicker key={isOpen ? "open" : "closed"} onChange={setDepartureTime} />
                    </>
                  )}

                  <div>
                    <label className="mb-1.5 block text-sm text-white/70">{t("orderModal.name")}</label>
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm text-white/70">{t("orderModal.phone")}</label>
                    <input
                      required
                      type="tel"
                      placeholder="+998 90 123 45 67"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm text-white/70">{t("orderModal.location")}</label>
                    <button
                      type="button"
                      onClick={getLocation}
                      className="btn-secondary w-full !py-2.5 text-sm"
                    >
                      {locating ? (
                        <>
                          <Loader2 size={15} className="animate-spin" /> {t("orderModal.gettingLocation")}
                        </>
                      ) : coords ? (
                        <>
                          <MapPin size={15} className="text-cyan-300" /> {t("orderModal.locationReceived")}
                        </>
                      ) : (
                        <>
                          <MapPin size={15} /> {t("orderModal.getLocation")}
                        </>
                      )}
                    </button>
                    {locationError && (
                      <p className="mt-1.5 text-xs text-red-400">{t("orderModal.locationError")}</p>
                    )}
                  </div>

                  {selectedRoute && (
                    <motion.div
                      key={price}
                      initial={{ scale: 0.95, opacity: 0.7 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="animated-border flex items-center justify-between rounded-2xl bg-night-800 px-5 py-4"
                    >
                      <span className="text-sm text-white/70">{t("orderModal.totalPrice")}</span>
                      <span className="gradient-text font-display text-xl font-extrabold">
                        {price.toLocaleString()} {t("common.currency")}
                      </span>
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={
                      submitting ||
                      !routeId ||
                      !name ||
                      !phone ||
                      (type === "PASSENGER" && !departureTime)
                    }
                    className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> {t("orderModal.submitting")}
                      </>
                    ) : (
                      t("orderModal.submit")
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center py-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                >
                  <CheckCircle2 size={72} className="text-cyan-400" />
                </motion.div>
                <h3 className="mt-6 font-display text-xl font-bold text-white">
                  {t("orderModal.successTitle")}
                </h3>
                <p className="mt-2 text-white/70">{t("orderModal.successLine1")}</p>
                <p className="text-white/70">{t("orderModal.successLine2")}</p>
                <div className="mt-6 flex items-center gap-2 text-sm text-white/50">
                  <PhoneCall size={14} /> +998 95 287 16 66
                </div>
                <p className="mt-4 text-xs text-white/40">{countdown}s</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
