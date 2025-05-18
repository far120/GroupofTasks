import React, { useState } from 'react';

const AgeCalculator: React.FC = () => {
    const [birthDate, setBirthDate] = useState('');
    const [age, setAge] = useState<string | null>(null);
    const [error, setError] = useState('');

    const calculateAge = (dateString: string) => {
        const today = new Date();
        const birth = new Date(dateString);
        if (isNaN(birth.getTime())) return null;
        let years = today.getFullYear() - birth.getFullYear();
        let months = today.getMonth() - birth.getMonth();
        let days = today.getDate() - birth.getDate();
        if (days < 0) {
            months--;
            days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }
        return { years, months, days };
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!birthDate) {
            setError('Please enter your birth date.');
            setAge(null);
            return;
        }
        const result = calculateAge(birthDate);
        if (!result) {
            setError('Invalid date.');
            setAge(null);
            return;
        }
        setAge(`${result.years} years, ${result.months} months, ${result.days} days`);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-blue-400 p-4">
            <div className="bg-white/95 rounded-2xl shadow-2xl p-6 w-full max-w-md flex flex-col items-center">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">Age Calculator</h2>
                <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
                    <input
                        type="date"
                        className="border border-blue-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-blue-50"
                        value={birthDate}
                        onChange={e => setBirthDate(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                    />
                    <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition" type="submit">
                        Calculate Age
                    </button>
                </form>
                {error && <div className="text-red-500 font-medium mt-4">{error}</div>}
                {age && !error && (
                    <div className="mt-6 p-4 rounded-xl bg-blue-50 text-blue-900 text-xl font-bold shadow-inner">
                        Your age is: {age}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgeCalculator;
