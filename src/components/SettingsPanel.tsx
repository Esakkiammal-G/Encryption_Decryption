import React from 'react';
import { Settings, Sliders } from 'lucide-react';
import Card from './Card';
import { useSettings } from '../utils/storageUtils';

const SettingsPanel: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  
  return (
    <div className="space-y-4">
      <div className="flex items-center mb-6">
        <Sliders className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-semibold">Settings</h2>
      </div>
      
      <Card>
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-1 block dark:text-gray-300">
              Default Algorithm
            </label>
            <select
              value={settings.defaultAlgorithm}
              onChange={(e) => updateSettings({ defaultAlgorithm: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="aes">AES-256</option>
              <option value="des">DES</option>
              <option value="rabbit">Rabbit</option>
            </select>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium dark:text-gray-300">
                Auto-save history
              </label>
              <button
                onClick={() => updateSettings({ autoSave: !settings.autoSave })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  settings.autoSave ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    settings.autoSave ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium dark:text-gray-300">
                Clear history on exit
              </label>
              <button
                onClick={() => updateSettings({ clearHistoryOnExit: !settings.clearHistoryOnExit })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  settings.clearHistoryOnExit ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    settings.clearHistoryOnExit ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block dark:text-gray-300">
              Maximum history items
            </label>
            <input
              type="number"
              min="10"
              max="100"
              value={settings.maxHistoryItems}
              onChange={(e) => updateSettings({ maxHistoryItems: parseInt(e.target.value, 10) })}
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPanel;