import { useEffect, useState } from "react";

interface Segment {
  text: string;
  className?: string;
}

interface Options {
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseAfterType?: number;
  pauseAfterDelete?: number;
}

type Phase = "typing" | "pausing" | "deleting" | "waiting";

export function useTypewriterLoop(segments: Segment[], opts: Options = {}) {
  const {
    typeSpeed = 55,
    deleteSpeed = 28,
    pauseAfterType = 2400,
    pauseAfterDelete = 500,
  } = opts;

  const fullText = segments.map((s) => s.text).join("");
  const [length, setLength] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");

  // Reset the animation whenever the underlying text changes (e.g. language switch)
  useEffect(() => {
    setLength(0);
    setPhase("typing");
  }, [fullText]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (length < fullText.length) {
        timer = setTimeout(() => setLength((l) => l + 1), typeSpeed);
      } else {
        timer = setTimeout(() => setPhase("pausing"), 0);
      }
    } else if (phase === "pausing") {
      timer = setTimeout(() => setPhase("deleting"), pauseAfterType);
    } else if (phase === "deleting") {
      if (length > 0) {
        timer = setTimeout(() => setLength((l) => l - 1), deleteSpeed);
      } else {
        timer = setTimeout(() => setPhase("waiting"), 0);
      }
    } else if (phase === "waiting") {
      timer = setTimeout(() => setPhase("typing"), pauseAfterDelete);
    }

    return () => clearTimeout(timer);
  }, [phase, length, fullText, typeSpeed, deleteSpeed, pauseAfterType, pauseAfterDelete]);

  let remaining = length;
  const rendered = segments.map((seg) => {
    const take = Math.max(0, Math.min(seg.text.length, remaining));
    remaining -= seg.text.length;
    return { ...seg, revealed: seg.text.slice(0, take) };
  });

  return { rendered, done: phase === "pausing" };
}
