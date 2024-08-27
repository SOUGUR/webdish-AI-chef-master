import { useState, useEffect, useRef } from 'react';

export default function useCountdown(initialTimer) {
  const [countdown, setCountdown] = useState(initialTimer);
  const [isActive, setIsActive] = useState(false);
  const initialTimerRef = useRef(initialTimer);

  const minutes = Math.floor(countdown / 60);
  const seconds = Math.floor(countdown % 60);

  useEffect(() => {
    let timer;
    if (isActive && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown => countdown - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown, isActive]);

  const start = () => {
    setIsActive(true);
  };

  const pause = () => {
    setIsActive(false);
  };

  const reset = () => {
    setIsActive(false);
    setCountdown(initialTimerRef.current);
  };

  return {
    minutes,
    seconds,
    start,
    pause,
    reset,
    isActive,
  };
}
