// Local storage utilities for search history
const SEARCH_HISTORY_KEY = 'biconomy_search_history';
const MAX_HISTORY_ITEMS = 10;

export interface HistoryItem {
  hash: string;
  timestamp: number;
  title?: string; // Optional title from hash details
}

export function getSearchHistory(): HistoryItem[] {
  try {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    // Ensure it's an array and has the right structure
    if (Array.isArray(parsed)) {
      return parsed.filter(item => 
        item && 
        typeof item.hash === 'string' && 
        typeof item.timestamp === 'number'
      );
    }
    return [];
  } catch (error) {
    console.warn('Failed to parse search history:', error);
    return [];
  }
}

export function addToSearchHistory(hash: string, title?: string): void {
  try {
    const history = getSearchHistory();
    
    // Remove existing entry if it exists
    const filtered = history.filter(item => item.hash !== hash);
    
    // Add new entry at the beginning
    const newItem: HistoryItem = {
      hash,
      timestamp: Date.now(),
      title
    };
    
    filtered.unshift(newItem);
    
    // Keep only the most recent items
    const trimmed = filtered.slice(0, MAX_HISTORY_ITEMS);
    
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.warn('Failed to save to search history:', error);
  }
}

export function removeFromSearchHistory(hash: string): void {
  try {
    const history = getSearchHistory();
    const filtered = history.filter(item => item.hash !== hash);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.warn('Failed to remove from search history:', error);
  }
}

export function clearSearchHistory(): void {
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (error) {
    console.warn('Failed to clear search history:', error);
  }
}