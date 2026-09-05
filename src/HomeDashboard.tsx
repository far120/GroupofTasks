import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface ToolItem {
  id: string;
  name: string;
  category: 'Utilities' | 'Calculators' | 'Games' | 'Entertainment';
  icon: string;
  description: string;
  path: string;
  color: string;
}

const TOOLS: ToolItem[] = [
  {
    id: 'weather',
    name: 'Weather App',
    category: 'Utilities',
    icon: '🌤️',
    description: 'Check real-time weather forecasts and temperature for cities worldwide.',
    path: '/weather',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'currency',
    name: 'Currency Translator',
    category: 'Utilities',
    icon: '💱',
    description: 'Convert live foreign exchange rates across top global currencies.',
    path: '/currency',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'todo',
    name: 'To-Do List',
    category: 'Utilities',
    icon: '📝',
    description: 'Manage tasks, track progress, filter completed items, and stay organized.',
    path: '/todo',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    id: 'pomodoro',
    name: 'Pomodoro Timer',
    category: 'Utilities',
    icon: '⏱️',
    description: 'Boost focus and productivity with customizable work/rest timer sessions.',
    path: '/pomodoro',
    color: 'from-rose-500 to-red-500'
  },
  {
    id: 'worldtime',
    name: 'World Time',
    category: 'Utilities',
    icon: '🌍',
    description: 'View real-time clocks across major global cities and time zones.',
    path: '/worldtime',
    color: 'from-sky-500 to-indigo-500'
  },
  {
    id: 'gpa',
    name: 'GPA Calculator',
    category: 'Calculators',
    icon: '🎓',
    description: 'Calculate semester Grade Point Average with custom course credit hours.',
    path: '/gpa',
    color: 'from-violet-500 to-purple-600'
  },
  {
    id: 'calculator',
    name: 'Calculator',
    category: 'Calculators',
    icon: '🔢',
    description: 'Perform everyday arithmetic calculations with an easy-to-use keypad.',
    path: '/calculator',
    color: 'from-slate-600 to-gray-700'
  },
  {
    id: 'age-calculator',
    name: 'Age Calculator',
    category: 'Calculators',
    icon: '🎂',
    description: 'Determine your exact age in years, months, days, and upcoming birthdays.',
    path: '/age-calculator',
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 'tictactoe',
    name: 'Tic-Tac-Toe',
    category: 'Games',
    icon: '❌⭕',
    description: 'Play 2-Player or test your skills against an Unbeatable AI algorithm.',
    path: '/tictactoe',
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 'typing-test',
    name: 'Typing Speed Test',
    category: 'Games',
    icon: '⌨️',
    description: 'Measure your typing speed (WPM), accuracy %, and characters per minute.',
    path: '/typing-test',
    color: 'from-blue-600 to-indigo-600'
  },
  {
    id: 'guess-number',
    name: 'Guess Number Score',
    category: 'Games',
    icon: '🎯',
    description: 'Guess the secret number with hints and track your highest scores.',
    path: '/guess-number-score',
    color: 'from-emerald-600 to-green-600'
  },
  {
    id: 'dice',
    name: 'Dice Roller',
    category: 'Games',
    icon: '🎲',
    description: 'Roll random dice for board games or quick decision making.',
    path: '/dice',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'password-generator',
    name: 'Password Helper',
    category: 'Utilities',
    icon: '🔐',
    description: 'Generate secure customizable passwords with length slider and strength meter.',
    path: '/password-generator',
    color: 'from-teal-500 to-emerald-600'
  },
  {
    id: 'memory-game',
    name: 'Memory Game',
    category: 'Games',
    icon: '🎴',
    description: 'Flip cards and match emoji pairs to test your memory and reaction time.',
    path: '/memory-game',
    color: 'from-amber-500 to-rose-500'
  },
  {
    id: 'movies',
    name: 'Movies Directory',
    category: 'Entertainment',
    icon: '🎬',
    description: 'Explore popular movies, search titles, and view detailed cast & plot info.',
    path: '/movies',
    color: 'from-cyan-600 to-blue-600'
  },
  {
    id: 'series',
    name: 'Series Directory',
    category: 'Entertainment',
    icon: '📺',
    description: 'Discover trending TV series, seasons, IMDB ratings, and details.',
    path: '/series',
    color: 'from-purple-600 to-pink-600'
  }
];

const HomeDashboard: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Utilities', 'Calculators', 'Games', 'Entertainment'];

  const filteredTools = TOOLS.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4">
          Multi-Tool <span className="text-blue-600">Dashboard</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Access essential utilities, productivity tools, calculators, entertainment search, and interactive games in one place.
        </p>

        {/* Search & Filter Bar */}
        <div className="mt-8 max-w-2xl mx-auto flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-lg">
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tools by name or description..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 outline-none transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                ✖️
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-blue-200 shadow-md scale-105'
                  : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Tool Cards */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.map((tool) => (
            <Link
              key={tool.id}
              to={tool.path}
              className="group bg-white rounded-3xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between border border-gray-100 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-bl-full -z-0 group-hover:scale-110 transition-all" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${tool.color} flex justify-center items-center text-3xl shadow-md text-white`}
                  >
                    {tool.icon}
                  </div>
                  <span className="text-xs font-extrabold uppercase px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg">
                    {tool.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                  {tool.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {tool.description}
                </p>
              </div>

              <div className="relative z-10 flex items-center text-blue-600 font-bold text-sm group-hover:translate-x-1 transition-transform">
                Open Tool <span className="ml-1 text-base">➔</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100">
          <span className="text-5xl">🔎</span>
          <h3 className="text-xl font-bold text-gray-800 mt-4">No tools found</h3>
          <p className="text-gray-500 mt-1">Try searching with a different keyword or select another category.</p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl text-sm"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default HomeDashboard;
