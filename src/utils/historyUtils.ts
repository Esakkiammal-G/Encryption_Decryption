import { useState, useEffect } from 'react';

export interface HistoryItem {
  id: string;
  type: 'encrypt' | 'decrypt';
  timestamp: string;
  algorithm: string;
  input: string;
  output: string;
}

const HISTORY_STORAGE_KEY = 'cryptovault_history';

// Get history from localStorage
export function getHistory(): HistoryItem[] {
  try {
    const historyData = localStorage.getItem(HISTORY_STORAGE_KEY);
    return historyData ? JSON.parse(historyData) : [];
  } catch (error) {
    console.error('Error retrieving history:', error);
    return [];
  }
}

// Add new item to history
export function addToHistory(item: Omit<HistoryItem, 'id'>): void {
  try {
    const history = getHistory();
    const newItem: HistoryItem = {
      ...item,
      id: generateId(),
    };
    
    // Keep only the latest 50 items
    const updatedHistory = [newItem, ...history].slice(0, 50);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
    
    // Dispatch a custom event to notify components
    window.dispatchEvent(new CustomEvent('history-updated'));
  } catch (error) {
    console.error('Error adding to history:', error);
  }
}

// Clear all history
export function clearHistory(): void {
  localStorage.removeItem(HISTORY_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('history-updated'));
}

// Delete a specific history item
export function deleteHistoryItem(id: string): void {
  try {
    const history = getHistory();
    const updatedHistory = history.filter(item => item.id !== id);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
    window.dispatchEvent(new CustomEvent('history-updated'));
  } catch (error) {
    console.error('Error deleting history item:', error);
  }
}

// Hook for components to use history with auto-refresh
export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>(getHistory());
  
  useEffect(() => {
    // Update history when storage changes
    const handleStorageChange = () => {
      setHistory(getHistory());
    };
    
    // Listen for custom event
    window.addEventListener('history-updated', handleStorageChange);
    
    return () => {
      window.removeEventListener('history-updated', handleStorageChange);
    };
  }, []);
  
  return {
    history,
    clearHistory,
    deleteItem: deleteHistoryItem
  };
}

// Generate a unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}