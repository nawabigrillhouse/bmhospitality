import { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const cache = {};

export function useContent(section, fallbackData = []) {
  const [items, setItems] = useState(cache[section] || []);
  const [loaded, setLoaded] = useState(!!cache[section]);

  useEffect(() => {
    if (cache[section]) {
      setItems(cache[section]);
      setLoaded(true);
      return;
    }
    let cancelled = false;
    fetch(`${API_URL}/api/content/${section}`)
      .then(res => res.ok ? res.json() : { items: [] })
      .then(data => {
        if (!cancelled) {
          const content = (data.items || []).map(item => ({ ...item.data, _contentId: item.id }));
          cache[section] = content;
          setItems(content);
          setLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => { cancelled = true; };
  }, [section]);

  // Return DB content if available, otherwise fallback to mock data
  const displayItems = items.length > 0 ? items : fallbackData;
  return { items: displayItems, loaded, isFromDB: items.length > 0 };
}

// Clear cache for a section (useful after admin edits)
export function clearContentCache(section) {
  if (section) {
    delete cache[section];
  } else {
    Object.keys(cache).forEach(k => delete cache[k]);
  }
}
