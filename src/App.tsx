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
import TicTacToe from './TicTacToe';
import HomeDashboard from './HomeDashboard';
import TypingTest from './TypingTest';
import MemoryGame from './MemoryGame';
import PasswordGenerator from './PasswordGenerator';
import Navbar from './Navbar';

function AppContent() {
  const location = useLocation();
  const isWeather = location.pathname === '/weather';
  return (
    <div className={isWeather ? '' : 'min-h-screen bg-gradient-to-br from-slate-100 to-blue-200'}>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomeDashboard />} />
        <Route path="/weather" element={<WeatherApp />} />
        <Route path="/currency" element={<CurrencyTranslator />} />
        <Route path="/todo" element={<TodoList />} />
        <Route path="/gpa" element={<GPACalculator />} />
        <Route path="/movies" element={<MovieApp />} />
        <Route path="/series" element={<SeriesApp />} />
        <Route path="/dice" element={<DiceRoller />} />
        <Route path="/tictactoe" element={<TicTacToe />} />
        <Route path="/typing-test" element={<TypingTest />} />
        <Route path="/memory-game" element={<MemoryGame />} />
        <Route path="/password-generator" element={<PasswordGenerator />} />
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
