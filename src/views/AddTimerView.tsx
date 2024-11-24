import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTimerContext } from "../TimerContext";
import { v4 as uuidv4 } from "uuid";
import styled from "styled-components";
import type { FC } from "react"; // Use `import type` for type-only imports

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #222;
  color: #ffd700;
  font-family: "Digital-7", "Roboto Mono", monospace;
  min-height: 100vh;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 400px;
`;

const Select = styled.select`
  padding: 15px;
  font-size: 1.2rem;
  border-radius: 5px;
  border: none;
  background-color: #000;
  color: #ffd700;
`;

const Input = styled.input`
  padding: 15px;
  font-size: 1.2rem;
  border-radius: 5px;
  border: none;
  background-color: #000;
  color: #ffd700;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 15px 30px;
  font-size: 1.2rem;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-family: "Digital-7", "Roboto Mono", monospace;
  text-transform: uppercase;
  font-weight: bold;
  transition: all 0.3s;

  /* Default styles for gray buttons */
  background-color: #ccc;
  color: #000;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const AddTimerView: FC = () => {
  const { addTimer } = useTimerContext();
  const navigate = useNavigate();

  const [type, setType] = useState<"stopwatch" | "countdown" | "XY" | "tabata">("stopwatch");
  const [duration, setDuration] = useState<number>(0);

  const handleAddTimer = (e: React.FormEvent) => {
    e.preventDefault();

    // Add the timer to the context
    addTimer({
      id: uuidv4(),
      type,
      duration: type === "stopwatch" ? 0 : duration * 1000, // Convert seconds to milliseconds
      status: "not running",
    });

    // Navigate back to the main page
    navigate("/");
  };

  return (
    <Container>
      <Title>Add a New Timer</Title>
      <Form onSubmit={handleAddTimer}>
        <Select
          value={type}
          onChange={(e) =>
            setType(e.target.value as "stopwatch" | "countdown" | "XY" | "tabata")
          }
        >
          <option value="stopwatch">Stopwatch</option>
          <option value="countdown">Countdown</option>
          <option value="XY">XY Timer</option>
          <option value="tabata">Tabata Timer</option>
        </Select>

        {type !== "stopwatch" && (
          <Input
            type="number"
            min="0"
            placeholder="Enter duration (seconds)"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            required
          />
        )}

        <ButtonContainer>
          <Button type="submit">Add Timer</Button>
          <Button type="button" onClick={() => navigate("/")}>
            Cancel
          </Button>
        </ButtonContainer>
      </Form>
    </Container>
  );
};

export default AddTimerView;
