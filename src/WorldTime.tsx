import React, { useState } from 'react';

const cities = [
  { name: 'London', timezone: 'Europe/London' },
  { name: 'New York', timezone: 'America/New_York' },
  { name: 'Tokyo', timezone: 'Asia/Tokyo' },
  { name: 'Paris', timezone: 'Europe/Paris' },
  { name: 'Cairo', timezone: 'Africa/Cairo' },
  { name: 'Sydney', timezone: 'Australia/Sydney' },
  { name: 'Moscow', timezone: 'Europe/Moscow' },
  { name: 'Dubai', timezone: 'Asia/Dubai' },
  { name: 'Rio de Janeiro', timezone: 'America/Sao_Paulo' },
  { name: 'Madrid', timezone: 'Europe/Madrid' },
  { name: 'Makkah', timezone: 'Asia/Riyadh' },
  { name: 'Buenos Aires', timezone: 'America/Argentina/Buenos_Aires' },

  
];

function getTimeInZone(timezone: string) {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: timezone,
  });
}

const WorldTime: React.FC = () => {
  const [now, setNow] = useState(Date.now());

  React.useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-400 p-6 flex flex-col items-center">
      <h2 className="text-4xl font-bold text-white mb-10 mt-6 tracking-wide drop-shadow-lg">🌍 World Time</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-6xl">
      {cities.map(city => (
        <div
        key={city.name}
        className="bg-white/90 rounded-xl shadow-lg p-6 flex flex-col items-center border border-blue-300 hover:shadow-2xl hover:bg-blue-50 transition-all duration-200"
        >
        <div className="text-lg font-semibold text-blue-800 mb-2">{city.name}</div>
        <div className="text-4xl font-mono text-blue-700 mb-1 tracking-widest">
          {getTimeInZone(city.timezone)}
        </div>
        <div className="text-xs text-gray-500">{city.timezone}</div>
        </div>
      ))}
      </div>
    </div>
  );
};

export default WorldTime;
