import React, { useState } from 'react';
import { Unlock, Copy, Check, AlertCircle } from 'lucide-react';
import { decrypt } from '../utils/encryptionUtils';
import { addToHistory } from '../utils/historyUtils';

const ALGORITHMS = [
  { id: 'aes', name: 'AES-256' },
  { id: 'des', name: 'DES' },
  { id: 'rabbit', name: 'Rabbit' },
];

const DecryptionForm: React.FC = () => {
  const [input, setInput] = useState('');
  const [password, setPassword] = useState('');
  const [algorithm, setAlgorithm] = useState('aes');
  const [decryptedText, setDecryptedText] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  
  const handleDecrypt = () => {
    try {
      if (!input) {
        setError('Please enter text to decrypt');
        return;
      }
      
      if (!password) {
        setError('Please enter a password');
        return;
      }
      
      const decrypted = decrypt(input, password, algorithm);
      setDecryptedText(decrypted);
      setError('');
      
      // Add to history
      addToHistory({
        type: 'decrypt',
        timestamp: new Date().toISOString(),
        algorithm,
        input: input.substr(0, 15) + '...',
        output: decrypted.substr(0, 15) + (decrypted.length > 15 ? '...' : ''),
      });
    } catch (err) {
      setError('Decryption failed. Check your password and try again.');
      console.error(err);
    }
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(decryptedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="transition-all duration-300">
      <div className="flex items-center mb-4 text-teal-600 dark:text-teal-400">
        <Unlock className="w-5 h-5 mr-2" />
        <h2 className="text-xl font-semibold">Decrypt</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="decrypt-text" className="block text-sm font-medium mb-1 dark:text-gray-300">
            Text to Decrypt
          </label>
          <textarea
            id="decrypt-text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter encrypted text..."
            className="w-full h-32 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label htmlFor="decrypt-password" className="block text-sm font-medium mb-1 dark:text-gray-300">
            Password
          </label>
          <input
            id="decrypt-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password..."
            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label htmlFor="decrypt-algorithm" className="block text-sm font-medium mb-1 dark:text-gray-300">
            Algorithm
          </label>
          <select
            id="decrypt-algorithm"
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
          onClick={handleDecrypt}
          className="w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
        >
          Decrypt
        </button>
        
        {decryptedText && (
          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium dark:text-gray-300">
                Decrypted Result
              </label>
              <button 
                onClick={handleCopy} 
                className="text-gray-500 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400"
                aria-label="Copy to clipboard"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="break-words text-sm dark:text-gray-300">
              {decryptedText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DecryptionForm;