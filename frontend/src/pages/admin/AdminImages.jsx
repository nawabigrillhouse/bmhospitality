import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Upload, Trash2, Image as ImageIcon, Loader2, Eye, X, Check, MapPin, Clock, Star } from 'lucide-react';
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

const SectionPreview = ({ section, imageUrl }) => {
  if (section === 'hero') {
    return (
      <div className="relative w-full h-64 rounded-lg overflow-hidden">
        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 via-teal-800/60 to-transparent" />
        <div className="absolute inset-0 flex items-center p-8">
          <div className="text-white max-w-md">
            <h3 className="text-2xl font-bold mb-2">Discover Your Dream Destination</h3>
            <p className="text-sm text-white/80 mb-3">Experience the world with BM Hospitality</p>
            <div className="flex gap-2">
              <span className="bg-teal-600 px-3 py-1 rounded text-xs font-semibold">Explore Packages</span>
              <span className="border border-white px-3 py-1 rounded text-xs">Get Quote</span>
            </div>
          </div>
        </div>
        <div className="absolute top-2 left-2 bg-teal-600 text-white text-xs px-2 py-1 rounded font-bold">HERO BANNER</div>
      </div>
    );
  }
  if (section === 'gallery') {
    return (
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map(i => (
          <div key={i} className="relative h-32 rounded-lg overflow-hidden group">
            <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30 flex items-end p-2">
              <span className="text-white text-xs font-semibold">Gallery Image</span>
            </div>
          </div>
        ))}
        <div className="col-span-3 bg-gray-100 text-center py-1 rounded text-xs text-gray-500">Gallery grid preview</div>
      </div>
    );
  }
  if (['domestic-packages', 'international-packages', 'goa-hotels'].includes(section)) {
    return (
      <div className="max-w-xs mx-auto border rounded-lg overflow-hidden shadow-md">
        <div className="relative h-40 overflow-hidden">
          <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
        </div>
        <div className="p-3 bg-white">
          <h4 className="font-bold text-sm text-gray-800">Package Name</h4>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
            <MapPin className="w-3 h-3" /> Destination <Clock className="w-3 h-3 ml-2" /> 5D/4N
          </div>
          <p className="text-xs text-gray-600 mt-2 line-clamp-2">Package description will appear here with highlights...</p>
          <div className="flex justify-between items-center mt-3 pt-2 border-t">
            <span className="text-teal-700 font-bold text-sm">Request Quote</span>
            <span className="bg-teal-600 text-white text-xs px-3 py-1 rounded">Get Quote</span>
          </div>
        </div>
        <div className="bg-gray-100 text-center py-1 text-xs text-gray-500">Package card preview</div>
      </div>
    );
  }
  if (section === 'bohra-stays') {
    return (
      <div className="max-w-xs mx-auto border-2 rounded-lg overflow-hidden shadow-md">
        <div className="relative h-40 overflow-hidden">
          <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute top-2 right-2 bg-teal-600 text-white px-3 py-1 rounded-full text-xs font-bold">2 BHK</div>
        </div>
        <div className="p-3 bg-white">
          <h4 className="font-bold text-sm text-gray-800">Villa / Apartment</h4>
          <p className="text-xs text-gray-600 mt-1 flex items-center"><Star className="w-3 h-3 mr-1 text-teal-600" /> Up to 6 Guests</p>
          <span className="bg-teal-600 text-white text-xs px-3 py-1 rounded mt-2 inline-block">Fill Inquiry Form</span>
        </div>
        <div className="bg-gray-100 text-center py-1 text-xs text-gray-500">Bohra stay card preview</div>
      </div>
    );
  }
  if (section === 'offers') {
    return (
      <div className="max-w-xs mx-auto border rounded-lg overflow-hidden shadow-md">
        <div className="relative h-36 overflow-hidden">
          <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute top-3 right-3 bg-green-700 text-white px-3 py-1 rounded-full text-xs font-bold">10% OFF</div>
          <div className="absolute top-3 left-3 bg-white/90 px-2 py-0.5 rounded-full text-xs font-semibold text-gray-700">All Packages</div>
        </div>
        <div className="p-3 bg-white">
          <h4 className="font-bold text-sm">Offer Title</h4>
          <p className="text-xs text-gray-600 mt-1">Special discount description...</p>
          <div className="bg-green-50 p-2 rounded mt-2 flex justify-between items-center">
            <span className="text-xs font-semibold text-green-800">Special Discount</span>
            <span className="text-sm font-bold text-green-700">10% OFF</span>
          </div>
        </div>
        <div className="bg-gray-100 text-center py-1 text-xs text-gray-500">Offer card preview</div>
      </div>
    );
  }
  // Default preview for testimonials, general
  return (
    <div className="flex items-center justify-center">
      <div className="border rounded-lg overflow-hidden shadow-md max-w-sm">
        <img src={imageUrl} alt="Preview" className="w-full h-48 object-cover" />
        <div className="bg-gray-100 text-center py-1 text-xs text-gray-500">Image preview</div>
      </div>
    </div>
  );
};

