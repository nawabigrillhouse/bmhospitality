import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('bm_admin_token', data.token);
        onLogin(data.token);
        toast.success('Logged in successfully!');
      } else {
        toast.error('Invalid password');
      }
    } catch {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="bg-teal-700 text-white text-center rounded-t-lg">
          <div className="flex justify-center mb-3">
            <div className="bg-white/20 p-4 rounded-full">
              <Lock className="w-8 h-8" />
            </div>
          </div>
          <CardTitle className="text-2xl">BM Hospitality Admin</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6" data-testid="admin-login-form">
            <div>
              <Label htmlFor="admin-password" className="text-base font-semibold">Admin Password</Label>
              <Input id="admin-password" type="password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password" className="mt-2 py-3" required
                data-testid="admin-password-input" />
            </div>
            <Button type="submit" disabled={loading} data-testid="admin-login-btn"
              className="w-full bg-teal-700 hover:bg-teal-800 text-white py-6 text-lg font-semibold">
              {loading ? 'Logging in...' : 'Login to Admin Panel'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
