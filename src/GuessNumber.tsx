import React, { useState } from 'react';

const getRandom = () => Math.floor(Math.random() * 100) + 1;


const GuessNumber: React.FC = () => {
  const [target, setTarget] = useState(getRandom());
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [attempts, setAttempts] = useState(0);
console.log('target', target);
  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(guess);
    if (!guess || isNaN(num) || num < 1 || num > 100) {
      setMessage('Enter a number between 1 and 100!');
      return;
    }
    setAttempts(attempts + 1);
    if (num === target) {
      setMessage(`🎉 Correct! You guessed in ${attempts + 1} tries. Play again?`);
    } else if (num < target) {
      setMessage('Too low!');
    } else {
      setMessage('Too high!');
    }
  };

  const handleRestart = () => {
    setTarget(getRandom());
    setGuess('');
    setMessage('');
    setAttempts(0);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-200 to-blue-400 p-4">
      <div className="bg-white/95 rounded-2xl shadow-2xl p-6 w-full max-w-md flex flex-col items-center">
        <h2 className="text-2xl font-bold text-green-800 mb-4">Guess the Number</h2>
        <form className="flex gap-2 mb-4" onSubmit={handleGuess}>
          <input
            type="number"
            min={1}
            max={100}
            className="border border-green-300 p-2 rounded-lg focus:ring-2 focus:ring-green-400 outline-none bg-green-50"
            value={guess}
            onChange={e => setGuess(e.target.value)}
            placeholder="Enter a number (1-100)"
          />
          <button className="bg-gradient-to-r from-green-500 to-green-700 text-white px-5 py-2 rounded-lg font-semibold shadow hover:from-green-600 hover:to-green-800 transition" type="submit">
            Guess
          </button>
        </form>
        {message && <div className="mb-4 text-lg font-semibold text-green-700">{message}</div>}
        {(message.includes('Correct') || message.includes('Play again')) && (
          <button className="mt-2 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded shadow font-semibold transition" onClick={handleRestart}>
            Restart
          </button>
        )}
      </div>
    </div>
  );
};

export default GuessNumber;
