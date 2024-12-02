import styled from 'styled-components';
import { useTimerContext } from '../../TimerContext';

// ------------------- Styled Components -------------------

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background-color: #000;
  border-radius: 10px;
  border: 2px solid #ffd700;
`;

const TimeDisplay = styled.div`
  font-family: "Digital-7", monospace;
  font-size: 48px;
  color: #ffd700;
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
`;

const Label = styled.div`
  font-size: 1.2rem;
  color: #ffd700;
  text-align: center;
`;

const StatusBadge = styled.div<{ status: string }>`
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  text-transform: uppercase;
  background-color: ${({ status }) => {
      switch (status) {
          case 'running':
              return '#2ecc40';
          case 'paused':
              return '#ff851b';
          case 'completed':
              return '#ff4136';
          default:
              return '#7f8c8d';
      }
  }};
  color: white;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 10px;
  background-color: #333;
  border-radius: 5px;
  overflow: hidden;
`;

const Progress = styled.div<{ percent: number; isWorking: boolean }>`
  width: ${props => props.percent}%;
  height: 100%;
  background-color: ${props => (props.isWorking ? '#2ecc40' : '#ff851b')};
  transition: width 0.3s ease;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  width: 100%;
  text-align: center;
`;

const InfoItem = styled.div`
  background: rgba(0, 0, 0, 0.3);
  padding: 10px;
  border-radius: 5px;
  color: #ffd700;
`;

const PhaseIndicator = styled.div<{ isWorking: boolean }>`
  font-size: 1.5rem;
  color: ${props => (props.isWorking ? '#2ecc40' : '#ff851b')};
  font-weight: bold;
  text-transform: uppercase;
  margin: 10px 0;
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  border: 1px solid ${props => (props.isWorking ? '#2ecc40' : '#ff851b')};
`;

const RoundDisplay = styled.div`
  font-size: 1.2rem;
  color: #ffd700;
  margin: 10px 0;
  text-align: center;
`;

// ------------------- Helper Functions -------------------

const formatTime = (timeInMilliseconds: number): string => {
    const totalSeconds = Math.ceil(timeInMilliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// ------------------- Tabata Timer Component -------------------

interface TabataProps {
    duration: number;
    currentRound: number;
    rounds: number;
    workTime: number;
    restTime: number;
    isWorking: boolean;
    status: 'not running' | 'running' | 'paused' | 'completed';
    isActive?: boolean;
}

export default function Tabata({ duration, currentRound, rounds, workTime, restTime, isWorking, status, isActive = false }: TabataProps) {
    const { fastForward } = useTimerContext();

    // Calculate progress percentage for current interval
    const currentInterval = isWorking ? workTime : restTime;
    const progressPercent = (duration / currentInterval) * 100;

    // Calculate remaining rounds
    const remainingRounds = rounds - currentRound + 1;

    // Calculate total remaining time
    const remainingTime = duration + (remainingRounds - 1) * (workTime + restTime) + (isWorking ? restTime : 0);

    // Check if current interval is complete
    if (duration <= 0 && status === 'running') {
        fastForward();
    }

    return (
        <Container>
            <Label>TABATA TIMER</Label>

            {isActive && (
                <>
                    <PhaseIndicator isWorking={isWorking}>{isWorking ? 'Work!' : 'Rest'}</PhaseIndicator>

                    <RoundDisplay>
                        Round {currentRound} of {rounds}
                    </RoundDisplay>
                </>
            )}

            <TimeDisplay>{formatTime(duration)}</TimeDisplay>

            <StatusBadge status={status}>{status}</StatusBadge>

            {isActive && (
                <>
                    <InfoGrid>
                        <InfoItem>Interval: {formatTime(currentInterval)}</InfoItem>
                        <InfoItem>Remaining: {formatTime(remainingTime)}</InfoItem>
                    </InfoGrid>

                    <ProgressBar>
                        <Progress percent={progressPercent} isWorking={isWorking} />
                    </ProgressBar>
                </>
            )}

            {!isActive && (
                <InfoGrid>
                    <InfoItem>Rounds: {rounds}</InfoItem>
                    <InfoItem>Work: {formatTime(workTime)}</InfoItem>
                    <InfoItem>Rest: {formatTime(restTime)}</InfoItem>
                    <InfoItem>Total: {formatTime((workTime + restTime) * rounds)}</InfoItem>
                </InfoGrid>
            )}
        </Container>
    );
}
