import { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const cache = {};

export function useAdminImages(section) {
  const [images, setImages] = useState(cache[section] || []);
  const [loaded, setLoaded] = useState(!!cache[section]);

  useEffect(() => {
    if (cache[section]) {
      setImages(cache[section]);
      setLoaded(true);
      return;
    }
    let cancelled = false;
    fetch(`${API_URL}/api/images/${section}`)
      .then(res => res.ok ? res.json() : { images: [] })
      .then(data => {
        if (!cancelled) {
          const imgs = (data.images || []).map(img => ({
            ...img,
            url: `${API_URL}/api/files/${img.storage_path}`
          }));
          cache[section] = imgs;
          setImages(imgs);
          setLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => { cancelled = true; };
  }, [section]);

  return { images, loaded };
}

export function getAdminImage(adminImages, itemId, fallbackUrl) {
  if (!adminImages || adminImages.length === 0) return fallbackUrl;
  const match = adminImages.find(img => img.item_id === itemId);
  if (match) return match.url;
  return fallbackUrl;
}

export function getAdminImageByIndex(adminImages, index, fallbackUrl) {
  if (!adminImages || adminImages.length === 0) return fallbackUrl;
  if (index < adminImages.length) return adminImages[index].url;
  return fallbackUrl;
}