const AdminImages = ({ token, onLogout }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeSection, setActiveSection] = useState('all');
  const [uploadSection, setUploadSection] = useState('general');
  const [uploadLabel, setUploadLabel] = useState('');
  const [previewFiles, setPreviewFiles] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
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

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const previews = Array.from(files).map(file => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size
    }));
    setPreviewFiles(previews);
    setShowPreview(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const cancelPreview = () => {
    previewFiles.forEach(p => URL.revokeObjectURL(p.url));
    setPreviewFiles([]);
    setShowPreview(false);
  };

  const confirmUpload = async () => {
    setShowPreview(false);
    setUploading(true);
    let successCount = 0;

    for (const preview of previewFiles) {
      const formData = new FormData();
      formData.append('file', preview.file);

      try {
        const res = await fetch(
          `${API_URL}/api/admin/upload?section=${uploadSection}&label=${encodeURIComponent(uploadLabel || preview.name)}`,
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
          toast.error(`Failed: ${preview.name} - ${data.detail}`);
        }
      } catch {
        toast.error(`Failed to upload: ${preview.name}`);
      }
    }

    if (successCount > 0) {
      toast.success(`${successCount} image(s) uploaded successfully!`);
      fetchImages();
    }
    previewFiles.forEach(p => URL.revokeObjectURL(p.url));
    setPreviewFiles([]);
    setUploading(false);
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
                  : <><Eye className="w-4 h-4 mr-2" /> Choose & Preview</>}
              </Button>
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileSelect}
            className="hidden" data-testid="upload-file-input" />
          <p className="text-xs text-gray-500">Supported: JPEG, PNG, WebP, GIF. Max 10MB per file. Select files to preview before uploading.</p>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={(open) => { if (!open) cancelPreview(); }}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto" data-testid="preview-dialog">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Eye className="w-5 h-5 text-teal-600" />
              Preview — {SECTIONS.find(s => s.id === uploadSection)?.label}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-2">
            {/* Section mockup preview */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">How it will look on the website:</p>
              <div className="bg-gray-50 p-4 rounded-lg border">
                {previewFiles.length > 0 && (
                  <SectionPreview section={uploadSection} imageUrl={previewFiles[0].url} />
                )}
              </div>
            </div>

            {/* All selected files */}
            {previewFiles.length > 1 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">All selected files ({previewFiles.length}):</p>
                <div className="grid grid-cols-3 gap-3">
                  {previewFiles.map((p, i) => (
                    <div key={i} className="border rounded-lg overflow-hidden">
                      <img src={p.url} alt={p.name} className="w-full h-24 object-cover" />
                      <div className="p-1.5">
                        <p className="text-xs font-medium truncate">{p.name}</p>
                        <p className="text-xs text-gray-400">{(p.size / 1024).toFixed(0)} KB</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {previewFiles.length === 1 && (
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <ImageIcon className="w-4 h-4" />
                <span className="font-medium">{previewFiles[0].name}</span>
                <span className="text-gray-400">({(previewFiles[0].size / 1024).toFixed(0)} KB)</span>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <Button onClick={cancelPreview} variant="outline" className="flex-1" data-testid="preview-cancel-btn">
                <X className="w-4 h-4 mr-2" /> Cancel
              </Button>
              <Button onClick={confirmUpload} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white" data-testid="preview-confirm-btn">
                <Check className="w-4 h-4 mr-2" /> Upload {previewFiles.length} Image{previewFiles.length > 1 ? 's' : ''}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
