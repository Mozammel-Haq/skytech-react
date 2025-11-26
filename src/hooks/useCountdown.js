import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

// 🧩 Extend the plugin here
dayjs.extend(duration);

const initialCountdown = {
  days: "00",
  hours: "00",
  minutes: "00",
  seconds: "00",
  completed: true,
};

function formatUnit(value) {
  return value.toString().padStart(2, "0");
}

export default function useCountdown(targetDate) {
  const parsedTarget = useMemo(
    () => (targetDate ? dayjs(targetDate) : null),
    [targetDate]
  );
  const [timeLeft, setTimeLeft] = useState(initialCountdown);

  useEffect(() => {
    if (!parsedTarget || !parsedTarget.isValid()) {
      setTimeLeft(initialCountdown);
      return () => {};
    }

    const updateCountdown = () => {
      const now = dayjs();
      const diff = parsedTarget.diff(now);

      if (diff <= 0) {
        setTimeLeft(initialCountdown);
        return true;
      }

      // ✅ Use the duration plugin safely
      const durationObj = dayjs.duration(diff);
      setTimeLeft({
        days: formatUnit(Math.floor(durationObj.asDays())),
        hours: formatUnit(durationObj.hours()),
        minutes: formatUnit(durationObj.minutes()),
        seconds: formatUnit(durationObj.seconds()),
        completed: false,
      });
      return false;
    };

    updateCountdown();
    const interval = setInterval(() => {
      const completed = updateCountdown();
      if (completed) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [parsedTarget]);

  return timeLeft;
}
