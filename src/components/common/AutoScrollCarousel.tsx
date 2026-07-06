import { useEffect, useRef } from "react";

interface Props {
  children: React.ReactNode[];
  /** Which way the content visually appears to travel across the screen. */
  direction?: "left" | "right";
  speed?: number; // px per frame, roughly
  itemClassName?: string;
  className?: string;
}

/**
 * Horizontally auto-scrolling carousel. Content is duplicated once so the
 * loop can reset seamlessly. Fully supports native touch/drag/wheel scrolling —
 * auto-scroll simply pauses while the user is interacting and resumes shortly
 * after they let go, continuing from wherever they left it.
 */
export default function AutoScrollCarousel({
  children,
  direction = "left",
  speed = 0.6,
  itemClassName = "",
  className = "",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const rafRef = useRef<number>();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Start roughly mid-way through the first copy so both scroll directions
    // have room to move before hitting an edge.
    const halfWidth = el.scrollWidth / 2;
    if (direction === "right") {
      el.scrollLeft = halfWidth - 1;
    } else {
      el.scrollLeft = 1;
    }

    function step() {
      if (!pausedRef.current && el) {
        // "left" = content travels leftward across the screen, which means
        // revealing more from the right, i.e. scrollLeft increases.
        if (direction === "left") {
          el.scrollLeft += speed;
          if (el.scrollLeft >= halfWidth) {
            el.scrollLeft -= halfWidth;
          }
        } else {
          el.scrollLeft -= speed;
          if (el.scrollLeft <= 0) {
            el.scrollLeft += halfWidth;
          }
        }
      }
      rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);

    function pause() {
      pausedRef.current = true;
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    }
    function scheduleResume() {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = setTimeout(() => {
        pausedRef.current = false;
      }, 2000);
    }

    el.addEventListener("pointerdown", pause);
    el.addEventListener("pointerup", scheduleResume);
    el.addEventListener("pointercancel", scheduleResume);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", scheduleResume);
    el.addEventListener("wheel", pause, { passive: true });
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", scheduleResume);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      el.removeEventListener("pointerdown", pause);
      el.removeEventListener("pointerup", scheduleResume);
      el.removeEventListener("pointercancel", scheduleResume);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", scheduleResume);
      el.removeEventListener("wheel", pause);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", scheduleResume);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [direction, speed, children.length]);

  return (
    <div
      ref={containerRef}
      className={`no-scrollbar flex gap-5 overflow-x-auto scroll-smooth ${className}`}
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {[...children, ...children].map((child, i) => (
        <div key={i} className={`shrink-0 ${itemClassName}`}>
          {child}
        </div>
      ))}
    </div>
  );
}
