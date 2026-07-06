import { useState } from "react";
import { Star } from "lucide-react";

interface Props {
  value: number;
  onChange: (value: number) => void;
}

export default function StarRatingInput({ value, onChange }: Props) {
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? value;

  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(null)}
          className="transition-transform hover:scale-110"
          aria-label={`${star} yulduz`}
        >
          <Star
            size={26}
            className={star <= display ? "text-amber-400" : "text-white/20"}
            fill={star <= display ? "currentColor" : "none"}
          />
        </button>
      ))}
      <span className="ml-2 text-sm text-white/50">{value}/5</span>
    </div>
  );
}
