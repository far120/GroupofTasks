import React, { useState, useEffect, useRef, useCallback } from 'react';

const SAMPLE_TEXTS = [
  "The secret to getting ahead is getting started. The secret of getting started is breaking your complex overwhelming tasks into small manageable tasks, and starting on the first one.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. Great works are performed not by strength, but by perseverance and dedication.",
  "Technology is best when it brings people together. Innovation distinguishes between a leader and a follower. Software is a great combination between artistry and engineering.",
  "React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.",
  "Life is like riding a bicycle. To keep your balance, you must keep moving. Opportunities don't happen, you create them through hard work and focus."
];

const TypingTest: React.FC = () => {
  const [duration, setDuration] = useState<number>(30); // 15, 30, or 60 seconds
  const [targetText, setTargetText] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [mistakes, setMistakes] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize random text
  const getRandomText = () => {
    const randomIndex = Math.floor(Math.random() * SAMPLE_TEXTS.length);
    return SAMPLE_TEXTS[randomIndex];
  };

  const resetTest = useCallback((newDuration?: number) => {
    const dur = newDuration ?? duration;
    setTargetText(getRandomText());
    setUserInput('');
    setTimeLeft(dur);
    setIsActive(false);
    setIsCompleted(false);
    setMistakes(0);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [duration]);

  useEffect(() => {
    resetTest();
  }, [resetTest]);

  // Timer interval
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setIsCompleted(true);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  // Handle Input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (isCompleted || val.length > targetText.length) return;

    if (!isActive && val.length > 0) {
      setIsActive(true);
    }

    // Count new mistakes
    let newMistakes = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] !== targetText[i]) {
        newMistakes++;
      }
    }
    setMistakes(newMistakes);
    setUserInput(val);

    // Auto complete if finished whole paragraph
    if (val.length === targetText.length) {
      setIsActive(false);
      setIsCompleted(true);
    }
  };

  // Metrics calculations
  const timeElapsed = duration - timeLeft;
  const minutes = timeElapsed > 0 ? timeElapsed / 60 : 0.001;

  let correctChars = 0;
  userInput.split('').forEach((char, idx) => {
    if (char === targetText[idx]) {
      correctChars++;
    }
  });

  const wpm = Math.round((correctChars / 5) / minutes);
  const cpm = Math.round(correctChars / minutes);
  const accuracy = userInput.length > 0 ? Math.round((correctChars / userInput.length) * 100) : 100;

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-200">
      <div className="w-full max-w-3xl bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-10 flex flex-col items-center">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl">⌨️</span>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Typing Speed Test</h1>
        </div>

        {/* Timer Duration Selection */}
        <div className="flex items-center gap-3 mb-8 bg-gray-100 p-1.5 rounded-2xl">
          {[15, 30, 60].map((sec) => (
            <button
              key={sec}
              onClick={() => {
                setDuration(sec);
                resetTest(sec);
              }}
              disabled={isActive}
              className={`px-5 py-2 rounded-xl text-sm font-extrabold transition-all ${
                duration === sec
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {sec} Seconds
            </button>
          ))}
        </div>

        {/* Real-time Dashboard Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full mb-8 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">Timer</div>
            <div className="text-3xl font-black text-blue-700 mt-1">{timeLeft}s</div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
            <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Speed</div>
            <div className="text-3xl font-black text-emerald-700 mt-1">{wpm} <span className="text-xs font-normal">WPM</span></div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4">
            <div className="text-xs font-bold text-purple-600 uppercase tracking-wider">Accuracy</div>
            <div className="text-3xl font-black text-purple-700 mt-1">{accuracy}%</div>
          </div>

          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4">
            <div className="text-xs font-bold text-rose-600 uppercase tracking-wider">Mistakes</div>
            <div className="text-3xl font-black text-rose-700 mt-1">{mistakes}</div>
          </div>
        </div>

        {/* Text Display Area */}
        <div
          onClick={() => inputRef.current?.focus()}
          className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 mb-6 text-xl sm:text-2xl leading-relaxed tracking-wide font-mono select-none cursor-pointer hover:border-blue-300 transition-colors relative min-h-[140px]"
        >
          {targetText.split('').map((char, index) => {
            let stateClass = 'text-gray-400';
            if (index < userInput.length) {
              stateClass =
                userInput[index] === char
                  ? 'text-emerald-600 bg-emerald-100/60 rounded'
                  : 'text-rose-600 bg-rose-200 rounded underline font-bold';
            } else if (index === userInput.length) {
              stateClass = 'bg-blue-500 text-white rounded animate-pulse font-bold';
            }
            return (
              <span key={index} className={`transition-colors px-[1px] ${stateClass}`}>
                {char}
              </span>
            );
          })}
        </div>

        {/* Hidden Input for Keyboard capture */}
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleChange}
          disabled={isCompleted}
          placeholder="Start typing here..."
          className="opacity-0 absolute w-0 h-0"
          autoFocus
        />

        {/* Helper prompt */}
        {!isActive && !isCompleted && (
          <p className="text-sm text-gray-500 mb-6 font-medium animate-bounce">
            💡 Click the box or start typing to begin the timer!
          </p>
        )}

        {/* Completion Modal / Score Breakdown */}
        {isCompleted && (
          <div className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl p-6 mb-6 text-center shadow-lg animate-fade-in">
            <h2 className="text-2xl font-black mb-2">🎉 Test Completed!</h2>
            <p className="text-emerald-100 text-sm mb-4">Great effort! Here is your typing speed performance:</p>
            <div className="grid grid-cols-3 gap-2 bg-white/20 backdrop-blur-md rounded-xl p-3 text-white">
              <div>
                <div className="text-xs font-bold uppercase opacity-80">Speed</div>
                <div className="text-2xl font-black">{wpm} WPM</div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase opacity-80">Accuracy</div>
                <div className="text-2xl font-black">{accuracy}%</div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase opacity-80">Characters</div>
                <div className="text-2xl font-black">{cpm} CPM</div>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => resetTest()}
          className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl shadow-lg hover:shadow-blue-300 transition-all active:scale-95 flex items-center gap-2"
        >
          🔄 Restart Test
        </button>
      </div>
    </div>
  );
};

export default TypingTest;
