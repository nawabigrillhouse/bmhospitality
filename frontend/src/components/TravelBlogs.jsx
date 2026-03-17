import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { BookOpen, Calendar, User, ArrowRight } from 'lucide-react';

const TravelBlogs = () => {
  const blogs = [
    {
      id: 1,
      title: "10 Hidden Gems in Goa You Must Visit",
      excerpt: "Discover the lesser-known beaches, cafes, and attractions that make Goa truly special beyond the usual tourist spots.",
      image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800",
      author: "BM Hospitality Team",
      date: "February 15, 2025",
      category: "Destinations"
    },
    {
      id: 2,
      title: "Best Time to Visit Kashmir: A Complete Guide",
      excerpt: "Plan your Kashmir trip perfectly with our month-by-month guide covering weather, activities, and travel tips.",
      image: "https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800",
      author: "Travel Expert",
      date: "February 10, 2025",
      category: "Travel Tips"
    },
    {
      id: 3,
      title: "Dubai in 5 Days: The Perfect Itinerary",
      excerpt: "Make the most of your Dubai vacation with this carefully crafted 5-day itinerary covering all must-see attractions.",
      image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
      author: "BM Hospitality Team",
      date: "February 5, 2025",
      category: "Itineraries"
    },
    {
      id: 4,
      title: "Travel Packing Tips: What to Carry for Beach Holidays",
      excerpt: "Essential packing checklist for your beach vacation to ensure you don't miss anything important.",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      author: "Travel Expert",
      date: "January 28, 2025",
      category: "Travel Tips"
    },
    {
      id: 5,
      title: "Maldives on a Budget: Is It Possible?",
      excerpt: "Yes! Discover how to experience the luxury of Maldives without breaking the bank with our budget travel guide.",
      image: "https://images.pexels.com/photos/34519397/pexels-photo-34519397.jpeg?w=800",
      author: "Budget Traveler",
      date: "January 20, 2025",
      category: "Budget Travel"
    },
    {
      id: 6,
      title: "Dawoodi Bohra Community Travel: Best Practices",
      excerpt: "Special considerations and tips for Dawoodi Bohra travelers to make your journey comfortable and convenient.",
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      author: "Community Guide",
      date: "January 15, 2025",
      category: "Community"
    }
  ];

  return (
    <section id="blogs" className="py-20 bg-gradient-to-b from-white to-purple-50/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-12 h-12 text-purple-600 mr-3" />
            <h2 className="section-title mb-0">Travel Blogs & Guides</h2>
          </div>
          <p className="section-subtitle">
            Expert travel tips, destination guides, and inspiring stories to help plan your perfect journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Card key={blog.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer">
              <div className="relative h-56 overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {blog.category}
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-xl group-hover:text-purple-600 transition-colors line-clamp-2">
                  {blog.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-4 text-sm mt-2">
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {blog.author}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {blog.date}
                  </span>
                </CardDescription>
              </CardHeader>

              <CardContent>
                <p className="text-gray-600 line-clamp-3">{blog.excerpt}</p>
                <Button
                  variant="link"
                  className="mt-4 text-purple-600 hover:text-purple-700 p-0 h-auto font-semibold"
                >
                  Read More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center text-white shadow-2xl">
          <BookOpen className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-3xl font-bold mb-3">Stay Updated with Travel Tips!</h3>
          <p className="text-xl mb-6">Subscribe to our newsletter for the latest travel blogs, tips, and exclusive offers.</p>
          <Button
            size="lg"
            className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-6 text-lg font-bold"
          >
            Subscribe to Newsletter
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TravelBlogs;
