import React, { useState } from 'react';

const CurrencyTranslator: React.FC = () => {
    const [amount, setAmount] = useState(1);
    const [from, setFrom] = useState('USD');
    const [to, setTo] = useState('EUR');
    const [result, setResult] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [customFrom, setCustomFrom] = useState('');
    const [customTo, setCustomTo] = useState('');

    const convert = async () => {
        setLoading(true);
        setError('');
        setResult(null);
        try {
            const fromCurrency = from === 'OTHER' ? customFrom : from;
            const toCurrency = to === 'OTHER' ? customTo : to;
            const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
            if (!res.ok) throw new Error('API error');
            const data = await res.json();
            const rate = data.rates[toCurrency];
            if (!rate) throw new Error('Currency not found');
            setResult(amount * rate);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen p-2 bg-gradient-to-br from-green-100 to-blue-100">
            <div className="w-full max-w-md bg-white/90 rounded-2xl shadow-xl p-4 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">💱</span>
                    <h2 className="text-2xl font-extrabold text-blue-700 tracking-tight">Currency Translator</h2>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mb-6">
                    <input
                        className="border border-blue-300 p-2 w-full sm:w-24 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-blue-50"
                        type="number"
                        value={amount}
                        onChange={e => setAmount(Number(e.target.value))}
                        placeholder="Amount"
                    />
                    <select
                        className="border border-blue-300 p-2 w-full sm:w-20 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-blue-50"
                        value={from}
                        onChange={e => setFrom(e.target.value)}
                        title="From Currency"
                    >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="JPY">JPY</option>
                        <option value="CNY">CNY</option>
                        <option value="OTHER">Other</option>
                    </select>
                    {from === 'OTHER' && (
                        <input
                            className="border border-blue-300 p-2 w-full sm:w-20 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-blue-50"
                            type="text"
                            value={customFrom}
                            onChange={e => setCustomFrom(e.target.value.toUpperCase())}
                            placeholder="Custom"
                        />
                    )}
                    <select
                        className="border border-blue-300 p-2 w-full sm:w-20 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-blue-50"
                        value={to}
                        onChange={e => setTo(e.target.value)}
                        title="To Currency"
                    >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="JPY">JPY</option>
                        <option value="CNY">CNY</option>
                        <option value="OTHER">Other</option>
                    </select>
                    {to === 'OTHER' && (
                        <input
                            className="border border-blue-300 p-2 w-full sm:w-20 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-blue-50"
                            type="text"
                            value={customTo}
                            onChange={e => setCustomTo(e.target.value.toUpperCase())}
                            placeholder="Custom"
                        />
                    )}
                    <button
                        className="bg-gradient-to-r from-green-500 to-green-700 text-white px-5 py-2 rounded-lg font-semibold shadow hover:from-green-600 hover:to-green-800 transition disabled:opacity-60 w-full sm:w-auto"
                        onClick={convert}
                        disabled={loading}
                    >
                        {loading ? <span className="animate-spin inline-block mr-2">⏳</span> : <span className="inline-block mr-2">💱</span>}
                        {loading ? '...' : 'Convert'}
                    </button>
                </div>
                {error && <div className="text-red-600 font-medium mb-4 flex items-center gap-2"><span>⚠️</span>{error}</div>}
                {result !== null && (
                    <div className="mt-6 p-6 rounded-xl bg-green-50 flex flex-col items-center shadow-inner">
                        <div className="text-2xl font-bold text-green-800 mb-2 flex items-center gap-2">
                            <span>💵</span>{amount} {from === 'OTHER' ? customFrom : from}
                        </div>
                        <div className="text-5xl font-extrabold text-green-600 mb-2 flex items-center gap-2">
                            <span>➡️</span>
                        </div>
                        <div className="text-2xl font-bold text-green-800 mb-2 flex items-center gap-2">
                            <span>💶</span>{result.toFixed(2)} {to === 'OTHER' ? customTo : to}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CurrencyTranslator;
