import React, { useState } from 'react';
import { Clock, Trash2, Search, Lock, Unlock, X, Filter } from 'lucide-react';
import Card from './Card';
import { useHistory } from '../utils/historyUtils';
import { Heart } from 'lucide-react';
import { useFavorites } from '../utils/storageUtils'; 

const HistoryPanel: React.FC = () => {
 
  const { favorites, addToFavorites } = useFavorites();
  const isFavorited = (item: { text: string; type: string; algorithm: string; timestamp: string }) =>
    favorites.some(fav => fav.text === item.text && fav.type === item.type && fav.algorithm === item.algorithm);
  

  const { history, clearHistory, deleteItem } = useHistory();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'encrypt' | 'decrypt'>('all');
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  
  // Filter and search history
  const filteredHistory = history.filter(item => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesSearch = !searchTerm || 
      item.input.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.output.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesSearch;
  });
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    }).format(date);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center text-blue-600 dark:text-blue-400">
          <Clock className="w-5 h-5 mr-2" />
          <h2 className="text-xl font-semibold">History</h2>
        </div>
        
        <button
          onClick={() => setShowConfirmClear(true)}
          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200 flex items-center"
          disabled={history.length === 0}
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Clear All
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search history..."
            className="pl-10 w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center">
            <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'encrypt' | 'decrypt')}
              className="bg-transparent border-none focus:ring-0 text-sm font-medium text-gray-700 dark:text-gray-300 pr-6"
            >
              <option value="all">All</option>
              <option value="encrypt">Encrypt</option>
              <option value="decrypt">Decrypt</option>
            </select>
          </div>
        </div>
      </div>
      
      {filteredHistory.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            {history.length === 0 
              ? "Your history is empty" 
              : "No results found"}
          </p>
          {history.length !== 0 && searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {filteredHistory.map((item) => (
            <Card 
              key={item.id} 
              className="p-4 hover:shadow-md transition-shadow duration-300 border-l-4 group relative
                    dark:hover:bg-gray-800/60 hover:bg-white/70
                    ${item.type === 'encrypt' 
                      ? 'border-l-purple-500 dark:border-l-purple-400' 
                      : 'border-l-teal-500 dark:border-l-teal-400'}"
            >
             {/* Favorite Button */}
             <button 
                onClick={() => addToFavorites({
                  text: item.output, 
                  type: item.type, 
                  algorithm: item.algorithm,
                  timestamp: item.timestamp
                })}
                className="absolute bottom-2 right-2 text-red-500 hover:text-red-700 transition-opacity duration-200"
              >
               {isFavorited({ text: item.output, type: item.type, algorithm: item.algorithm, timestamp: item.timestamp }) 
  ? <Heart className="w-5 h-5 fill-current text-red-500" /> 
  : <Heart className="w-5 h-5 text-gray-400" />}

              </button>



              
              <div className="hidden group-hover:flex absolute top-2 right-2">
                <button
                  onClick={() => deleteItem(item.id)}
                  className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                  aria-label="Delete"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-start">
                <div className={`mt-0.5 p-1.5 rounded-full mr-3 ${
                  item.type === 'encrypt' 
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' 
                    : 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400'
                }`}>
                  {item.type === 'encrypt' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </div>
                
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <span className={`text-xs font-medium uppercase px-2 py-0.5 rounded-full ${
                      item.type === 'encrypt' 
                        ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300' 
                        : 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300'
                    }`}>
                      {item.type}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(item.timestamp)}
                    </span>
                  </div>
                  
                  <div className="mt-2 text-sm">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center">
                        <span className="min-w-20 text-gray-500 dark:text-gray-400 font-medium">Input:</span>
                        <span className="ml-2 overflow-hidden overflow-ellipsis dark:text-gray-300">{item.input}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="min-w-20 text-gray-500 dark:text-gray-400 font-medium">Output:</span>
                        <span className="ml-2 overflow-hidden overflow-ellipsis font-mono dark:text-gray-300">{item.output}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="min-w-20 text-gray-500 dark:text-gray-400 font-medium">Algorithm:</span>
                        <span className="ml-2 font-mono text-xs py-0.5 px-1.5 bg-gray-100 dark:bg-gray-800 rounded dark:text-gray-300">{item.algorithm.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {/* Confirmation Modal */}
      {showConfirmClear && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <Card className="w-full max-w-md mx-4">
            <div className="text-center">
              <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Clear History</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to clear all history? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className="flex-1 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    clearHistory();
                    setShowConfirmClear(false);
                  }}
                  className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
                >
                  Clear All
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;