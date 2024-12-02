import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { useTimerContext } from '../TimerContext';
import type { Timer } from '../TimerContext';

// ------------------- Styled Components -------------------

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Label = styled.label`
  color: #ffd700;
  font-size: 1.1rem;
`;

const Select = styled.select`
  padding: 12px;
  border-radius: 5px;
  border: 1px solid #ffd700;
  background: #000;
  color: #ffd700;
  font-size: 1rem;
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 5px;
  border: 1px solid #ffd700;
  background: #000;
  color: #ffd700;
  font-size: 1rem;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 20px;
`;

const Button = styled.button<{ $variant?: 'submit' | 'cancel' }>`
  padding: 12px 24px;
  border-radius: 5px;
  border: none;
  background: ${props => (props.$variant === 'submit' ? '#ffd700' : '#666')};
  color: ${props => (props.$variant === 'submit' ? '#000' : '#fff')};
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

// ------------------- AddTimerView Component -------------------

export default function AddTimerView() {
    const navigate = useNavigate();
    const { addTimer } = useTimerContext();

    // Basic timer state
    const [type, setType] = useState<Timer['type']>('stopwatch');

    // Common timer states
    const [duration, setDuration] = useState(60);

    // XY and Tabata specific states
    const [rounds, setRounds] = useState(5);
    const [workTime, setWorkTime] = useState(30);
    const [restTime, setRestTime] = useState(10);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let newTimer: Timer;

        switch (type) {
            case 'stopwatch':
                newTimer = {
                    id: uuidv4(),
                    type: 'stopwatch',
                    duration: 0,
                    status: 'not running',
                };
                break;

            case 'countdown':
                newTimer = {
                    id: uuidv4(),
                    type: 'countdown',
                    duration: duration * 1000,
                    initialDuration: duration * 1000,
                    status: 'not running',
                };
                break;

            case 'XY':
                newTimer = {
                    id: uuidv4(),
                    type: 'XY',
                    rounds: rounds,
                    currentRound: 1,
                    workTime: workTime * 1000,
                    restTime: restTime * 1000,
                    isWorking: true,
                    duration: workTime * 1000,
                    status: 'not running',
                };
                break;

            case 'tabata':
                newTimer = {
                    id: uuidv4(),
                    type: 'tabata',
                    rounds: rounds,
                    currentRound: 1,
                    workTime: workTime * 1000,
                    restTime: restTime * 1000,
                    isWorking: true,
                    duration: workTime * 1000,
                    status: 'not running',
                };
                break;
        }

        addTimer(newTimer);
        navigate('/');
    };

    return (
        <Container>
            <h2>Add New Timer</h2>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label>Timer Type</Label>
                    <Select value={type} onChange={e => setType(e.target.value as Timer['type'])}>
                        <option value="stopwatch">Stopwatch</option>
                        <option value="countdown">Countdown</option>
                        <option value="XY">XY</option>
                        <option value="tabata">Tabata</option>
                    </Select>
                </FormGroup>

                {type === 'countdown' && (
                    <FormGroup>
                        <Label>Duration (seconds)</Label>
                        <Input type="number" min="1" value={duration} onChange={e => setDuration(Math.max(1, Number.parseInt(e.target.value) || 0))} required />
                    </FormGroup>
                )}

                {(type === 'XY' || type === 'tabata') && (
                    <>
                        <FormGroup>
                            <Label>Number of Rounds</Label>
                            <Input type="number" min="1" value={rounds} onChange={e => setRounds(Math.max(1, Number.parseInt(e.target.value) || 0))} required />
                        </FormGroup>

                        <FormGroup>
                            <Label>Work Time (seconds)</Label>
                            <Input type="number" min="1" value={workTime} onChange={e => setWorkTime(Math.max(1, Number.parseInt(e.target.value) || 0))} required />
                        </FormGroup>

                        <FormGroup>
                            <Label>Rest Time (seconds)</Label>
                            <Input type="number" min="1" value={restTime} onChange={e => setRestTime(Math.max(1, Number.parseInt(e.target.value) || 0))} required />
                        </FormGroup>
                    </>
                )}

                <ButtonGroup>
                    <Button $variant="submit" type="submit">
                        Add Timer
                    </Button>
                    <Button type="button" onClick={() => navigate('/')}>
                        Cancel
                    </Button>
                </ButtonGroup>
            </Form>
        </Container>
    );
}
