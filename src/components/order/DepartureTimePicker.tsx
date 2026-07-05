import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Clock } from "lucide-react";

type DayOption = "today" | "tomorrow" | "custom";

const QUICK_TIMES = ["07:00", "09:00", "11:00", "13:00", "15:00", "17:00", "19:00", "21:00"];

function toDateKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

function formatDisplayDate(dateKey: string) {
  const d = new Date(dateKey + "T00:00:00");
  return d.toLocaleDateString(undefined, { day: "2-digit", month: "long" });
}

interface Props {
  onChange: (isoLocal: string) => void;
}

export default function DepartureTimePicker({ onChange }: Props) {
  const { t } = useTranslation();
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const [dayOption, setDayOption] = useState<DayOption>("today");
  const [customDate, setCustomDate] = useState(toDateKey(tomorrow));
  const [time, setTime] = useState("");
  const [customTimeMode, setCustomTimeMode] = useState(false);

  const dateKey =
    dayOption === "today" ? toDateKey(today) : dayOption === "tomorrow" ? toDateKey(tomorrow) : customDate;

  useEffect(() => {
    if (dateKey && time) {
      onChange(`${dateKey}T${time}`);
    } else {
      onChange("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateKey, time]);

  const dayButtons: { key: DayOption; label: string }[] = [
    { key: "today", label: t("orderModal.dayToday") },
    { key: "tomorrow", label: t("orderModal.dayTomorrow") },
    { key: "custom", label: t("orderModal.dayOther") },
  ];

  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-sm text-white/70">
        <Clock size={14} /> {t("orderModal.departureTime")}
      </label>

      <div className="grid grid-cols-3 gap-2">
        {dayButtons.map((d) => (
          <button
            key={d.key}
            type="button"
            onClick={() => setDayOption(d.key)}
            className={`rounded-xl px-2 py-2.5 text-xs font-medium transition-all sm:text-sm ${
              dayOption === d.key ? "bg-brand-gradient text-night-950" : "glass text-white/70"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {dayOption === "custom" && (
        <input
          type="date"
          min={toDateKey(tomorrow)}
          value={customDate}
          onChange={(e) => setCustomDate(e.target.value)}
          className="input-field mt-2"
        />
      )}

      <p className="mt-3 mb-1.5 text-xs text-white/50">{t("orderModal.selectTime")}</p>
      <div className="grid grid-cols-4 gap-2">
        {QUICK_TIMES.map((slot) => (
          <button
            key={slot}
            type="button"
            onClick={() => {
              setTime(slot);
              setCustomTimeMode(false);
            }}
            className={`rounded-xl px-1 py-2 text-xs font-medium transition-all ${
              !customTimeMode && time === slot ? "bg-brand-gradient text-night-950" : "glass text-white/70"
            }`}
          >
            {slot}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setCustomTimeMode(true)}
        className={`mt-2 w-full rounded-xl px-3 py-2 text-xs font-medium transition-all ${
          customTimeMode ? "bg-brand-gradient text-night-950" : "glass text-white/60"
        }`}
      >
        {t("orderModal.customTime")}
      </button>

      {customTimeMode && (
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="input-field mt-2"
        />
      )}

      {dateKey && time && (
        <p className="mt-2 text-xs text-cyan-300">
          {formatDisplayDate(dateKey)} · {time}
        </p>
      )}
    </div>
  );
}
