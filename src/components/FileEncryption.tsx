import React, { useState, useRef, useCallback } from 'react';
import { FileText, Lock, Unlock, Upload, Download, AlertCircle, Check } from 'lucide-react';
import Card from './Card';
import { encryptFile, decryptFile } from '../utils/encryptionUtils';
import { addToHistory } from '../utils/historyUtils';

const ALGORITHMS = [
  { id: 'aes', name: 'AES-256' },
  { id: 'des', name: 'DES' },
  { id: 'rabbit', name: 'Rabbit' },
];

const FileEncryption: React.FC = () => {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [algorithm, setAlgorithm] = useState('aes');
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFileName, setDownloadFileName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Calculate password strength
  React.useEffect(() => {
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
  
  // Clean up URLs when component unmounts
  React.useEffect(() => {
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
    setError('');
    setSuccess('');
    setDownloadUrl(null);
  };
  
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setError('');
      setSuccess('');
      setDownloadUrl(null);
    }
  }, []);
  
  const handleSelectFileClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleProcess = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }
    
    if (!password) {
      setError('Please enter a password');
      return;
    }
    
    setError('');
    setSuccess('');
    setIsProcessing(true);
    
    try {
      if (mode === 'encrypt') {
        const url = await encryptFile(file, password, algorithm);
        setDownloadUrl(url);
        setDownloadFileName(`${file.name}.encrypted`);
        setSuccess('File encrypted successfully');
        
        // Add to history
        addToHistory({
          type: 'encrypt',
          timestamp: new Date().toISOString(),
          algorithm,
          input: file.name,
          output: `${file.name}.encrypted`,
        });
      } else {
        const result = await decryptFile(file, password, algorithm);
        setDownloadUrl(result.url);
        setDownloadFileName(result.fileName);
        setSuccess('File decrypted successfully');
        
        // Add to history
        addToHistory({
          type: 'decrypt',
          timestamp: new Date().toISOString(),
          algorithm,
          input: file.name,
          output: result.fileName,
        });
      }
    } catch (err) {
      setError(mode === 'encrypt' 
        ? 'Failed to encrypt file. Please try again.' 
        : 'Failed to decrypt file. Check your password and try again.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <Card className="transition-all duration-300">
        <div className="flex items-center mb-6 space-x-6">
          <button
            onClick={() => {
              setMode('encrypt');
              setError('');
              setSuccess('');
              setDownloadUrl(null);
            }}
            className={`flex items-center py-2 px-4 rounded-full transition-all duration-300 ${
              mode === 'encrypt'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                : 'bg-gray-200/50 dark:bg-gray-700/30 hover:bg-purple-200 dark:hover:bg-purple-800/40'
            }`}
          >
            <Lock className="w-5 h-5 mr-2" />
            Encrypt
          </button>
          
          <button
            onClick={() => {
              setMode('decrypt');
              setError('');
              setSuccess('');
              setDownloadUrl(null);
            }}
            className={`flex items-center py-2 px-4 rounded-full transition-all duration-300 ${
              mode === 'decrypt'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20'
                : 'bg-gray-200/50 dark:bg-gray-700/30 hover:bg-teal-200 dark:hover:bg-teal-800/40'
            }`}
          >
            <Unlock className="w-5 h-5 mr-2" />
            Decrypt
          </button>
        </div>
        
        <div 
          className={`border-2 border-dashed rounded-xl p-6 transition-all duration-300 relative overflow-hidden
            ${isDragging 
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
              : 'border-gray-300 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-600'}
            ${file ? 'bg-gray-50 dark:bg-gray-800/40' : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          
          <div className="flex flex-col items-center justify-center py-8">
            <div className={`p-3 rounded-full mb-4 transition-all duration-300 
              ${mode === 'encrypt' 
                ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400' 
                : 'bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400'}`}
            >
              {file ? (
                <FileText className="w-8 h-8" />
              ) : (
                <Upload className="w-8 h-8" />
              )}
            </div>
            
            {file ? (
              <div className="text-center">
                <p className="font-medium text-gray-900 dark:text-white mb-1">
                  {file.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
                <button 
                  onClick={handleSelectFileClick}
                  className="mt-4 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
                >
                  Change file
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="font-medium text-gray-900 dark:text-white mb-1">
                  Drag & Drop your file here
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  or
                </p>
                <button 
                  onClick={handleSelectFileClick}
                  className={`py-2 px-4 rounded-lg transition-colors duration-300 text-white ${
                    mode === 'encrypt' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-teal-600 hover:bg-teal-700'
                  }`}
                >
                  Browse files
                </button>
              </div>
            )}
          </div>
        </div>
      </Card>
      
      <Card className="transition-all duration-300">
        <div className="space-y-4">
          <div>
            <label htmlFor="file-password" className="block text-sm font-medium mb-1 dark:text-gray-300">
              Password
            </label>
            <input
              id="file-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              className={`w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border focus:ring-2 focus:border-transparent transition-all duration-300 ${
                mode === 'encrypt' 
                  ? 'border-gray-300 dark:border-gray-700 focus:ring-purple-500' 
                  : 'border-gray-300 dark:border-gray-700 focus:ring-teal-500'
              }`}
            />
            
            {/* Password strength indicator */}
            {mode === 'encrypt' && password && (
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
            <label htmlFor="file-algorithm" className="block text-sm font-medium mb-1 dark:text-gray-300">
              Algorithm
            </label>
            <select
              id="file-algorithm"
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border focus:ring-2 focus:border-transparent transition-all duration-300 ${
                mode === 'encrypt' 
                  ? 'border-gray-300 dark:border-gray-700 focus:ring-purple-500' 
                  : 'border-gray-300 dark:border-gray-700 focus:ring-teal-500'
              }`}
            >
              {ALGORITHMS.map((algo) => (
                <option key={algo.id} value={algo.id}>
                  {algo.name}
                </option>
              ))}
            </select>
          </div>
          
          {error && (
            <div className="flex items-center text-red-500 text-sm p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="flex items-center text-green-500 text-sm p-2 bg-green-50 dark:bg-green-900/20 rounded-lg animate-fadeIn">
              <Check className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}
          
          <button
            onClick={handleProcess}
            disabled={isProcessing || !file || !password}
            className={`w-full py-2 px-4 text-white rounded-lg transition-all duration-300 relative overflow-hidden ${
              mode === 'encrypt'
                ? 'bg-purple-600 hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50'
                : 'bg-teal-600 hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50'
            } ${(isProcessing || !file || !password) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <span>
                {mode === 'encrypt' ? 'Encrypt File' : 'Decrypt File'}
              </span>
            )}
          </button>
          
          {downloadUrl && (
            <a
              href={downloadUrl}
              download={downloadFileName}
              className={`w-full py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center border ${
                mode === 'encrypt'
                  ? 'text-purple-600 border-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-400 dark:hover:bg-purple-900/20'
                  : 'text-teal-600 border-teal-600 hover:bg-teal-50 dark:text-teal-400 dark:border-teal-400 dark:hover:bg-teal-900/20'
              }`}
            >
              <Download className="w-4 h-4 mr-2" />
              Download {mode === 'encrypt' ? 'Encrypted' : 'Decrypted'} File
            </a>
          )}
        </div>
      </Card>
    </div>
  );
};

export default FileEncryption;