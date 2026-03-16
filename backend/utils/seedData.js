const Event = require('../models/Event');

const sampleEvents = [
  {
    eventName: "AI Workshop 2024",
    eventDate: new Date('2024-04-15'),
    shortDescription: "Hands-on workshop covering the latest AI technologies and machine learning techniques.",
    fullDescription: "Join us for an intensive AI workshop where you'll learn about neural networks, deep learning, and practical applications of artificial intelligence. This workshop is designed for students and professionals looking to enhance their AI skills.",
    venue: "AI & DS Department Lab",
    organizer: "AI & DS Department",
    coverImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop"
    ],
    status: 'published'
  },
  {
    eventName: "Data Science Symposium",
    eventDate: new Date('2024-05-20'),
    shortDescription: "Annual symposium featuring industry experts discussing the future of data science.",
    fullDescription: "Our annual Data Science Symposium brings together leading experts from academia and industry to discuss cutting-edge research, emerging trends, and real-world applications of data science. Network with professionals and learn about career opportunities.",
    venue: "Main Auditorium",
    organizer: "AI & DS Department",
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop"
    ],
    status: 'published'
  },
  {
    eventName: "Machine Learning Bootcamp",
    eventDate: new Date('2024-06-10'),
    shortDescription: "Intensive 3-day bootcamp covering machine learning algorithms and implementation.",
    fullDescription: "A comprehensive 3-day bootcamp designed to take you from ML basics to advanced implementations. You'll work on real projects, learn popular frameworks like TensorFlow and PyTorch, and build a portfolio of ML applications.",
    venue: "Computer Lab 1 & 2",
    organizer: "AI & DS Department",
    coverImage: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=300&fit=crop"
    ],
    status: 'published'
  }
];

const seedEvents = async () => {
  try {
    console.log('🌱 Seeding sample events...');
    
    // Clear existing events
    await Event.deleteMany({});
    console.log('🗑️ Cleared existing events');
    
    // Insert sample events
    const createdEvents = await Event.insertMany(sampleEvents);
    console.log(`✅ Created ${createdEvents.length} sample events`);
    
    return createdEvents;
  } catch (error) {
    console.error('❌ Error seeding events:', error.message);
    throw error;
  }
};

module.exports = { seedEvents };