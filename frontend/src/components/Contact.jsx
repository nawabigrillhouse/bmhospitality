import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../mock';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', message: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Save to DB (email notification sent automatically by backend)
      await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      toast.success('Thank you for contacting us! We will respond within 24 hours.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      toast.error('Failed to send. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-white to-teal-50/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="section-title" data-testid="contact-title">Get In Touch</h2>
          <p className="section-subtitle">Have questions? We're here to help plan your perfect journey</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="contact-info-card">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="contact-icon"><MapPin className="w-6 h-6" /></div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">Visit Us</h3>
                    <p className="text-gray-600 text-sm">104 Dattakrupa Apartment<br />Dattawadi, Mapusa<br />Goa, India</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="contact-info-card">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="contact-icon"><Phone className="w-6 h-6" /></div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">Call Us</h3>
                    <p className="text-gray-600 text-sm">+91 9890765859<br />+91 8329416113 (WhatsApp)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="contact-info-card">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="contact-icon"><Mail className="w-6 h-6" /></div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">Email Us</h3>
                    <p className="text-gray-600 text-sm">bmhospitality.11@gmail.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="contact-info-card">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="contact-icon"><Clock className="w-6 h-6" /></div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">Business Hours</h3>
                    <p className="text-gray-600 text-sm">Mon - Fri: 9:00 AM - 6:00 PM<br />Sat: 10:00 AM - 4:00 PM<br />Sun: Closed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader><CardTitle className="text-2xl">Send Us a Message</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact-name">Full Name *</Label>
                      <Input id="contact-name" name="name" value={formData.name} onChange={handleInputChange}
                        placeholder="John Doe" required data-testid="contact-name-input" />
                    </div>
                    <div>
                      <Label htmlFor="contact-email">Email *</Label>
                      <Input id="contact-email" name="email" type="email" value={formData.email}
                        onChange={handleInputChange} placeholder="john@example.com" required data-testid="contact-email-input" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact-phone">Phone / WhatsApp</Label>
                      <Input id="contact-phone" name="phone" type="tel" value={formData.phone}
                        onChange={handleInputChange} placeholder="+91 98765 43210" />
                    </div>
                    <div>
                      <Label htmlFor="contact-subject">Subject *</Label>
                      <Input id="contact-subject" name="subject" value={formData.subject}
                        onChange={handleInputChange} placeholder="How can we help?" required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="contact-message">Message *</Label>
                    <Textarea id="contact-message" name="message" value={formData.message}
                      onChange={handleInputChange} placeholder="Tell us about your travel plans or questions..."
                      rows={6} required />
                  </div>
                  <Button type="submit" disabled={loading} data-testid="contact-submit-btn"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white py-6 text-lg font-semibold">
                    <Send className="w-5 h-5 mr-2" />
                    {loading ? 'Sending...' : 'Send via Email & WhatsApp'}
                  </Button>
                </form>
              </CardContent>
            </Card>
            <div className="mt-8 rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3843.8!2d73.8!3d15.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDM2JzAwLjAiTiA3M8KwNDgnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                width="100%" height="400" style={{ border: 0 }} allowFullScreen="" loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="BM Hospitality - Dattakrupa Apartment, Mapusa, Goa"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
