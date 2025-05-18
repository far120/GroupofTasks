import React, { useState } from 'react';

const buttons = [
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+'],
    ['C']
];

const Calculator: React.FC = () => {
    const [input, setInput] = useState('');
    const [result, setResult] = useState('');

    const handleClick = (value: string) => {
        if (value === 'C') {
            setInput('');
            setResult('');
        } else if (value === '=') {
            try {
                // eslint-disable-next-line no-eval
                const evalResult = eval(input);
                setResult(evalResult.toString());
            } catch {
                setResult('Error');
            }
        } else {
            setInput(input + value);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-blue-400 p-4">
            <div className="bg-white/95 rounded-2xl shadow-2xl p-6 w-full max-w-xs flex flex-col items-center">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">Calculator</h2>
                <div className="w-full bg-blue-50 rounded-lg p-2 mb-2 text-right font-mono text-xl text-blue-900 min-h-[2.5rem]">{input || '0'}</div>
                <div className="w-full bg-blue-100 rounded-lg p-2 mb-4 text-right font-mono text-2xl text-blue-700 min-h-[2.5rem]">{result}</div>
                <div className="grid grid-cols-4 gap-2 w-full">
                    {buttons.flat().map((btn, i) => (
                        <button
                            key={i}
                            className={`py-3 rounded-lg font-bold text-lg shadow ${btn === '=' ? 'bg-blue-600 text-white' : btn === 'C' ? 'bg-red-400 text-white' : 'bg-blue-200 text-blue-900'} hover:scale-105 transition`}
                            onClick={() => handleClick(btn)}
                        >
                            {btn}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Calculator;
