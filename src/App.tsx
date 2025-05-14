import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './layouts/MainLayout';
import EncryptionDashboard from './components/EncryptionDashboard';

function App() {
  return (
    <ThemeProvider>
      <MainLayout>
        <EncryptionDashboard />
      </MainLayout>
    </ThemeProvider>
  );
}

export default App;