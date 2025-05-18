import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import WeatherApp from './WeatherApp';
import CurrencyTranslator from './CurrencyTranslator';
import TodoList from './TodoList';
import GPACalculator from './GPACalculator';
import MovieApp from './MovieApp';
import SeriesApp from './SeriesApp';
import DiceRoller from './DiceRoller';
import MovieDetails from './MovieDetails';
import SeriesDetails from './SeriesDetails';
import WorldTime from './WorldTime';
import Calculator from './Calculator';
import AgeCalculator from './AgeCalculator';
import GuessNumberScore from './GuessNumberScore';
import PomodoroTimer from './PomodoroTimer';

function AppContent() {
  const location = useLocation();
  const isWeather = location.pathname === '/weather';
  return (
    <div className={isWeather ? '' : 'min-h-screen bg-gradient-to-br from-slate-100 to-blue-200'}>
      <nav className="bg-gray-800 p-4 flex gap-4 justify-center shadow flex-wrap">
        <Link className="text-white hover:text-blue-300 font-semibold" to="/">Home</Link>
        <Link className="text-white hover:text-blue-300 font-semibold" to="/weather">Weather</Link>
        <Link className="text-white hover:text-blue-300 font-semibold" to="/currency">Currency</Link>
        <Link className="text-white hover:text-blue-300 font-semibold" to="/todo">To-Do</Link>
        <Link className="text-white hover:text-blue-300 font-semibold" to="/gpa">GPA Calculator</Link>
        <Link className="text-white hover:text-blue-300 font-semibold" to="/movies">Movies</Link>
        <Link className="text-white hover:text-blue-300 font-semibold" to="/series">Series</Link>
        <Link className="text-white hover:text-orange-300 font-semibold" to="/dice">Dice Roller</Link>
        <Link className="text-white hover:text-blue-300 font-semibold" to="/worldtime">World Time</Link>
        <Link className="text-white hover:text-blue-300 font-semibold" to="/calculator">Calculator</Link>
        <Link className="text-white hover:text-blue-300 font-semibold" to="/age-calculator">Age Calculator</Link>
        <Link className="text-white hover:text-blue-300 font-semibold" to="/guess-number-score">Guess Number Score</Link>
        <Link className="text-white hover:text-blue-300 font-semibold" to="/pomodoro">Pomodoro Timer</Link>
      </nav>
      <Routes>
        <Route path="/" element={
          <div className="text-center mt-16">
            <h1 className="text-4xl font-extrabold mb-4 text-blue-800">Welcome to the Multi-Tool App</h1>
            <p className="text-lg text-gray-700">Choose a feature from the navigation bar above.</p>
          </div>
        } />
        <Route path="/weather" element={<WeatherApp />} />
        <Route path="/currency" element={<CurrencyTranslator />} />
        <Route path="/todo" element={<TodoList />} />
        <Route path="/gpa" element={<GPACalculator />} />
        <Route path="/movies" element={<MovieApp />} />
        <Route path="/series" element={<SeriesApp />} />
        <Route path="/dice" element={<DiceRoller />} />
        <Route path="/movies/:imdbID" element={<MovieDetails />} />
        <Route path="/series/:imdbID" element={<SeriesDetails />} />
        <Route path="/worldtime" element={<WorldTime />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/age-calculator" element={<AgeCalculator />} />
        <Route path="/guess-number-score" element={<GuessNumberScore />} />
        <Route path="/pomodoro" element={<PomodoroTimer />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
