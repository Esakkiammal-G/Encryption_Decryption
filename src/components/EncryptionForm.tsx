import React, { useState, useEffect } from 'react';
import { Lock, Copy, Check, AlertCircle } from 'lucide-react';
import { encrypt } from '../utils/encryptionUtils';
import { addToHistory } from '../utils/historyUtils';

const ALGORITHMS = [
  { id: 'aes', name: 'AES-256' },
  { id: 'des', name: 'DES' },
  { id: 'rabbit', name: 'Rabbit' },
];

const EncryptionForm: React.FC = () => {
  const [input, setInput] = useState('');
  const [password, setPassword] = useState('');
  const [algorithm, setAlgorithm] = useState('aes');
  const [encryptedText, setEncryptedText] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  
  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    // Length check
    if (password.length >= 8) strength += 25;
    // Contains number
    if (/\d/.test(password)) strength += 25;
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 25;
    // Contains uppercase or special char
    if (/[A-Z]/.test(password) || /[^A-Za-z0-9]/.test(password)) strength += 25;
    
    setPasswordStrength(strength);
  }, [password]);
  
  const handleEncrypt = () => {
    try {
      if (!input) {
        setError('Please enter text to encrypt');
        return;
      }
      
      if (!password) {
        setError('Please enter a password');
        return;
      }
      
      const encrypted = encrypt(input, password, algorithm);
      setEncryptedText(encrypted);
      setError('');
      
      // Add to history
      addToHistory({
        type: 'encrypt',
        timestamp: new Date().toISOString(),
        algorithm,
        input: input.substr(0, 15) + (input.length > 15 ? '...' : ''), // Truncate for privacy
        output: encrypted.substr(0, 15) + '...',
      });
    } catch (err) {
      setError('Encryption failed. Please try again.');
      console.error(err);
    }
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(encryptedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="transition-all duration-300">
      <div className="flex items-center mb-4 text-purple-600 dark:text-purple-400">
        <Lock className="w-5 h-5 mr-2" />
        <h2 className="text-xl font-semibold">Encrypt</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="encrypt-text" className="block text-sm font-medium mb-1 dark:text-gray-300">
            Text to Encrypt
          </label>
          <textarea
            id="encrypt-text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to encrypt..."
            className="w-full h-32 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label htmlFor="encrypt-password" className="block text-sm font-medium mb-1 dark:text-gray-300">
            Password
          </label>
          <input
            id="encrypt-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password..."
            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          
          {/* Password strength indicator */}
          {password && (
            <div className="mt-2">
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    passwordStrength <= 25 ? 'bg-red-500' :
                    passwordStrength <= 50 ? 'bg-orange-500' :
                    passwordStrength <= 75 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${passwordStrength}%` }}
                />
              </div>
              <p className="text-xs mt-1 dark:text-gray-400">
                {passwordStrength <= 25 ? 'Weak' :
                 passwordStrength <= 50 ? 'Fair' :
                 passwordStrength <= 75 ? 'Good' : 'Strong'} password
              </p>
            </div>
          )}
        </div>
        
        <div>
          <label htmlFor="algorithm" className="block text-sm font-medium mb-1 dark:text-gray-300">
            Algorithm
          </label>
          <select
            id="algorithm"
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {ALGORITHMS.map((algo) => (
              <option key={algo.id} value={algo.id}>
                {algo.name}
              </option>
            ))}
          </select>
        </div>
        
        {error && (
          <div className="flex items-center text-red-500 text-sm">
            <AlertCircle className="w-4 h-4 mr-1" />
            {error}
          </div>
        )}
        
        <button
          onClick={handleEncrypt}
          className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        >
          Encrypt
        </button>
        
        {encryptedText && (
          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium dark:text-gray-300">
                Encrypted Result
              </label>
              <button 
                onClick={handleCopy} 
                className="text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
                aria-label="Copy to clipboard"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="break-all text-sm font-mono dark:text-gray-300">
              {encryptedText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EncryptionForm;