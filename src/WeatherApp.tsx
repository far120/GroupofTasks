import React, { useState } from 'react';

const WeatherApp: React.FC = () => {
  const [city, setCity] = useState('London');
  const [customCity, setCustomCity] = useState('');
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    setLoading(true);
    setError('');
    setWeather(null);
    try {
      const apiKey = '429db96e1c50621f8b99ed591ce15c90'; // Replace with your OpenWeatherMap API key
      const cityName = city === 'OTHER' ? customCity : city;
      if (!cityName.trim()) throw new Error('Please enter a city name.');
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${apiKey}&units=metric`);
      if (!res.ok) {
        if (res.status === 404) throw new Error('City not found. Please check the name.');
        throw new Error('Failed to fetch weather.');
      }
      const data = await res.json();
      setWeather(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-2 bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="w-full max-w-md bg-white/90 rounded-2xl shadow-xl p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
          <span className="text-3xl">🌤️</span>
          <h2 className="text-2xl font-extrabold text-blue-700 tracking-tight">Weather App</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <select
            className="border border-blue-300 p-2 flex-1 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-blue-50"
            value={city}
            onChange={e => setCity(e.target.value)}
            title="City"
          >
            <option value="London">London</option>
            <option value="New York">New York</option>
            <option value="Tokyo">Tokyo</option>
            <option value="Paris">Paris</option>
            <option value="Cairo">Cairo</option>
            <option value="OTHER">Other</option>
          </select>
          {city === 'OTHER' && (
            <input
              className="border border-blue-300 p-2 flex-1 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-blue-50"
              type="text"
              value={customCity}
              onChange={e => setCustomCity(e.target.value)}
              placeholder="Enter city name"
              title="Custom City"
            />
          )}
          <button
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition disabled:opacity-60 w-full sm:w-auto"
            onClick={fetchWeather}
            disabled={loading}
          >
            {loading ? <span className="animate-spin inline-block mr-2">⏳</span> : <span className="inline-block mr-2">🔍</span>}
            {loading ? 'Loading...' : 'Get Weather'}
          </button>
        </div>
        {error && <div className="text-red-600 font-medium mb-4 flex items-center gap-2"><span>⚠️</span>{error}</div>}
        {weather && (
          <div className="mt-6 p-6 rounded-xl bg-blue-50 flex flex-col items-center shadow-inner">
            <div className="text-2xl font-bold text-blue-800 mb-2 flex items-center gap-2">
              <span>📍</span>{weather.name}, {weather.sys.country}
            </div>
            <div className="text-5xl font-extrabold text-blue-600 mb-2 flex items-center gap-2">
              <span>🌡️</span>{weather.main.temp}°C
            </div>
            <div className="text-lg font-semibold text-blue-700 flex items-center gap-2">
              <span>☁️</span>{weather.weather[0].main}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;
