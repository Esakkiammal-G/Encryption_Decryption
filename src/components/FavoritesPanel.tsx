import React from 'react';
import { Star, Trash2, Search } from 'lucide-react';
import Card from './Card';
import { useFavorites } from '../utils/storageUtils';

const FavoritesPanel: React.FC = () => {
  const { favorites, removeFromFavorites } = useFavorites();
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const filteredFavorites = favorites.filter(item =>
    item.text.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-4">
      <div className="flex items-center mb-6">
        <Star className="w-5 h-5 mr-2 text-yellow-500" />
        <h2 className="text-xl font-semibold">Favorites</h2>
      </div>
      
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search favorites..."
          className="pl-10 w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
        />
      </div>
      
      {filteredFavorites.length === 0 ? (
        <div className="text-center py-12">
          <Star className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            {favorites.length === 0 
              ? "No favorites yet" 
              : "No favorites match your search"}
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {filteredFavorites.map((item) => (
            <Card 
              key={item.id}
              className="p-4 hover:shadow-md transition-shadow duration-300 group relative"
            >
              <button
                onClick={() => removeFromFavorites(item.id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                aria-label="Remove from favorites"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium uppercase px-2 py-0.5 rounded-full ${
                    item.type === 'encrypt' 
                      ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300' 
                      : 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300'
                  }`}>
                    {item.type}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </div>
                
                <p className="text-sm dark:text-gray-300 break-all font-mono">
                  {item.text}
                </p>
                
                <div className="flex items-center">
                  <span className="text-xs font-mono py-0.5 px-1.5 bg-gray-100 dark:bg-gray-800 rounded dark:text-gray-300">
                    {item.algorithm.toUpperCase()}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPanel;