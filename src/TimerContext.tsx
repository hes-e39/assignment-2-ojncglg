import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export type Timer = {
  id: string;
  type: "stopwatch" | "countdown" | "XY" | "tabata";
  duration: number; // In milliseconds
  status: "not running" | "running" | "paused" | "completed";
};

type TimerContextType = {
  timers: Timer[];
  currentTimerIndex: number | null;
  toggleStartPause: () => void;
  fastForward: () => void;
  addTimer: (timer: Timer) => void;
  resetTimers: () => void;
};

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [currentTimerIndex, setCurrentTimerIndex] = useState<number | null>(null);

  useEffect(() => {
    if (currentTimerIndex === null) return;

    const currentTimer = timers[currentTimerIndex];

    if (currentTimer?.status === "running") {
      const interval = setInterval(() => {
        setTimers((prevTimers) =>
          prevTimers.map((timer, index) =>
            index === currentTimerIndex
              ? {
                  ...timer,
                  duration:
                    timer.type === "stopwatch"
                      ? timer.duration + 10 // Increment duration for stopwatch
                      : Math.max(timer.duration - 1000, 0), // Decrement for other timers
                  status:
                    timer.type !== "stopwatch" && timer.duration <= 1000
                      ? "completed"
                      : timer.status,
                }
              : timer
          )
        );

        if (currentTimer.type !== "stopwatch" && currentTimer.duration <= 1000) {
          clearInterval(interval);
          fastForward();
        }
      }, 10); // Update every 10ms

      return () => clearInterval(interval);
    }
  }, [currentTimerIndex, timers]);

  const addTimer = (timer: Timer) => {
    setTimers((prevTimers) => [...prevTimers, timer]);
  };

  const resetTimers = () => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) => ({
        ...timer,
        duration: timer.type === "stopwatch" ? 0 : timer.duration, // Reset duration only for non-stopwatch timers
        status: "not running",
      }))
    );
    setCurrentTimerIndex(null);
  };

  const toggleStartPause = () => {
    if (currentTimerIndex === null) {
      setCurrentTimerIndex(0);
      setTimers((prevTimers) =>
        prevTimers.map((timer, index) =>
          index === 0 ? { ...timer, status: "running" } : timer
        )
      );
    } else {
      setTimers((prevTimers) =>
        prevTimers.map((timer, index) =>
          index === currentTimerIndex
            ? { ...timer, status: timer.status === "running" ? "paused" : "running" }
            : timer
        )
      );
    }
  };

  const fastForward = () => {
    if (currentTimerIndex === null) return;

    setTimers((prevTimers) =>
      prevTimers.map((timer, index) =>
        index === currentTimerIndex ? { ...timer, status: "completed" } : timer
      )
    );

    const nextTimerIndex = currentTimerIndex + 1;
    if (nextTimerIndex < timers.length) {
      setCurrentTimerIndex(nextTimerIndex);
      setTimers((prevTimers) =>
        prevTimers.map((timer, index) =>
          index === nextTimerIndex ? { ...timer, status: "running" } : timer
        )
      );
    } else {
      setCurrentTimerIndex(null);
    }
  };

  return (
    <TimerContext.Provider
      value={{
        timers,
        currentTimerIndex,
        toggleStartPause,
        fastForward,
        addTimer,
        resetTimers,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimerContext = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error("useTimerContext must be used within a TimerProvider");
  }
  return context;
};
