import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { LayoutDashboard, Image, MessageSquare, Users, LogOut, ChevronRight, FileText } from 'lucide-react';
import { toast } from 'sonner';
import AdminImages from './AdminImages';
import AdminInquiries from './AdminInquiries';
import AdminContent from './AdminContent';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const AdminDashboard = ({ token, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setStats(await res.json());
      } else if (res.status === 401) {
        onLogout();
      }
    } catch {
      toast.error('Failed to fetch stats');
    }
  }, [token, onLogout]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const handleLogout = () => {
    localStorage.removeItem('bm_admin_token');
    onLogout();
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'images', label: 'Image Manager', icon: Image },
    { id: 'content', label: 'Content Manager', icon: FileText },
    { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
    { id: 'subscriptions', label: 'Subscriptions', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex" data-testid="admin-dashboard">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col min-h-screen fixed">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold">BM Hospitality</h1>
          <p className="text-gray-400 text-sm mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 py-4">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                activeTab === item.id ? 'bg-teal-700 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`} data-testid={`admin-nav-${item.id}`}>
              <item.icon className="w-5 h-5 mr-3" />
              <span>{item.label}</span>
              {activeTab === item.id && <ChevronRight className="w-4 h-4 ml-auto" />}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <Button onClick={handleLogout} variant="outline" data-testid="admin-logout-btn"
            className="w-full bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Dashboard Overview</h2>
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-6">
                    <p className="text-sm text-blue-600 font-semibold">Total Inquiries</p>
                    <p className="text-4xl font-bold text-blue-700 mt-2">{stats.total_inquiries}</p>
                  </CardContent>
                </Card>
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="pt-6">
                    <p className="text-sm text-green-600 font-semibold">Subscriptions</p>
                    <p className="text-4xl font-bold text-green-700 mt-2">{stats.total_subscriptions}</p>
                  </CardContent>
                </Card>
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="pt-6">
                    <p className="text-sm text-purple-600 font-semibold">Uploaded Images</p>
                    <p className="text-4xl font-bold text-purple-700 mt-2">{stats.total_images}</p>
                  </CardContent>
                </Card>
                <Card className="bg-amber-50 border-amber-200">
                  <CardContent className="pt-6">
                    <p className="text-sm text-amber-600 font-semibold">Flight Inquiries</p>
                    <p className="text-4xl font-bold text-amber-700 mt-2">{stats.by_type?.flight || 0}</p>
                  </CardContent>
                </Card>
                <Card className="bg-teal-50 border-teal-200">
                  <CardContent className="pt-6">
                    <p className="text-sm text-teal-600 font-semibold">Content Items</p>
                    <p className="text-4xl font-bold text-teal-700 mt-2">{stats.total_content || 0}</p>
                  </CardContent>
                </Card>
              </div>
            )}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader><CardTitle className="text-lg">Inquiry Breakdown</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between"><span>Flight Inquiries</span><span className="font-bold">{stats.by_type?.flight || 0}</span></div>
                      <div className="flex justify-between"><span>Hotel Inquiries</span><span className="font-bold">{stats.by_type?.hotel || 0}</span></div>
                      <div className="flex justify-between"><span>Package Inquiries</span><span className="font-bold">{stats.by_type?.package || 0}</span></div>
                      <div className="flex justify-between"><span>Contact Messages</span><span className="font-bold">{stats.by_type?.contact || 0}</span></div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="text-lg">Quick Actions</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <Button onClick={() => setActiveTab('images')} className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                      <Image className="w-4 h-4 mr-2" /> Manage Images
                    </Button>
                    <Button onClick={() => setActiveTab('content')} className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                      <FileText className="w-4 h-4 mr-2" /> Manage Content
                    </Button>
                    <Button onClick={() => setActiveTab('inquiries')} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      <MessageSquare className="w-4 h-4 mr-2" /> View Inquiries
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="text-lg">Website Sections</CardTitle></CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">Upload and manage images for:</p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center"><ChevronRight className="w-4 h-4 mr-1 text-teal-600" /> Hero Banner</li>
                      <li className="flex items-center"><ChevronRight className="w-4 h-4 mr-1 text-teal-600" /> Domestic Packages</li>
                      <li className="flex items-center"><ChevronRight className="w-4 h-4 mr-1 text-teal-600" /> International Packages</li>
                      <li className="flex items-center"><ChevronRight className="w-4 h-4 mr-1 text-teal-600" /> Goa Hotels & Resorts</li>
                      <li className="flex items-center"><ChevronRight className="w-4 h-4 mr-1 text-teal-600" /> Bohra Stays</li>
                      <li className="flex items-center"><ChevronRight className="w-4 h-4 mr-1 text-teal-600" /> Gallery</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {activeTab === 'images' && <AdminImages token={token} onLogout={onLogout} />}
        {activeTab === 'content' && <AdminContent token={token} onLogout={onLogout} />}
        {activeTab === 'inquiries' && <AdminInquiries token={token} onLogout={onLogout} type="inquiries" />}
        {activeTab === 'subscriptions' && <AdminInquiries token={token} onLogout={onLogout} type="subscriptions" />}
      </main>
    </div>
  );
};

export default AdminDashboard;
