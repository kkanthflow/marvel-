import React, { useState, useEffect } from "react";

export default function CountdownTimer({ targetDate, variant = "large" }) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(targetDate);
      const now = new Date();
      const difference = target.getTime() - now.getTime();
      
      if (isNaN(difference) || difference <= 0) {
        return { expired: true };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        expired: false
      };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return (
      <div className={`countdown-placeholder ${variant}`}>
        <span>Calculating time...</span>
      </div>
    );
  }

  if (timeLeft.expired) {
    return (
      <div className={`countdown-expired-badge ${variant}`}>
        <span className="live-glow">●</span> RELEASED / IN THEATERS
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="countdown-timer compact">
        <div className="countdown-compact-text">
          <span className="days-highlight">{timeLeft.days}d</span> {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </div>
      </div>
    );
  }

  return (
    <div className="countdown-timer large">
      <div className="countdown-grid">
        <div className="countdown-item animate-pulse-subtle">
          <div className="countdown-num font-serif">{String(timeLeft.days).padStart(2, "0")}</div>
          <div className="countdown-label">Days</div>
        </div>
        <div className="countdown-divider">:</div>
        <div className="countdown-item">
          <div className="countdown-num font-serif">{String(timeLeft.hours).padStart(2, "0")}</div>
          <div className="countdown-label">Hrs</div>
        </div>
        <div className="countdown-divider">:</div>
        <div className="countdown-item">
          <div className="countdown-num font-serif">{String(timeLeft.minutes).padStart(2, "0")}</div>
          <div className="countdown-label">Mins</div>
        </div>
        <div className="countdown-divider">:</div>
        <div className="countdown-item text-crimson">
          <div className="countdown-num font-serif glow-seconds">{String(timeLeft.seconds).padStart(2, "0")}</div>
          <div className="countdown-label">Secs</div>
        </div>
      </div>
    </div>
  );
}
