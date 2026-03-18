import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Plus, Pencil, Trash2, Loader2, Package, Star, Tag, Home } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const STAY_TYPE_OPTIONS = [
  { value: 'privateVillaCommonPool', label: 'Private Villa with Common Pool' },
  { value: 'privateVillaPrivatePool', label: 'Private Villa with Private Pool' },
  { value: 'apartments', label: 'Apartments with Common Pool' },
];

const CONTENT_SECTIONS = [
  { id: 'domestic-packages', label: 'Domestic Packages', icon: Package },
  { id: 'international-packages', label: 'International Packages', icon: Package },
  { id: 'goa-packages', label: 'Goa Hotels/Resorts', icon: Package },
  { id: 'bohra-stay-types', label: 'Bohra Stay Types', icon: Home },
  { id: 'bohra-stay-options', label: 'Bohra Stay Options', icon: Home },
  { id: 'testimonials', label: 'Testimonials', icon: Star },
  { id: 'offers', label: 'Offers & Deals', icon: Tag },
];

const SECTION_FIELDS = {
  'domestic-packages': [
    { key: 'name', label: 'Package Name', type: 'text', required: true },
    { key: 'destination', label: 'Destination', type: 'text', required: true },
    { key: 'duration', label: 'Duration (e.g., 4 Days / 3 Nights)', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea', required: true },
    { key: 'highlights', label: 'Highlights (one per line)', type: 'list' },
    { key: 'image', label: 'Image URL (or use Image Manager)', type: 'text' },
  ],
  'international-packages': [
    { key: 'name', label: 'Package Name', type: 'text', required: true },
    { key: 'destination', label: 'Destination', type: 'text', required: true },
    { key: 'duration', label: 'Duration', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea', required: true },
    { key: 'highlights', label: 'Highlights (one per line)', type: 'list' },
    { key: 'image', label: 'Image URL (or use Image Manager)', type: 'text' },
  ],
  'goa-packages': [
    { key: 'name', label: 'Hotel/Resort Name', type: 'text', required: true },
    { key: 'location', label: 'Location (e.g., North Goa - Calangute)', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'textarea', required: true },
    { key: 'amenities', label: 'Amenities (one per line)', type: 'list' },
    { key: 'priceStart', label: 'Starting Price (e.g., 3,500)', type: 'text' },
    { key: 'image', label: 'Image URL (or use Image Manager)', type: 'text' },
  ],
  'testimonials': [
    { key: 'name', label: 'Customer Name', type: 'text', required: true },
    { key: 'location', label: 'Location (e.g., Mumbai, India)', type: 'text', required: true },
    { key: 'rating', label: 'Rating (1-5)', type: 'number', required: true },
    { key: 'comment', label: 'Review Comment', type: 'textarea', required: true },
    { key: 'package', label: 'Package Name', type: 'text' },
    { key: 'image', label: 'Photo URL (or use Image Manager)', type: 'text' },
  ],
  'offers': [
    { key: 'title', label: 'Offer Title', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'textarea', required: true },
    { key: 'discount', label: 'Discount (e.g., 10% OFF)', type: 'text', required: true },
    { key: 'validTill', label: 'Valid Till (e.g., Ongoing or April 30, 2025)', type: 'text', required: true },
    { key: 'category', label: 'Category (e.g., All Packages, Goa)', type: 'text' },
    { key: 'image', label: 'Image URL (or use Image Manager)', type: 'text' },
  ],
  'bohra-stay-types': [
    { key: 'key', label: 'Stay Type Key', type: 'select', required: true, options: STAY_TYPE_OPTIONS },
    { key: 'name', label: 'Display Name', type: 'text', required: true },
    { key: 'subtitle', label: 'Subtitle', type: 'text', required: true },
    { key: 'tag', label: 'Tag Line', type: 'text', required: true },
  ],
  'bohra-stay-options': [
    { key: 'stayType', label: 'Stay Type', type: 'select', required: true, options: STAY_TYPE_OPTIONS },
    { key: 'bhk', label: 'BHK (e.g., 2 BHK)', type: 'text', required: true },
    { key: 'capacity', label: 'Capacity (e.g., 4-6 Person)', type: 'text', required: true },
    { key: 'option1', label: 'Option 1 (e.g., 2BHK Per unit for 4 person)', type: 'text', required: true },
    { key: 'option2', label: 'Option 2 (e.g., 2BHK Per unit for 4-6 person)', type: 'text', required: true },
    { key: 'price', label: 'Price (e.g., 18,500)', type: 'text', required: true },
    { key: 'note', label: 'Note (optional)', type: 'text' },
    { key: 'image', label: 'Image URL (or use Image Manager)', type: 'text' },
  ],
};

const ContentForm = ({ section, initialData, onSave, onCancel }) => {
  const fields = SECTION_FIELDS[section] || [];
  const [formData, setFormData] = useState(() => {
    const data = {};
    fields.forEach(f => {
      if (f.type === 'list') {
        data[f.key] = initialData?.[f.key] ? initialData[f.key].join('\n') : '';
      } else if (f.type === 'number') {
        data[f.key] = initialData?.[f.key]?.toString() || '';
      } else {
        data[f.key] = initialData?.[f.key] || '';
      }
    });
    return data;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const processed = {};
    fields.forEach(f => {
      if (f.type === 'list') {
        processed[f.key] = formData[f.key].split('\n').map(s => s.trim()).filter(Boolean);
      } else if (f.type === 'number') {
        processed[f.key] = parseInt(formData[f.key]) || 0;
      } else {
        processed[f.key] = formData[f.key];
      }
    });
    // Add an id for frontend reference
    processed.id = initialData?.id || Date.now();
    onSave(processed);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-testid="content-form">
      {fields.map(f => (
        <div key={f.key}>
          <Label className="text-sm font-semibold">{f.label} {f.required && '*'}</Label>
          {f.type === 'textarea' ? (
            <Textarea value={formData[f.key]} onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
              className="mt-1" rows={3} required={f.required} data-testid={`content-field-${f.key}`} />
          ) : f.type === 'list' ? (
            <Textarea value={formData[f.key]} onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
              className="mt-1" rows={4} placeholder="Enter one item per line" data-testid={`content-field-${f.key}`} />
          ) : f.type === 'select' ? (
            <select value={formData[f.key]} onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
              className="w-full mt-1 px-3 py-2 border rounded-md text-sm" required={f.required}
              data-testid={`content-field-${f.key}`}>
              <option value="">Select...</option>
              {(f.options || []).map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ) : (
            <Input type={f.type === 'number' ? 'number' : 'text'} value={formData[f.key]}
              onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
              className="mt-1" required={f.required} min={f.type === 'number' ? 1 : undefined}
              max={f.type === 'number' ? 5 : undefined} data-testid={`content-field-${f.key}`} />
          )}
        </div>
      ))}
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button type="submit" className="flex-1 bg-teal-600 hover:bg-teal-700 text-white" data-testid="content-save-btn">
          {initialData ? 'Update' : 'Add'} Item
        </Button>
      </div>
    </form>
  );
};

const ContentCard = ({ item, section, onEdit, onDelete }) => {
  const data = item.data || item;
  const fields = SECTION_FIELDS[section] || [];
  const titleField = fields[0]?.key;
  const subtitleField = fields[1]?.key;

  // For select fields, show the label instead of the value
  const getDisplayValue = (key, value) => {
    const field = fields.find(f => f.key === key);
    if (field?.type === 'select' && field.options) {
      const opt = field.options.find(o => o.value === value);
      return opt ? opt.label : value;
    }
    return value;
  };

  return (
    <Card className="hover:shadow-md transition-shadow" data-testid={`content-card-${item.id}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-gray-800 truncate">{getDisplayValue(titleField, data[titleField]) || 'Untitled'}</h4>
            {subtitleField && <p className="text-sm text-gray-500 truncate">{getDisplayValue(subtitleField, data[subtitleField])}</p>}
            {data.description && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{data.description}</p>}
            {data.comment && <p className="text-xs text-gray-400 mt-1 line-clamp-2">"{data.comment}"</p>}
            {data.discount && <span className="inline-block mt-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">{data.discount}</span>}
            {data.bhk && <span className="inline-block mt-1 text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-semibold mr-1">{data.bhk}</span>}
            {data.capacity && <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">{data.capacity}</span>}
            {data.price && <span className="inline-block mt-1 ml-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">From ₹{data.price}/night</span>}
            {data.tag && <p className="text-xs text-teal-600 mt-1 font-medium">{data.tag}</p>}
          </div>
          <div className="flex gap-1 ml-2 flex-shrink-0">
            <Button size="sm" variant="outline" onClick={() => onEdit(item)} data-testid={`edit-content-${item.id}`}
              className="h-8 w-8 p-0"><Pencil className="w-3.5 h-3.5" /></Button>
            <Button size="sm" variant="outline" onClick={() => onDelete(item.id)} data-testid={`delete-content-${item.id}`}
              className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AdminContent = ({ token, onLogout }) => {
  const [activeSection, setActiveSection] = useState('domestic-packages');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const fetchContent = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/content?section=${activeSection}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      } else if (res.status === 401) {
        onLogout();
      }
    } catch {
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  }, [token, activeSection, onLogout]);

  useEffect(() => { fetchContent(); }, [fetchContent]);

  const handleSave = async (formData) => {
    try {
      if (editItem) {
        const res = await fetch(`${API_URL}/api/admin/content/${editItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ data: formData })
        });
        if (res.ok) {
          toast.success('Content updated!');
        } else {
          toast.error('Failed to update');
          return;
        }
      } else {
        const res = await fetch(`${API_URL}/api/admin/content`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ section: activeSection, data: formData, sort_order: items.length })
        });
        if (res.ok) {
          toast.success('Content added!');
        } else {
          toast.error('Failed to add');
          return;
        }
      }
      setShowForm(false);
      setEditItem(null);
      fetchContent();
    } catch {
      toast.error('Operation failed');
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setShowForm(true);
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Delete this content item?')) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/content/${itemId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Content deleted');
        fetchContent();
      }
    } catch {
      toast.error('Failed to delete');
    }
  };

  const sectionInfo = CONTENT_SECTIONS.find(s => s.id === activeSection);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Content Manager</h2>
        <Button onClick={() => { setEditItem(null); setShowForm(true); }}
          className="bg-teal-600 hover:bg-teal-700 text-white" data-testid="add-content-btn">
          <Plus className="w-4 h-4 mr-2" /> Add {sectionInfo?.label?.replace(/s$/, '') || 'Item'}
        </Button>
      </div>

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CONTENT_SECTIONS.map(s => {
          const Icon = s.icon;
          return (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeSection === s.id ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`} data-testid={`content-tab-${s.id}`}>
              <Icon className="w-4 h-4" /> {s.label}
            </button>
          );
        })}
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          <strong>How it works:</strong> Add content here and it will appear on your live website instantly.
          If no custom content exists for a section, the default content will show. You can add, edit, or delete anytime.
        </p>
      </div>

      {/* Content List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      ) : items.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No custom content yet</p>
            <p className="text-gray-400 text-sm mt-1">Default content is showing on your website. Add custom content to replace it.</p>
            <Button onClick={() => { setEditItem(null); setShowForm(true); }}
              className="mt-4 bg-teal-600 hover:bg-teal-700 text-white">
              <Plus className="w-4 h-4 mr-2" /> Add Your First Item
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <ContentCard key={item.id} item={item} section={activeSection}
              onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={(open) => { if (!open) { setShowForm(false); setEditItem(null); } }}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto" data-testid="content-dialog">
          <DialogHeader>
            <DialogTitle>{editItem ? 'Edit' : 'Add'} {sectionInfo?.label?.replace(/s$/, '') || 'Item'}</DialogTitle>
          </DialogHeader>
          <ContentForm
            section={activeSection}
            initialData={editItem?.data}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditItem(null); }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminContent;
