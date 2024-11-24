import { useTimerContext } from "../TimerContext";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const TimerItem = styled.div`
  border: 1px solid #ffd700;
  padding: 10px;
  margin-bottom: 10px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 15px 30px;
  font-size: 1.2rem;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  background-color: #000;
  color: #ffd700;
  font-family: "Digital-7", "Roboto Mono", monospace;
  text-transform: uppercase;
  font-weight: bold;
  transition: all 0.3s;
  margin: 10px;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const formatTime = (milliseconds: number): string => {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  const ms = Math.floor((milliseconds % 1000) / 10);
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
};

const TimersView = () => {
  const { timers, toggleStartPause, resetTimers, fastForward, currentTimerIndex } =
    useTimerContext();

  return (
    <Container>
      <h1>Workout Timers</h1>
      {timers.map((timer, index) => (
        <TimerItem key={timer.id}>
          <h2>{timer.type}</h2>
          <p>Status: {timer.status}</p>
          {index === currentTimerIndex && timer.type === "stopwatch" && (
            <p>Time Elapsed: {formatTime(timer.duration)}</p>
          )}
          {index === currentTimerIndex && timer.type !== "stopwatch" && (
            <p>Time Remaining: {formatTime(timer.duration)}</p>
          )}
        </TimerItem>
      ))}
      <Button onClick={toggleStartPause}>Start/Pause</Button>
      <Button onClick={resetTimers}>Reset</Button>
      <Button onClick={fastForward}>Fast-Forward</Button>
    </Container>
  );
};

export default TimersView;
