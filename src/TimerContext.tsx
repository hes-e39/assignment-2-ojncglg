// Import necessary React functions and types
import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react'; // Importing ReactNode type for children

// ------------------- Timer Type Definition -------------------

// Defining the structure of a Timer object
export type Timer = {
    id: string; // A unique identifier for the timer
    type: 'stopwatch' | 'countdown' | 'XY' | 'tabata'; // Type of timer
    duration: number; // Total duration of the timer in milliseconds
    status: 'not running' | 'running' | 'paused' | 'completed'; // Current status of the timer
};

// ------------------- Timer Context Type -------------------

// Describes the structure of the TimerContext
type TimerContextType = {
    timers: Timer[]; // Array of all timers
    currentTimerIndex: number | null; // Index of the currently active timer
    toggleStartPause: () => void; // Function to start/pause the active timer
    fastForward: () => void; // Function to complete the current timer and move to the next
    addTimer: (timer: Timer) => void; // Function to add a new timer
    resetTimers: () => void; // Function to reset all timers
};

// ------------------- Creating Timer Context -------------------

// Creating the TimerContext with an initial value of undefined
const TimerContext = createContext<TimerContextType | undefined>(undefined);

// ------------------- TimerProvider Component -------------------

// TimerProvider wraps the app to provide the TimerContext
export const TimerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // State to hold all timers
    const [timers, setTimers] = useState<Timer[]>([]);

    // State to track the index of the currently active timer
    const [currentTimerIndex, setCurrentTimerIndex] = useState<number | null>(null);

    // ------------------- Timer Logic (useEffect) -------------------

    // Handles updating the active timer's state and duration
    useEffect(() => {
        if (currentTimerIndex === null) return; // Do nothing if no timer is active

        const currentTimer = timers[currentTimerIndex]; // Get the active timer

        if (currentTimer?.status === 'running') {
            // Define a recursive function to handle timer updates
            const handleTimeout = () => {
                setTimers(prevTimers =>
                    prevTimers.map((timer, index) =>
                        index === currentTimerIndex
                            ? {
                                  ...timer,
                                  // Increment for stopwatch; decrement for others
                                  duration: timer.type === 'stopwatch' ? timer.duration + 10 : Math.max(timer.duration - 10, 0),
                                  // Mark timers as "completed" when duration reaches 0
                                  status: timer.type !== 'stopwatch' && timer.duration <= 10 ? 'completed' : timer.status,
                              }
                            : timer,
                    ),
                );

                // If it's not a stopwatch and the duration is 0, complete the timer
                if (currentTimer.type !== 'stopwatch' && currentTimer.duration <= 10) {
                    fastForward(); // Move to the next timer
                    return; // Stop recursion for this timer
                }

                // Schedule the next update using setTimeout
                setTimeout(handleTimeout, 10); // Repeat after 10ms
            };

            // Start the first timeout
            handleTimeout();
        }
    }, [currentTimerIndex, timers]);

    // ------------------- Add Timer -------------------

    // Adds a new timer to the list
    const addTimer = (timer: Timer) => {
        setTimers(prevTimers => [...prevTimers, timer]); // Append the new timer to the list
    };

    // ------------------- Reset Timers -------------------

    // Resets all timers to their initial state
    const resetTimers = () => {
        setTimers(prevTimers =>
            prevTimers.map(timer => ({
                ...timer,
                duration: timer.type === 'stopwatch' ? 0 : timer.duration, // Reset stopwatch to 0
                status: 'not running', // Set all timers to "not running"
            })),
        );
        setCurrentTimerIndex(null); // Clear the active timer index
    };

    // ------------------- Start/Pause Timer -------------------

    // Starts or pauses the current timer
    const toggleStartPause = () => {
        if (currentTimerIndex === null) {
            // If no timer is active, start the first timer
            setCurrentTimerIndex(0);
            setTimers(prevTimers => prevTimers.map((timer, index) => (index === 0 ? { ...timer, status: 'running' } : timer)));
        } else {
            // Otherwise, toggle the current timer's status
            setTimers(prevTimers => prevTimers.map((timer, index) => (index === currentTimerIndex ? { ...timer, status: timer.status === 'running' ? 'paused' : 'running' } : timer)));
        }
    };

    // ------------------- Fast Forward -------------------

    // Completes the current timer and moves to the next
    const fastForward = () => {
        if (currentTimerIndex === null) return; // Do nothing if no timer is active

        // Mark the current timer as completed
        setTimers(prevTimers => prevTimers.map((timer, index) => (index === currentTimerIndex ? { ...timer, status: 'completed' } : timer)));

        // Move to the next timer, if available
        const nextTimerIndex = currentTimerIndex + 1;
        if (nextTimerIndex < timers.length) {
            setCurrentTimerIndex(nextTimerIndex); // Set the next timer as active
            setTimers(prevTimers => prevTimers.map((timer, index) => (index === nextTimerIndex ? { ...timer, status: 'running' } : timer)));
        } else {
            setCurrentTimerIndex(null); // No more timers to run
        }
    };

    // ------------------- Provide Context -------------------

    // Provide the TimerContext to child components
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

// ------------------- useTimerContext Hook -------------------

// Custom hook to access the TimerContext
export const useTimerContext = () => {
    const context = useContext(TimerContext);
    if (!context) {
        throw new Error('useTimerContext must be used within a TimerProvider'); // Ensure proper usage
    }
    return context;
};
