import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiArrowRight, FiUsers, FiAward, FiTrendingUp, FiBookOpen } from 'react-icons/fi';
import { eventsAPI } from '../services/api';
import EventCard from '../components/events/EventCard';
import Hero3D from '../components/3d/Hero3D';

const Home = () => {
  const [recentEvents, setRecentEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const [allEventsRes, upcomingRes] = await Promise.all([
          eventsAPI.getAll({ sort: 'date_desc' }),
          eventsAPI.getUpcoming()
        ]);

        if (allEventsRes.data.success) {
          // Sort by date (newest first) and take first 3
          const sortedEvents = allEventsRes.data.data.sort((a, b) => {
            return new Date(b.eventDate) - new Date(a.eventDate);
          });
          setRecentEvents(sortedEvents.slice(0, 3));
        }

        if (upcomingRes.data.success) {
          // Sort upcoming events by date (earliest first)
          const sortedUpcoming = upcomingRes.data.data.sort((a, b) => {
            return new Date(a.eventDate) - new Date(b.eventDate);
          });
          setUpcomingEvents(sortedUpcoming.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const departmentStats = [
    { icon: FiCalendar, label: 'Events Conducted', value: '50+', color: 'primary' },
    { icon: FiUsers, label: 'Students Participated', value: '1000+', color: 'green' },
    { icon: FiAward, label: 'Awards Won', value: '25+', color: 'yellow' },
    { icon: FiTrendingUp, label: 'Success Rate', value: '95%', color: 'blue' },
  ];

  const focusAreas = [
    'Artificial Intelligence',
    'Machine Learning', 
    'Data Science',
    'Deep Learning',
    'Computer Vision',
    'Natural Language Processing'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with 3D Elements */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden gradient-bg">
        <Hero3D />
        <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-display font-bold text-gradient mb-6"
          >
            AI & DS Department
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-secondary-600 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Artificial Intelligence and Data Science Department - Pioneering the future through 
            cutting-edge technology education, research, and innovation.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/events" className="btn-primary text-lg px-8 py-4 flex items-center justify-center">
              Explore Events
              <FiArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link to="/events?filter=upcoming" className="btn-secondary text-lg px-8 py-4 flex items-center justify-center">
              Upcoming Events
              <FiClock className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
      {/* Department Overview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-display font-bold text-secondary-900 mb-6">
                Department Overview
              </h2>
              <div className="space-y-4 mb-8">
                <div className="bg-primary-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-primary-800 mb-3">Department Introduction</h3>
                  <p className="text-secondary-700 leading-relaxed">
                    The AI & DS Department is at the forefront of technological innovation, 
                    offering cutting-edge education in Artificial Intelligence, Machine Learning, 
                    and Data Science. We prepare students for the digital future through hands-on 
                    learning and research opportunities.
                  </p>
                </div>
                
                <div className="bg-secondary-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-secondary-800 mb-3">Vision and Mission</h3>
                  <p className="text-secondary-700 leading-relaxed">
                    To be a leading center of excellence in AI and Data Science education, 
                    fostering innovation, research, and developing skilled professionals who 
                    can drive technological advancement in society.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-secondary-900 mb-4">Key Highlights:</h4>
                {[
                  'Advanced AI & ML Curriculum',
                  'Industry-Relevant Projects', 
                  'Research & Innovation Focus',
                  'Expert Faculty & Mentorship'
                ].map((highlight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span className="text-secondary-700">{highlight}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Department Statistics */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              {departmentStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="card p-6 text-center card-hover"
                  >
                    <div className={`w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center ${
                      stat.color === 'primary' ? 'bg-primary-100 text-primary-600' :
                      stat.color === 'green' ? 'bg-green-100 text-green-600' :
                      stat.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-2xl font-bold text-secondary-900 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-secondary-600">{stat.label}</div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Academic Focus Areas */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <h3 className="text-2xl font-display font-bold text-secondary-900 mb-8">
              Academic Focus Areas
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {focusAreas.map((area, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-r from-primary-50 to-primary-100 p-4 rounded-lg border border-primary-200 hover:shadow-md transition-shadow duration-200"
                >
                  <FiBookOpen className="w-5 h-5 text-primary-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-primary-800">{area}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      {/* Events Section - Recent Events */}
      {recentEvents.length > 0 && (
        <section className="py-20 gradient-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-display font-bold text-secondary-900 mb-4">
                Events Section
              </h2>
              <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
                Discover our latest workshops, seminars, and technical activities 
                that showcase innovation in AI and Data Science conducted by our department.
              </p>
            </motion.div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="card p-6">
                    <div className="skeleton h-48 mb-4 rounded-lg"></div>
                    <div className="skeleton h-6 mb-2"></div>
                    <div className="skeleton h-4 mb-4"></div>
                    <div className="skeleton h-10"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recentEvents.map((event, index) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <EventCard event={event} />
                  </motion.div>
                ))}
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link to="/events" className="btn-primary text-lg px-8 py-3 inline-flex items-center">
                View All Events
                <FiArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Upcoming Events Section */}
      {upcomingEvents.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-display font-bold text-secondary-900 mb-4">
                Upcoming Events Section
              </h2>
              <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
                Don't miss out on our exciting upcoming events and opportunities 
                to learn and grow in the field of AI and Data Science. Events are automatically 
                categorized based on event date.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <EventCard event={event} showUpcomingBadge />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link to="/events?filter=upcoming" className="btn-primary text-lg px-8 py-3 inline-flex items-center">
                View All Upcoming Events
                <FiClock className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;