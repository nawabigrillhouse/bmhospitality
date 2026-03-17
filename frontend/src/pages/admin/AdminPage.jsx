import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import { Toaster } from '../../components/ui/sonner';

const AdminPage = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('bm_admin_token');
    if (saved) setToken(saved);
  }, []);

  const handleLogin = (t) => setToken(t);
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('bm_admin_token');
  };

  return (
    <>
      {token ? (
        <AdminDashboard token={token} onLogout={handleLogout} />
      ) : (
        <AdminLogin onLogin={handleLogin} />
      )}
      <Toaster position="top-right" />
    </>
  );
};

export default AdminPage;
