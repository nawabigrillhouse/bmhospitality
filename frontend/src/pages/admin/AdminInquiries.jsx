import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Loader2, Plane, Hotel, Package, Mail, Users, Phone, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const AdminInquiries = ({ token, onLogout, type }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = type === 'subscriptions' ? 'subscriptions' : 'inquiries';
      const res = await fetch(`${API_URL}/api/admin/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data[endpoint] || []);
      } else if (res.status === 401) {
        onLogout();
      }
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [token, type, onLogout]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const typeIcon = (t) => {
    switch (t) {
      case 'flight': return <Plane className="w-4 h-4 text-blue-600" />;
      case 'hotel': return <Hotel className="w-4 h-4 text-amber-600" />;
      case 'contact': return <Mail className="w-4 h-4 text-green-600" />;
      case 'package': return <Package className="w-4 h-4 text-teal-600" />;
      default: return <Mail className="w-4 h-4 text-gray-600" />;
    }
  };

  const typeBadge = (t) => {
    const colors = {
      flight: 'bg-blue-100 text-blue-700',
      hotel: 'bg-amber-100 text-amber-700',
      contact: 'bg-green-100 text-green-700',
      package: 'bg-teal-100 text-teal-700'
    };
    return colors[t] || 'bg-gray-100 text-gray-700';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {type === 'subscriptions' ? 'Newsletter Subscriptions' : 'All Inquiries'}
        </h2>
        <span className="bg-teal-100 text-teal-700 px-4 py-2 rounded-full font-bold">
          {items.length} {type === 'subscriptions' ? 'subscribers' : 'inquiries'}
        </span>
      </div>

      {items.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No {type} yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((item, idx) => (
            <Card key={item.id || idx} className="hover:shadow-md transition-shadow" data-testid={`inquiry-card-${idx}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {type !== 'subscriptions' && (
                        <>
                          {typeIcon(item.type)}
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeBadge(item.type)}`}>
                            {(item.type || 'general').toUpperCase()}
                          </span>
                        </>
                      )}
                      <span className="text-xs text-gray-400 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" /> {formatDate(item.created_at)}
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-800 text-lg">{item.name}</h3>

                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                      {item.email && (
                        <span className="flex items-center"><Mail className="w-3 h-3 mr-1" /> {item.email}</span>
                      )}
                      {item.phone && (
                        <span className="flex items-center"><Phone className="w-3 h-3 mr-1" /> {item.phone}</span>
                      )}
                      {item.whatsapp && (
                        <span className="flex items-center"><Phone className="w-3 h-3 mr-1 text-green-600" /> WA: {item.whatsapp}</span>
                      )}
                    </div>

                    {/* Type-specific details */}
                    {item.type === 'flight' && (
                      <div className="mt-3 bg-blue-50 p-3 rounded-lg text-sm">
                        <p><strong>Route:</strong> {item.from_city} → {item.to_city}</p>
                        <p><strong>Date:</strong> {item.departure_date} {item.return_date ? `→ ${item.return_date}` : ''}</p>
                        <p><strong>Passengers:</strong> {item.passengers} | <strong>Class:</strong> {item.travel_class} | <strong>Trip:</strong> {item.trip_type}</p>
                      </div>
                    )}
                    {item.type === 'hotel' && (
                      <div className="mt-3 bg-amber-50 p-3 rounded-lg text-sm">
                        <p><strong>Destination:</strong> {item.destination}</p>
                        <p><strong>Dates:</strong> {item.check_in_date} → {item.check_out_date}</p>
                        <p><strong>Guests:</strong> {item.adults} adults, {item.children} children | <strong>Meal:</strong> {item.meal_plan}</p>
                      </div>
                    )}
                    {item.type === 'package' && (
                      <div className="mt-3 bg-teal-50 p-3 rounded-lg text-sm">
                        <p><strong>Package:</strong> {item.package_type}</p>
                        <p><strong>Destination:</strong> {item.destination}</p>
                        <p><strong>Dates:</strong> {item.check_in_date} → {item.check_out_date}</p>
                        <p><strong>Guests:</strong> {item.number_of_adults} adults, {item.number_of_children} children</p>
                        {item.requirements && <p className="mt-1"><strong>Requirements:</strong> {item.requirements}</p>}
                      </div>
                    )}
                    {item.type === 'contact' && (
                      <div className="mt-3 bg-green-50 p-3 rounded-lg text-sm">
                        <p><strong>Subject:</strong> {item.subject}</p>
                        <p className="mt-1">{item.message}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminInquiries;
