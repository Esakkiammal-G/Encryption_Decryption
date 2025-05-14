import React, { useState } from 'react';
import Card from './Card';
import EncryptionForm from './EncryptionForm';
import DecryptionForm from './DecryptionForm';
import FileEncryption from './FileEncryption';
import HistoryPanel from './HistoryPanel';
import SettingsPanel from './SettingsPanel';
import FavoritesPanel from './FavoritesPanel';
import { Shield, FileText, History, Star, Settings } from 'lucide-react';

type Tab = 'text' | 'file' | 'history' | 'favorites' | 'settings';

const EncryptionDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('text');
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="lg:col-span-2">
        <div className="flex flex-wrap justify-center mb-8 gap-2">
          <TabButton 
            active={activeTab === 'text'} 
            onClick={() => setActiveTab('text')}
            icon={<Shield className="w-5 h-5 mr-2" />}
            label="Text Encryption"
          />
          <TabButton 
            active={activeTab === 'file'} 
            onClick={() => setActiveTab('file')}
            icon={<FileText className="w-5 h-5 mr-2" />}
            label="File Encryption"
          />
          <TabButton 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')}
            icon={<History className="w-5 h-5 mr-2" />}
            label="History"
          />
          <TabButton 
            active={activeTab === 'favorites'} 
            onClick={() => setActiveTab('favorites')}
            icon={<Star className="w-5 h-5 mr-2" />}
            label="Favorites"
          />
          <TabButton 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')}
            icon={<Settings className="w-5 h-5 mr-2" />}
            label="Settings"
          />
        </div>
        
        <div className="transition-all duration-300">
          {activeTab === 'text' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <EncryptionForm />
              <DecryptionForm />
            </div>
          )}
          
          {activeTab === 'file' && <FileEncryption />}
          
          {activeTab === 'history' && <HistoryPanel />}
          
          {activeTab === 'favorites' && <FavoritesPanel />}
          
          {activeTab === 'settings' && <SettingsPanel />}
        </div>
      </Card>
    </div>
  );
};

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center py-2 px-4 rounded-full transition-all duration-200 ${
        active
          ? 'bg-purple-600 text-white shadow-lg'
          : 'bg-gray-200/50 dark:bg-gray-700/30 hover:bg-purple-200 dark:hover:bg-purple-800/40'
      }`}
    >
      {icon}
      {label}
    </button>
  );
};

export default EncryptionDashboard;