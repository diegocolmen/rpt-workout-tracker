import React, { useState, useEffect } from 'react';

const initialWorkout = [
  {
    name: 'Overhead Press',
    sets: [
      { target: '4–6', weight: '', reps: '' },
      { target: '6–8', weight: '', reps: '' },
      { target: '8–10', weight: '', reps: '' }
    ]
  },
  {
    name: 'Lateral Raises',
    sets: [
      { target: '10–12', weight: '', reps: '' },
      { target: '12–15', weight: '', reps: '' },
      { target: '12–15', weight: '', reps: '' }
    ]
  },
  {
    name: 'Face Pulls',
    sets: [
      { target: '12–15', weight: '', reps: '' },
      { target: '12–15', weight: '', reps: '' },
      { target: '15–20', weight: '', reps: '' }
    ]
  },
  {
    name: 'Incline Bench Press',
    sets: [
      { target: '4–6', weight: '', reps: '' },
      { target: '6–8', weight: '', reps: '' },
      { target: '8–10', weight: '', reps: '' }
    ]
  }
];

const WorkoutTracker = () => {
  const [workoutData, setWorkoutData] = useState([]);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [lastSession, setLastSession] = useState({});

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('rptWorkoutHistory'));
    if (savedData) {
      setLastSession(savedData);
    }
    setWorkoutData(initialWorkout);
  }, []);

  useEffect(() => {
    if (timer > 0 && !intervalId) {
      const id = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(id);
            setIntervalId(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setIntervalId(id);
    }
  }, [timer, intervalId]);

  const handleChange = (exerciseIdx, setIdx, field, value) => {
    const updated = [...workoutData];
    updated[exerciseIdx].sets[setIdx][field] = value;
    setWorkoutData(updated);
  };

  const saveSession = () => {
    const sessionData = {};
    workoutData.forEach((exercise) => {
      sessionData[exercise.name] = exercise.sets.map((s) => ({
        weight: s.weight,
        reps: s.reps
      }));
    });
    localStorage.setItem('rptWorkoutHistory', JSON.stringify(sessionData));
    setLastSession(sessionData);
    alert('Session saved!');
  };

  const startTimer = (seconds = 90) => {
    if (intervalId) clearInterval(intervalId);
    setIntervalId(null);
    setTimer(seconds);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Shoulder Day – RPT</h1>
      {workoutData.map((exercise, i) => (
        <div key={i} style={{ marginBottom: '24px' }}>
          <h2>{exercise.name}</h2>
          {exercise.sets.map((set, j) => (
            <div key={j} style={{ marginBottom: '8px' }}>
              <strong>Set {j + 1} ({set.target} reps):</strong>
              <input
                type="number"
                placeholder="Weight"
                value={set.weight}
                onChange={(e) => handleChange(i, j, 'weight', e.target.value)}
                style={{ marginLeft: '10px', marginRight: '10px', width: '70px' }}
              />
              <input
                type="number"
                placeholder="Reps"
                value={set.reps}
                onChange={(e) => handleChange(i, j, 'reps', e.target.value)}
                style={{ width: '70px' }}
              />
              {lastSession[exercise.name]?.[j] && (
                <span style={{ marginLeft: '10px', color: '#666', fontSize: '12px' }}>
                  Prev: {lastSession[exercise.name][j].weight}kg x {lastSession[exercise.name][j].reps}
                </span>
              )}
            </div>
          ))}
        </div>
      ))}

      <button onClick={saveSession} style={{ marginRight: '10px' }}>
        Save This Session
      </button>
      <button onClick={() => startTimer(90)}>Start Rest Timer</button>

      {timer > 0 && (
        <div style={{ marginTop: '16px', fontSize: '24px' }}>
          ⏱️ Rest: {timer}s
        </div>
      )}
    </div>
  );
};

export default WorkoutTracker;
