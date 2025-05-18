import React, { useState, useRef } from 'react';

const PomodoroTimer: React.FC = () => {
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    // const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const formatTime = (secs: number) => {
        const h = Math.floor(secs / 3600).toString().padStart(2, '0');
        const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    const start = () => {
        if (isRunning) return;
        setIsRunning(true);
       setInterval(() => {
            setSeconds(prev => prev + 1);
        }, 1000);
    };

    const pause = () => {
        setIsRunning(false);
        
    };

    const reset = () => {
        setIsRunning(false);
        setSeconds(0);
    };

   

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-200 via-red-100 to-blue-200 p-6">
            <div className="bg-white/90 rounded-3xl shadow-2xl p-10 w-full max-w-md flex flex-col items-center border border-red-100">
                <h2 className="text-3xl font-extrabold mb-6 text-red-600 tracking-wide drop-shadow">Pomodoro Timer</h2>
                <div className="text-6xl font-mono mb-6 text-blue-700 bg-blue-100 px-8 py-4 rounded-xl shadow-inner border border-blue-200">
                    {formatTime(seconds)}
                </div>
                <div className="flex gap-6">
                    <button
                        className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white px-6 py-2 rounded-lg shadow font-bold transition disabled:opacity-50"
                        onClick={start}
                        disabled={isRunning}
                    >
                        Start
                    </button>
                    <button
                        className="bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-white px-6 py-2 rounded-lg shadow font-bold transition disabled:opacity-50"
                        onClick={pause}
                        disabled={!isRunning}
                    >
                        Pause
                    </button>
                    <button
                        className="bg-gray-400 hover:bg-gray-500 active:bg-gray-600 text-white px-6 py-2 rounded-lg shadow font-bold transition"
                        onClick={reset}
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PomodoroTimer;
