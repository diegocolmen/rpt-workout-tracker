// WorkoutTracker.jsx
import React, { useState, useEffect } from 'react';

const workouts = {
  'Monday - Pull': [
    { name: 'Weighted Pull-Ups', sets: ['4–6', '6–8', '8–10'] },
    { name: 'Barbell Row', sets: ['4–6', '6–8', '8–10'] },
    { name: 'Dumbbell Curls', sets: ['10–12', '12–15', '12–15'] },
    { name: 'Hammer Curls', sets: ['10–12', '12–15', '12–15'] },
  ],
  'Tuesday - Core A': [
    { name: 'Plank Holds (sec)', sets: ['45', '60', '60'] },
    { name: 'Cable Woodchoppers', sets: ['12–15', '12–15', '12–15'] },
    { name: 'V-Ups', sets: ['15–20', '15–20', '15–20'] },
    { name: 'Bicycle Crunches (sec)', sets: ['30', '30', '30'] },
  ],
  'Wednesday - Push': [
    { name: 'Incline Bench Press', sets: ['4–6', '6–8', '8–10'] },
    { name: 'Overhead Press', sets: ['4–6', '6–8', '8–10'] },
    { name: 'Lateral Raises', sets: ['10–12', '12–15', '12–15'] },
    { name: 'Face Pulls', sets: ['12–15', '12–15', '15–20'] },
    { name: 'Triceps Pushdowns', sets: ['10–12', '12–15', '12–15'] },
  ],
  'Thursday - Core B': [
    { name: 'Hanging Leg Raises', sets: ['12–15', '12–15', '12–15'] },
    { name: 'Ab Wheel Rollouts', sets: ['8–12', '8–12', '8–12'] },
    { name: 'Side Planks (sec)', sets: ['30', '45', '45'] },
    { name: 'Russian Twists', sets: ['20', '20', '20'] },
  ],
  'Friday - Legs': [
    { name: 'Romanian Deadlift', sets: ['4–6', '6–8', '8–10'] },
    { name: 'Bulgarian Split Squat', sets: ['8–10', '10–12', '12–15'] },
    { name: 'Calf Raises', sets: ['12–15', '12–15', '15–20'] },
    { name: 'Hanging Leg Raises', sets: ['12–15', '12–15', '15–20'] },
  ]
};

const WorkoutTracker = ({ day }) => {
  const [entries, setEntries] = useState({});
  const [history, setHistory] = useState({});
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('workout-history');
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  const handleChange = (exercise, setIndex, field, value) => {
    setEntries((prev) => ({
      ...prev,
      [exercise]: {
        ...prev[exercise],
        [setIndex]: {
          ...prev[exercise]?.[setIndex],
          [field]: value
        }
      }
    }));
  };

  const saveSession = () => {
    const newHistory = { ...history, [day]: entries };
    localStorage.setItem('workout-history', JSON.stringify(newHistory));
    setHistory(newHistory);
    alert('Workout saved!');
  };

  const startRest = () => {
    if (timer) return;
    let time = 90;
    setTimer(time);
    const interval = setInterval(() => {
      time -= 1;
      setTimer(time);
      if (time <= 0) {
        clearInterval(interval);
        setTimer(null);
      }
    }, 1000);
  };

  return (
    <div>
      <h2>{day}</h2>
      {workouts[day]?.map((exercise, i) => (
        <div key={i} style={{ marginBottom: '20px' }}>
          <h3>{exercise.name}</h3>
          {exercise.sets.map((target, idx) => (
            <div key={idx}>
              <label>Set {idx + 1} (Target: {target})</label><br />
              <input
                placeholder="Weight"
                value={entries[exercise.name]?.[idx]?.weight || ''}
                onChange={(e) => handleChange(exercise.name, idx, 'weight', e.target.value)}
              /> kg
              <input
                placeholder="Reps"
                value={entries[exercise.name]?.[idx]?.reps || ''}
                onChange={(e) => handleChange(exercise.name, idx, 'reps', e.target.value)}
              /> reps
              {history[day]?.[exercise.name]?.[idx] && (
                <small>
                  &nbsp;(Last: {history[day][exercise.name][idx].weight || '-'} kg / {history[day][exercise.name][idx].reps || '-'} reps)
                </small>
              )}
            </div>
          ))}
        </div>
      ))}
      <button onClick={saveSession}>Save This Session</button>
      <button onClick={startRest} style={{ marginLeft: '10px' }}>Start Rest (90s)</button>
      {timer !== null && <p>Rest: {timer}s</p>}
    </div>
  );
};

export default WorkoutTracker;
