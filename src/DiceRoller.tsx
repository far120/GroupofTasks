import React, { useState } from 'react';

const diceImages = [
  '/dice1.png',
  '/dice2.png',
  '/dice3.png',
  '/dice4.png',
  '/dice5.png',
  '/dice6.png',
];

const DiceRoller: React.FC = () => {
  const [value, setValue] = useState(1);
  const [rolling, setRolling] = useState(false);

  const playSound = () => {
    const audio = new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae7e2.mp3');
    audio.play();
  };

  const rollDice = () => {
    setRolling(true);
    playSound();
    let rollCount = 0;
    const interval = setInterval(() => {
      setValue(Math.floor(Math.random() * 6) + 1);
      rollCount++;
      if (rollCount > 15) {
        clearInterval(interval);
        setRolling(false);
      }
    }, 60);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 to-orange-300">
      <h2 className="text-3xl font-bold mb-6 text-orange-700">Dice Roller 🎲</h2>
      <div className={`w-32 h-32 flex items-center justify-center mb-6 transition-transform duration-300 ${rolling ? 'animate-bounce' : ''}`}>
        <span className="text-7xl select-none">{value}</span>
      </div>
      <button
        className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-8 py-3 rounded-lg font-bold text-xl shadow hover:from-orange-500 hover:to-orange-700 transition disabled:opacity-60"
        onClick={rollDice}
        disabled={rolling}
      >
        {rolling ? 'Rolling...' : 'Roll Dice'}
      </button>
    </div>
  );
};

export default DiceRoller;
