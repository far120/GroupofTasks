import React, { useState } from 'react';

const getRandom = () => Math.floor(Math.random() * 100) + 1;
const MAX_ATTEMPTS = 10;

function calcScore(attempts: number, correct: boolean) {
    if (!correct) return 0;
    // Score: 100 for first try, 90 for second, ..., 10 for 10th, 0 if failed
    return Math.max(0, 110 - attempts * 10);
}

const GuessNumberScore: React.FC = () => {
    const [target, setTarget] = useState(getRandom());
    const [guess, setGuess] = useState('');
    const [message, setMessage] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [score, setScore] = useState<number | null>(null);
    const [gameOver, setGameOver] = useState(false);
    console.log('Target:', target);

    const handleGuess = (e: React.FormEvent) => {
        e.preventDefault();
        if (gameOver) return;
        const num = Number(guess);
        if (!guess || isNaN(num) || num < 1 || num > 100) {
            setMessage('Enter a number between 1 and 100!');
            return;
        }
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (num === target) {
            const s = calcScore(newAttempts, true);
            setScore(s);
            setMessage(`🎉 Correct! You guessed in ${newAttempts} tries. Score: ${s}`);
            setGameOver(true);
        } else if (newAttempts >= MAX_ATTEMPTS) {
            setScore(0);
            setMessage(`❌ Game over! The number was ${target}. Score: 0`);
            setGameOver(true);
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
        setScore(null);
        setGameOver(false);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-200 to-blue-400 p-4">
            <div className="bg-white/95 rounded-2xl shadow-2xl p-6 w-full max-w-md flex flex-col items-center">
                <h2 className="text-2xl font-bold text-green-800 mb-4">Guess the Number (1-100)</h2>
                <form className="flex gap-2 mb-4" onSubmit={handleGuess}>
                    <input
                        type="number"
                        min={1}
                        max={100}
                        className="border border-green-300 p-2 rounded-lg focus:ring-2 focus:ring-green-400 outline-none bg-green-50"
                        value={guess}
                        onChange={e => setGuess(e.target.value)}
                        placeholder="Enter a number (1-100)"
                        disabled={gameOver}
                    />
                    <button className="bg-gradient-to-r from-green-500 to-green-700 text-white px-5 py-2 rounded-lg font-semibold shadow hover:from-green-600 hover:to-green-800 transition" type="submit" disabled={gameOver}>
                        Guess
                    </button>
                </form>
                <div className="mb-2 text-gray-700">Attempt: {attempts} / {MAX_ATTEMPTS}</div>
                {message && <div className="mb-4 text-lg font-semibold text-green-700">{message}</div>}
                {gameOver && (
                    <button className="mt-2 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded shadow font-semibold transition" onClick={handleRestart}>
                        Restart
                    </button>
                )}
            </div>
        </div>
    );
};

export default GuessNumberScore;
