import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  name: string;
  path: string;
  icon: string;
}

interface NavCategory {
  title: string;
  icon: string;
  items: NavItem[];
}

const CATEGORIES: NavCategory[] = [
  {
    title: 'Utilities',
    icon: '🛠️',
    items: [
      { name: 'Weather App', path: '/weather', icon: '🌤️' },
      { name: 'Currency Converter', path: '/currency', icon: '💱' },
      { name: 'To-Do List', path: '/todo', icon: '📝' },
      { name: 'Pomodoro Timer', path: '/pomodoro', icon: '⏱️' },
      { name: 'World Time', path: '/worldtime', icon: '🌍' },
      { name: 'Password Helper', path: '/password-generator', icon: '🔐' },
    ],
  },
  {
    title: 'Calculators',
    icon: '🧮',
    items: [
      { name: 'GPA Calculator', path: '/gpa', icon: '🎓' },
      { name: 'Calculator', path: '/calculator', icon: '🔢' },
      { name: 'Age Calculator', path: '/age-calculator', icon: '🎂' },
    ],
  },
  {
    title: 'Games',
    icon: '🎮',
    items: [
      { name: 'Tic-Tac-Toe', path: '/tictactoe', icon: '❌⭕' },
      { name: 'Typing Test', path: '/typing-test', icon: '⌨️' },
      { name: 'Memory Game', path: '/memory-game', icon: '🎴' },
      { name: 'Guess Number', path: '/guess-number-score', icon: '🎯' },
      { name: 'Dice Roller', path: '/dice', icon: '🎲' },
    ],
  },
  {
    title: 'Entertainment',
    icon: '🎬',
    items: [
      { name: 'Movies Directory', path: '/movies', icon: '🎬' },
      { name: 'Series Directory', path: '/series', icon: '📺' },
    ],
  },
];

const Navbar: React.FC = () => {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleDropdown = (categoryTitle: string) => {
    setOpenDropdown((prev) => (prev === categoryTitle ? null : categoryTitle));
  };

  const isPathActive = (path: string) => location.pathname === path;

  const isCategoryActive = (category: NavCategory) =>
    category.items.some((item) => item.path === location.pathname);

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 shadow-xl" ref={navRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-white text-xl font-black tracking-tight hover:opacity-90 transition-opacity"
          >
            <span className="text-2xl p-1.5 bg-blue-600 rounded-xl shadow-md">🚀</span>
            <span>GroupofTasks</span>
          </Link>

          {/* Desktop Navigation Links & Dropdowns */}
          <nav className="hidden lg:flex items-center gap-2">
            {/* Home Link */}
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                isPathActive('/')
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              🏠 Home
            </Link>

            {/* Category Dropdowns */}
            {CATEGORIES.map((category) => {
              const active = isCategoryActive(category);
              const isOpen = openDropdown === category.title;

              return (
                <div key={category.title} className="relative">
                  <button
                    onClick={() => toggleDropdown(category.title)}
                    className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                      active || isOpen
                        ? 'bg-gray-800 text-blue-400 border border-gray-700'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span>{category.title}</span>
                    <span className="text-xs transition-transform duration-200 ml-0.5">
                      {isOpen ? '▲' : '▼'}
                    </span>
                  </button>

                  {/* Dropdown Menu Box */}
                  {isOpen && (
                    <div className="absolute left-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl py-2 z-50 animate-fade-in">
                      {category.items.map((item) => {
                        const itemActive = isPathActive(item.path);
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold transition-colors ${
                              itemActive
                                ? 'bg-blue-600 text-white font-bold'
                                : 'text-gray-200 hover:bg-gray-700 hover:text-white'
                            }`}
                          >
                            <span className="text-base">{item.icon}</span>
                            <span>{item.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2.5 rounded-xl bg-gray-800 text-gray-300 hover:text-white focus:outline-none"
            >
              <span className="text-xl">{mobileMenuOpen ? '✖️' : '☰'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-gray-900 border-t border-gray-800 px-4 pt-2 pb-6 space-y-4">
          <Link
            to="/"
            className={`block px-4 py-2.5 rounded-xl text-base font-bold transition-all ${
              isPathActive('/')
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            🏠 Home
          </Link>

          {CATEGORIES.map((category) => (
            <div key={category.title} className="space-y-1">
              <div className="text-xs font-black uppercase text-gray-500 tracking-wider px-4 pt-2 flex items-center gap-1.5">
                <span>{category.icon}</span>
                <span>{category.title}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {category.items.map((item) => {
                  const itemActive = isPathActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        itemActive
                          ? 'bg-blue-600 text-white font-bold'
                          : 'text-gray-300 hover:bg-gray-800'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
