import React, { useState, useEffect, useCallback } from 'react';

type Mode = 'generate' | 'check';

const PasswordGenerator: React.FC = () => {
  const [mode, setMode] = useState<Mode>('generate');

  // Generator Mode State
  const [password, setPassword] = useState<string>('');
  const [length, setLength] = useState<number>(14);
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Manual Checker Mode State
  const [manualPassword, setManualPassword] = useState<string>('');
  const [showManualPassword, setShowManualPassword] = useState<boolean>(false);

  // Auto Generator Logic
  const generatePassword = useCallback(() => {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let validChars = '';
    if (includeUppercase) validChars += uppercaseChars;
    if (includeLowercase) validChars += lowercaseChars;
    if (includeNumbers) validChars += numberChars;
    if (includeSymbols) validChars += symbolChars;

    if (!validChars) {
      setPassword('');
      return;
    }

    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * validChars.length);
      result += validChars[randomIndex];
    }
    setPassword(result);
    setCopied(false);
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  useEffect(() => {
    if (mode === 'generate') {
      generatePassword();
    }
  }, [generatePassword, mode]);

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate Password Strength for any string input
  const evaluatePasswordStrength = (pass: string) => {
    if (!pass) {
      return {
        label: 'None',
        color: 'bg-gray-200',
        text: 'text-gray-400',
        width: '0%',
        score: 0,
        hasUpper: false,
        hasLower: false,
        hasNumber: false,
        hasSymbol: false,
        tip: 'Enter a password to test its security strength.',
      };
    }

    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSymbol = /[^A-Za-z0-9]/.test(pass);

    let score = 0;
    if (pass.length >= 8) score += 1;
    if (pass.length >= 12) score += 1;
    if (pass.length >= 16) score += 1;
    if (hasUpper) score += 1;
    if (hasLower) score += 1;
    if (hasNumber) score += 1;
    if (hasSymbol) score += 1;

    let tip = 'Good job! This password is very strong.';
    if (!hasSymbol) tip = 'Tip: Add special characters (!@#$) to boost protection.';
    else if (!hasNumber) tip = 'Tip: Include numbers (0-9) for extra complexity.';
    else if (!hasUpper) tip = 'Tip: Mix in uppercase letters (A-Z).';
    else if (pass.length < 10) tip = 'Tip: Increase length to 12+ characters.';

    if (score <= 3) {
      return {
        label: 'Weak 🔴',
        color: 'bg-red-500',
        text: 'text-red-600',
        width: '25%',
        score,
        hasUpper,
        hasLower,
        hasNumber,
        hasSymbol,
        tip: 'Warning: This password is easy to guess or crack.',
      };
    }
    if (score <= 5) {
      return {
        label: 'Fair 🟠',
        color: 'bg-amber-500',
        text: 'text-amber-600',
        width: '50%',
        score,
        hasUpper,
        hasLower,
        hasNumber,
        hasSymbol,
        tip,
      };
    }
    if (score <= 6) {
      return {
        label: 'Strong 🟢',
        color: 'bg-emerald-500',
        text: 'text-emerald-600',
        width: '75%',
        score,
        hasUpper,
        hasLower,
        hasNumber,
        hasSymbol,
        tip,
      };
    }
    return {
      label: 'Unbreakable 🛡️',
      color: 'bg-indigo-600',
      text: 'text-indigo-600',
      width: '100%',
      score,
      hasUpper,
      hasLower,
      hasNumber,
      hasSymbol,
      tip: 'Outstanding! Maximum security password.',
    };
  };

  const currentStrength = evaluatePasswordStrength(
    mode === 'generate' ? password : manualPassword
  );

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gradient-to-br from-teal-100 via-emerald-100 to-cyan-200">
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col items-center">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl">🔐</span>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Password Helper</h1>
        </div>

        {/* Mode Selector Tabs */}
        <div className="w-full flex bg-gray-100 p-1.5 rounded-2xl mb-6 font-bold text-sm">
          <button
            onClick={() => setMode('generate')}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              mode === 'generate'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ⚡ Generator Mode
          </button>
          <button
            onClick={() => setMode('check')}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              mode === 'check'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🔍 Manual Strength Checker
          </button>
        </div>

        {/* TAB 1: AUTO GENERATOR MODE */}
        {mode === 'generate' && (
          <div className="w-full">
            {/* Output Box */}
            <div className="w-full bg-gray-900 text-white rounded-2xl p-4 mb-6 flex items-center justify-between shadow-inner relative overflow-hidden">
              <div className="font-mono text-lg sm:text-xl font-bold tracking-wider truncate pr-2">
                {password || <span className="text-gray-500 text-base italic">Select character options</span>}
              </div>
              <button
                onClick={() => copyToClipboard(password)}
                disabled={!password}
                className={`px-4 py-2 rounded-xl text-sm font-extrabold transition-all shadow-md active:scale-95 flex items-center gap-1 shrink-0 ${
                  copied
                    ? 'bg-emerald-500 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {copied ? '✓ Copied' : '📋 Copy'}
              </button>
            </div>

            {/* Customization Options */}
            <div className="w-full space-y-5 bg-gray-50 p-5 rounded-2xl border border-gray-200 mb-6">
              {/* Length Slider */}
              <div>
                <div className="flex justify-between items-center text-sm font-bold text-gray-700 mb-2">
                  <span>Password Length:</span>
                  <span className="text-teal-600 text-base font-extrabold px-2 py-0.5 bg-teal-100 rounded-lg">
                    {length}
                  </span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="32"
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
              </div>

              {/* Checkboxes */}
              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-3 cursor-pointer text-sm font-bold text-gray-700 select-none">
                  <input
                    type="checkbox"
                    checked={includeUppercase}
                    onChange={(e) => setIncludeUppercase(e.target.checked)}
                    className="w-5 h-5 accent-teal-600 rounded cursor-pointer"
                  />
                  <span>Include Uppercase Letters (A-Z)</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer text-sm font-bold text-gray-700 select-none">
                  <input
                    type="checkbox"
                    checked={includeLowercase}
                    onChange={(e) => setIncludeLowercase(e.target.checked)}
                    className="w-5 h-5 accent-teal-600 rounded cursor-pointer"
                  />
                  <span>Include Lowercase Letters (a-z)</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer text-sm font-bold text-gray-700 select-none">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                    className="w-5 h-5 accent-teal-600 rounded cursor-pointer"
                  />
                  <span>Include Numbers (0-9)</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer text-sm font-bold text-gray-700 select-none">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                    className="w-5 h-5 accent-teal-600 rounded cursor-pointer"
                  />
                  <span>Include Special Symbols (!@#$)</span>
                </label>
              </div>
            </div>

            <button
              onClick={generatePassword}
              className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-2xl shadow-lg hover:shadow-teal-200 transition-all active:scale-95 flex justify-center items-center gap-2 text-base mb-6"
            >
              ⚡ Generate New Password
            </button>
          </div>
        )}

        {/* TAB 2: MANUAL STRENGTH CHECKER MODE */}
        {mode === 'check' && (
          <div className="w-full">
            <div className="mb-6">
              <label className="block text-sm font-extrabold text-gray-700 mb-2">
                Type or Paste Your Custom Password:
              </label>
              <div className="relative flex items-center">
                <input
                  type={showManualPassword ? 'text' : 'password'}
                  value={manualPassword}
                  onChange={(e) => setManualPassword(e.target.value)}
                  placeholder="Enter any password to test..."
                  className="w-full pl-4 pr-12 py-3 bg-gray-50 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-mono text-lg text-gray-900 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowManualPassword((prev) => !prev)}
                  className="absolute right-3 text-xl text-gray-500 hover:text-gray-700"
                  title={showManualPassword ? 'Hide password' : 'Show password'}
                >
                  {showManualPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Detailed Criteria Analysis Cards */}
            {manualPassword && (
              <div className="grid grid-cols-2 gap-2.5 mb-6 text-xs font-bold">
                <div
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    manualPassword.length >= 12
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-amber-50 border-amber-300 text-amber-800'
                  }`}
                >
                  <span>Length ({manualPassword.length} chars)</span>
                  <span>{manualPassword.length >= 12 ? '✓' : '⚠️'}</span>
                </div>

                <div
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    currentStrength.hasUpper
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-gray-100 border-gray-300 text-gray-500'
                  }`}
                >
                  <span>Uppercase (A-Z)</span>
                  <span>{currentStrength.hasUpper ? '✓' : '✗'}</span>
                </div>

                <div
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    currentStrength.hasLower
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-gray-100 border-gray-300 text-gray-500'
                  }`}
                >
                  <span>Lowercase (a-z)</span>
                  <span>{currentStrength.hasLower ? '✓' : '✗'}</span>
                </div>

                <div
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    currentStrength.hasNumber
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-gray-100 border-gray-300 text-gray-500'
                  }`}
                >
                  <span>Numbers (0-9)</span>
                  <span>{currentStrength.hasNumber ? '✓' : '✗'}</span>
                </div>

                <div
                  className={`p-3 rounded-xl border flex items-center justify-between col-span-2 ${
                    currentStrength.hasSymbol
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-gray-100 border-gray-300 text-gray-500'
                  }`}
                >
                  <span>Special Symbols (!@#$)</span>
                  <span>{currentStrength.hasSymbol ? '✓' : '✗'}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Strength Meter Bar (Applies to both modes) */}
        <div className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-200">
          <div className="flex justify-between items-center text-xs font-extrabold text-gray-600 mb-1.5">
            <span>Security Rating:</span>
            <span className={currentStrength.text}>{currentStrength.label}</span>
          </div>
          <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full transition-all duration-300 ${currentStrength.color}`}
              style={{ width: currentStrength.width }}
            />
          </div>
          <p className="text-xs text-gray-600 italic font-medium">{currentStrength.tip}</p>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;
