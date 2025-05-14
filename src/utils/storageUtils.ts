// Storage keys
const STORAGE_KEYS = {
  FAVORITES: 'cryptovault_favorites',
  SETTINGS: 'cryptovault_settings',
  RECENT: 'cryptovault_recent',
} as const;

export interface FavoriteItem {
  id: string;
  text: string;
  algorithm: string;
  type: 'encrypt' | 'decrypt';
  timestamp: string;
}

export interface Settings {
  defaultAlgorithm: string;
  autoSave: boolean;
  clearHistoryOnExit: boolean;
  maxHistoryItems: number;
}

export interface RecentItem {
  text: string;
  timestamp: string;
}

// Initialize default settings
const defaultSettings: Settings = {
  defaultAlgorithm: 'aes',
  autoSave: true,
  clearHistoryOnExit: false,
  maxHistoryItems: 50,
};

// Get favorites from storage
export function getFavorites(): FavoriteItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Add to favorites
export function addToFavorites(item: Omit<FavoriteItem, 'id'>): void {
  try {
    const favorites = getFavorites(); // Fetch existing favorites
    const newItem = { ...item, id: generateId() }; // Ensure ID is generated
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify([newItem, ...favorites]));
    window.dispatchEvent(new CustomEvent('favorites-updated')); // Trigger update
  } catch (error) {
    console.error('Error adding to favorites:', error);
  }
}


// Remove from favorites
export function removeFromFavorites(id: string): void {
  try {
    const favorites = getFavorites();
    const updated = favorites.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('favorites-updated'));
  } catch (error) {
    console.error('Error removing from favorites:', error);
  }
}

// Get settings
export function getSettings(): Settings {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

// Update settings
export function updateSettings(settings: Partial<Settings>): void {
  try {
    const currentSettings = getSettings();
    const newSettings = { ...currentSettings, ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
    window.dispatchEvent(new CustomEvent('settings-updated'));
  } catch (error) {
    console.error('Error updating settings:', error);
  }
}

// Get recent items
export function getRecentItems(): RecentItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RECENT);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Add recent item
export function addRecentItem(text: string): void {
  try {
    const items = getRecentItems();
    const newItem: RecentItem = {
      text,
      timestamp: new Date().toISOString(),
    };
    
    // Keep only unique items and limit to 10
    const updated = [newItem, ...items.filter(item => item.text !== text)].slice(0, 10);
    localStorage.setItem(STORAGE_KEYS.RECENT, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('recent-updated'));
  } catch (error) {
    console.error('Error adding recent item:', error);
  }
}

// Clear recent items
export function clearRecentItems(): void {
  localStorage.removeItem(STORAGE_KEYS.RECENT);
  window.dispatchEvent(new CustomEvent('recent-updated'));
}

// Generate unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Custom hooks
import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(getFavorites());
  
  useEffect(() => {
    const handleUpdate = () => setFavorites(getFavorites());
    window.addEventListener('favorites-updated', handleUpdate);
    return () => window.removeEventListener('favorites-updated', handleUpdate);
  }, []);
  
  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
  };
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(getSettings());
  
  useEffect(() => {
    const handleUpdate = () => setSettings(getSettings());
    window.addEventListener('settings-updated', handleUpdate);
    return () => window.removeEventListener('settings-updated', handleUpdate);
  }, []);
  
  return {
    settings,
    updateSettings,
  };
}

export function useRecentItems() {
  const [recentItems, setRecentItems] = useState<RecentItem[]>(getRecentItems());
  
  useEffect(() => {
    const handleUpdate = () => setRecentItems(getRecentItems());
    window.addEventListener('recent-updated', handleUpdate);
    return () => window.removeEventListener('recent-updated', handleUpdate);
  }, []);
  
  return {
    recentItems,
    addRecentItem,
    clearRecentItems,
  };
}