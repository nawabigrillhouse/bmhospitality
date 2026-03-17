import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Upload, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const SECTIONS = [
  { id: 'hero', label: 'Hero Banner' },
  { id: 'domestic-packages', label: 'Domestic Packages' },
  { id: 'international-packages', label: 'International Packages' },
  { id: 'goa-hotels', label: 'Goa Hotels & Resorts' },
  { id: 'bohra-stays', label: 'Bohra Stays' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'offers', label: 'Offers & Deals' },
  { id: 'general', label: 'General / Other' }
];

const AdminImages = ({ token, onLogout }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeSection, setActiveSection] = useState('all');
  const [uploadSection, setUploadSection] = useState('general');
  const [uploadLabel, setUploadLabel] = useState('');
  const fileInputRef = useRef(null);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const url = activeSection === 'all'
        ? `${API_URL}/api/admin/images`
        : `${API_URL}/api/admin/images?section=${activeSection}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setImages(data.images);
      } else if (res.status === 401) {
        onLogout();
      }
    } catch {
      toast.error('Failed to load images');
    } finally {
      setLoading(false);
    }
  }, [token, activeSection, onLogout]);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch(
          `${API_URL}/api/admin/upload?section=${uploadSection}&label=${encodeURIComponent(uploadLabel || file.name)}`,
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData
          }
        );
        if (res.ok) {
          successCount++;
        } else {
          const data = await res.json();
          toast.error(`Failed: ${file.name} - ${data.detail}`);
        }
      } catch {
        toast.error(`Failed to upload: ${file.name}`);
      }
    }

    if (successCount > 0) {
      toast.success(`${successCount} image(s) uploaded successfully!`);
      fetchImages();
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (imageId) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/images/${imageId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Image deleted');
        fetchImages();
      }
    } catch {
      toast.error('Failed to delete image');
    }
  };

  const getImageUrl = (storagePath) => {
    return `${API_URL}/api/files/${storagePath}`;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Image Manager</h2>

      {/* Upload Section */}
      <Card className="mb-8 border-2 border-dashed border-teal-300 bg-teal-50/30">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Upload className="w-5 h-5 mr-2 text-teal-600" /> Upload New Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label className="text-sm font-semibold">Section *</Label>
              <select value={uploadSection} onChange={(e) => setUploadSection(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-md text-sm" data-testid="upload-section-select">
                {SECTIONS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <Label className="text-sm font-semibold">Label (optional)</Label>
              <input type="text" value={uploadLabel} onChange={(e) => setUploadLabel(e.target.value)}
                placeholder="e.g., Villa Pool View" className="w-full mt-1 px-3 py-2 border rounded-md text-sm" />
            </div>
            <div className="flex items-end">
              <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white" data-testid="upload-btn">
                {uploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</>
                  : <><Upload className="w-4 h-4 mr-2" /> Choose & Upload</>}
              </Button>
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleUpload}
            className="hidden" data-testid="upload-file-input" />
          <p className="text-xs text-gray-500">Supported: JPEG, PNG, WebP, GIF. Max 10MB per file. You can select multiple files.</p>
        </CardContent>
      </Card>

      {/* Section Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setActiveSection('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeSection === 'all' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}>All Sections</button>
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeSection === s.id ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}>{s.label}</button>
        ))}
      </div>

      {/* Image Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      ) : images.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No images uploaded yet</p>
            <p className="text-gray-400 text-sm mt-1">Upload your first image using the form above</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img) => (
            <Card key={img.id} className="overflow-hidden group hover:shadow-lg transition-shadow" data-testid={`image-card-${img.id}`}>
              <div className="relative h-48 bg-gray-100">
                <img src={getImageUrl(img.storage_path)} alt={img.label || img.original_filename}
                  className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <Button onClick={() => handleDelete(img.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700 text-white"
                    size="sm" data-testid={`delete-image-${img.id}`}>
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="text-sm font-semibold text-gray-800 truncate">{img.label || img.original_filename}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
                    {SECTIONS.find(s => s.id === img.section)?.label || img.section}
                  </span>
                  <span className="text-xs text-gray-400">{(img.size / 1024).toFixed(0)} KB</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminImages;
