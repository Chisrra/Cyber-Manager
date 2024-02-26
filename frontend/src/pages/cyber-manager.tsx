import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { AuthButton, useAuth } from "@bundly/ic-react";

interface TimeSelectionProps {
  onTimeSelected: (selectedTime: number) => void;
  onConfirm: () => void;
}

function TimeSelection({ onTimeSelected, onConfirm }: TimeSelectionProps) {
  const [selectedTime, setSelectedTime] = useState(0);

  const handleTimeSelection = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedTime(Number(e.target.value));
  };

  return (
    <div>
      <label>Select How much time You want to use a computer: </label>
      <select onChange={handleTimeSelection} style={{ marginRight: "8px" }}>
        <option value={0}>Select</option>
        <option value={1}>1 hour</option>
        <option value={2}>2 hours</option>
        <option value={3}>3 hours</option>
      </select>
      {selectedTime > 0 && (
        <button
          onClick={() => {
            onTimeSelected(selectedTime);
            onConfirm();
          }}
          style={{
            borderRadius: "50%", // Hace que el botón sea circular
            padding: "10px", // Ajusta el relleno para que se vea mejor
            backgroundColor: "#4CAF50", // Color de fondo
            color: "white", // Color del texto
            border: "none", // Quita el borde
            cursor: "pointer", // Cambia el cursor al pasar por encima
          }}
        >
          Confirm
        </button>
      )}
    </div>
  );
}

function calculateFee(selectedTime: number): number {
  const feePerHour = 5; 
  return selectedTime * feePerHour;
}

function calculateTaxes(totalFee: number): number {
  const taxesPercentage = 16; 
  return (totalFee * taxesPercentage) / 100;
}

function AuthStatusContent({
  confirmed,
  selectedTime,
  remainingTime,
  computerNumber,
  handleTimeUp,
  totalFee,
  totalTaxes,
  totalWithTaxes,
}: {
  confirmed: boolean;
  selectedTime: number;
  remainingTime: number;
  computerNumber: number;
  handleTimeUp: () => void;
  totalFee: number;
  totalTaxes: number;
  totalWithTaxes: number;
}) {
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secondsLeft = seconds % 60;

    const formattedHours = hours > 0 ? `${hours}h ` : '';
    const formattedMinutes = minutes > 0 ? `${minutes}m ` : '';
    const formattedSeconds = secondsLeft > 0 ? `${secondsLeft}s` : '';

    return formattedHours + formattedMinutes + formattedSeconds;
  };

  return (
    <div>
      {confirmed && selectedTime > 0 && (
        <div>
          <p>
            You can use computer number {computerNumber} for {selectedTime}{" "}
            hour(s).
          </p>
          <p>
            Fee: ${totalFee.toFixed(2)}, Taxes: ${totalTaxes.toFixed(2)} = Total Fee: ${totalWithTaxes.toFixed(2)}
          </p>
          <p>Time Remaining: {formatTime(remainingTime)}</p>
          {remainingTime <= 0 && (
            <div>
              <p>Your time is up!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AuthStatus() {
  const { isAuthenticated } = useAuth();
  const [selectedTime, setSelectedTime] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const computerNumberRef = useRef<number>(Math.floor(Math.random() * 10) + 1);

  const totalFee = calculateFee(selectedTime);
  const totalTaxes = calculateTaxes(totalFee);
  const totalWithTaxes = totalFee + totalTaxes;

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (confirmed && selectedTime > 0) {
      setRemainingTime(selectedTime * 1); // In testing use just seconds

      timerId = setInterval(() => {
        setRemainingTime((prevRemainingTime) => {
          if (prevRemainingTime > 0) {
            return prevRemainingTime - 1;
          } else {
            clearInterval(timerId);
            handleTimeUp();
            return 0;
          }
        });
      }, 1000);
    }

    return () => clearInterval(timerId); // Cleanup on component unmount or when the timer stops
  }, [confirmed, selectedTime]);

  const handleTimeUp = () => {
    if (confirmed) {
      const userWantsToContinue = window.confirm(
        `Your time is up! Do you want to continue on computer number ${computerNumberRef.current}?`
      );

      if (userWantsToContinue) {
        setRemainingTime(selectedTime * 60);
        setConfirmed(false); // Reset the confirmed state to ask for time again
      } else {
        setConfirmed(false);
        alert(`You chose not to continue using computer number ${computerNumberRef.current}`);
        // Change the computer number when Cancel is clicked
        computerNumberRef.current = Math.floor(Math.random() * 10) + 1;
      }
    }
  };

  const handleConfirm = () => {
    setConfirmed(true);
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>You logged successfully using Internet Identity</p>
          <AuthButton />
          <p></p>
          {!confirmed && (
            <div>
              <TimeSelection
                onTimeSelected={(time) => setSelectedTime(time)}
                onConfirm={handleConfirm}
              />
            </div>
          )}
          <AuthStatusContent
            confirmed={confirmed}
            selectedTime={selectedTime}
            remainingTime={remainingTime}
            computerNumber={computerNumberRef.current}
            handleTimeUp={handleTimeUp}
            totalFee={totalFee}
            totalTaxes={totalTaxes}
            totalWithTaxes={totalWithTaxes}
          />
        </div>
      ) : (
        <AuthButton />
      )}
    </div>
  );
}

export default function CyberManagerMain() {
  return (
    <div>
      <h1 style={{ color: "#4CAF50" }}>Cyber Manager</h1>
      <p>This is a CyberCafé Manager</p>
      <AuthStatus />
    </div>
  );
}