import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiSearch } from 'react-icons/fi';
import { eventsAPI } from '../services/api';
import EventCard from '../components/events/EventCard';

const Events = () => {
  const [searchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState(searchParams.get('filter') || 'all');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let response;
        if (filter === 'upcoming') {
          response = await eventsAPI.getUpcoming();
        } else if (filter === 'past') {
          response = await eventsAPI.getPast();
        } else {
          // Get all events and sort by date
          response = await eventsAPI.getAll({ sort: 'date_desc' });
        }

        if (response.data.success) {
          // Sort events by date (newest first)
          const sortedEvents = response.data.data.sort((a, b) => {
            return new Date(b.eventDate) - new Date(a.eventDate);
          });
          setEvents(sortedEvents);
          setFilteredEvents(sortedEvents);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [filter]);

  useEffect(() => {
    const filtered = events.filter(event =>
      event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [searchTerm, events]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setLoading(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Header Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient mb-4">
              {filter === 'upcoming' ? 'Upcoming Events' : 
               filter === 'past' ? 'Past Events' : 
               'AI & DS Department Events'}
            </h1>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              {filter === 'upcoming' 
                ? 'Discover exciting upcoming events and opportunities in AI & Data Science'
                : filter === 'past'
                ? 'Explore our archive of completed events, workshops, and seminars'
                : 'Explore our comprehensive collection of events, workshops, and seminars conducted by the AI & DS Department'
              }
            </p>
          </motion.div>
        </div>
      </section>
      {/* Search and Filter Controls */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => handleFilterChange('all')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  filter === 'all'
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-white text-secondary-700 hover:bg-secondary-50 border border-secondary-200'
                }`}
              >
                <FiCalendar className="w-4 h-4" />
                <span>All Events</span>
              </button>
              <button
                onClick={() => handleFilterChange('upcoming')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  filter === 'upcoming'
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-white text-secondary-700 hover:bg-secondary-50 border border-secondary-200'
                }`}
              >
                <FiClock className="w-4 h-4" />
                <span>Upcoming</span>
              </button>
              <button
                onClick={() => handleFilterChange('past')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  filter === 'past'
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-white text-secondary-700 hover:bg-secondary-50 border border-secondary-200'
                }`}
              >
                <FiCalendar className="w-4 h-4" />
                <span>Past Events</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid Section */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="card p-6">
                  <div className="skeleton h-48 mb-4 rounded-lg"></div>
                  <div className="skeleton h-6 mb-2"></div>
                  <div className="skeleton h-4 mb-4"></div>
                  <div className="skeleton h-10"></div>
                </div>
              ))}
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <EventCard 
                    event={event} 
                    showUpcomingBadge={filter === 'all'} 
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-2xl font-semibold text-secondary-900 mb-2">
                {searchTerm ? 'No events found' : 'No events available'}
              </h3>
              <p className="text-secondary-600 max-w-md mx-auto">
                {searchTerm 
                  ? 'Try adjusting your search terms or browse all events'
                  : filter === 'upcoming' 
                    ? 'No upcoming events scheduled at the moment. Check back soon!'
                    : 'Events will be added soon by the AI & DS Department'
                }
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Events;