import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const INSTAGRAM_URL = 'https://www.instagram.com/bm_hospitality?igsh=MTZ4Z280NnVvbmVlYw==';

const InstagramFloat = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const wasDismissed = sessionStorage.getItem('bm_insta_dismissed');
    if (wasDismissed) {
      setDismissed(true);
      return;
    }
    const timer = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setVisible(false);
    setDismissed(true);
    sessionStorage.setItem('bm_insta_dismissed', 'true');
  };

  const handleClick = () => {
    window.open(INSTAGRAM_URL, '_blank', 'noopener,noreferrer');
  };

  if (dismissed || !visible) return null;

  return (
    <div className="fixed bottom-28 left-5 z-50 animate-float-in" data-testid="instagram-float-popup">
      <div
        onClick={handleClick}
        className="relative bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-xl shadow-xl p-2.5 pr-8 flex items-center space-x-2 cursor-pointer hover:scale-105 transition-transform duration-300 max-w-[220px]"
        role="button"
        tabIndex={0}
      >
        <button onClick={handleDismiss}
          className="absolute top-1.5 right-1.5 text-white/70 hover:text-white transition-colors z-10"
          data-testid="instagram-float-close">
          <X className="w-3.5 h-3.5" />
        </button>
        <div className="bg-white rounded-full p-1.5 flex-shrink-0">
          <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </div>
        <div className="text-white">
          <p className="font-bold text-xs leading-tight">Follow Us!</p>
          <p className="text-[10px] text-white/80">@BM_Hospitality</p>
        </div>
      </div>
    </div>
  );
};

export default InstagramFloat;
