// utils/dummyData.js
/**
 * Dummy Data Helper - Use for testing APIs without database
 * This file provides mock responses for all major endpoints
 * Remove or disable this when connecting to real database
 */

const dummyData = {
  // Tours & Experiences
  tours: [
    {
      _id: '1',
      title: 'Golden Triangle Tour',
      description: 'Explore Delhi, Agra, and Jaipur',
      duration: '5 days',
      price: 25000,
      rating: 4.5,
      image: '/images/golden-triangle.jpg',
      availability: true
    },
    {
      _id: '2',
      title: 'Goa Beach Getaway',
      description: 'Relax on beautiful beaches of Goa',
      duration: '3 days',
      price: 15000,
      rating: 4.2,
      image: '/images/goa.jpg',
      availability: true
    },
    {
      _id: '3',
      title: 'Kerala Backwaters',
      description: 'Experience the scenic backwaters',
      duration: '4 days',
      price: 20000,
      rating: 4.8,
      image: '/images/kerala.jpg',
      availability: true
    }
  ],

  // Destinations
  destinations: [
    {
      _id: '1',
      name: 'Agra',
      description: 'Home to the iconic Taj Mahal',
      image: '/images/agra.jpg',
      bestTimeToVisit: 'October to March'
    },
    {
      _id: '2',
      name: 'Jaipur',
      description: 'The Pink City of India',
      image: '/images/jaipur.jpg',
      bestTimeToVisit: 'September to March'
    },
    {
      _id: '3',
      name: 'Delhi',
      description: 'Capital of India with rich history',
      image: '/images/delhi.jpg',
      bestTimeToVisit: 'October to March'
    }
  ],

  // Packages
  packages: [
    {
      _id: '1',
      name: 'Luxury Golden Triangle',
      category: 'premium',
      price: 50000,
      duration: 6,
      inclusions: ['Flight', 'Hotel', 'Meals', 'Guide'],
      description: 'Premium tour package',
      rating: 4.7
    },
    {
      _id: '2',
      name: 'Budget India Tour',
      category: 'budget',
      price: 15000,
      duration: 10,
      inclusions: ['Train', 'Hostel', 'Local Meals'],
      description: 'Affordable tour package',
      rating: 4.3
    }
  ],

  // Blogs
  blogs: [
    {
      _id: '1',
      title: '10 Must-Visit Places in India',
      author: 'Travel Guide',
      content: 'Explore the most beautiful destinations in India...',
      image: '/images/blog1.jpg',
      publishedDate: new Date(),
      views: 5000,
      category: 'travel-tips'
    },
    {
      _id: '2',
      title: 'Best Time to Visit India',
      author: 'Travel Expert',
      content: 'Learn about the best seasons to visit India...',
      image: '/images/blog2.jpg',
      publishedDate: new Date(),
      views: 3200,
      category: 'travel-tips'
    }
  ],

  // Reviews
  reviews: [
    {
      _id: '1',
      guestName: 'John Doe',
      rating: 5,
      comment: 'Amazing experience! Highly recommended.',
      package: 'Golden Triangle Tour',
      date: new Date()
    },
    {
      _id: '2',
      guestName: 'Jane Smith',
      rating: 4,
      comment: 'Great service and wonderful memories.',
      package: 'Goa Beach Getaway',
      date: new Date()
    }
  ],

  // Gallery Images
  gallery: [
    {
      _id: '1',
      title: 'Taj Mahal',
      image: '/images/taj-mahal.jpg',
      category: 'monument',
      destination: 'Agra'
    },
    {
      _id: '2',
      title: 'Goa Sunset',
      image: '/images/goa-sunset.jpg',
      category: 'beach',
      destination: 'Goa'
    }
  ],

  // News
  news: [
    {
      _id: '1',
      title: 'New Flight Routes to India',
      content: 'International airlines announce new routes...',
      image: '/images/news1.jpg',
      date: new Date(),
      category: 'flights'
    }
  ],

  // Enquiries (for admin)
  enquiries: [
    {
      _id: '1',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+91 9876543210',
      package: 'Golden Triangle Tour',
      message: 'Interested in booking for 5 people',
      status: 'pending',
      createdAt: new Date()
    }
  ],

  // Contact Messages
  contactMessages: [
    {
      _id: '1',
      name: 'Sarah Williams',
      email: 'sarah@example.com',
      subject: 'Tour Inquiry',
      message: 'I want to know more about Kerala tours',
      status: 'new',
      createdAt: new Date()
    }
  ],

  // Admin Stats
  stats: {
    totalBookings: 156,
    totalRevenue: 4250000,
    totalCustomers: 89,
    totalPackages: 24,
    thisMonthBookings: 32,
    thisMonthRevenue: 650000
  }
};

// Helper functions
const getDummyList = (type) => dummyData[type] || [];
const getDummyItem = (type, id) => dummyData[type]?.find(item => item._id === id) || null;
const getDummyStats = () => dummyData.stats;

module.exports = {
  dummyData,
  getDummyList,
  getDummyItem,
  getDummyStats
};
