import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiArrowRight, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';

const EventCard = ({ event, showUpcomingBadge = false }) => {
  const isUpcoming = new Date(event.eventDate) >= new Date();

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="card card-hover group bg-white shadow-lg border border-secondary-100 overflow-hidden"
    >
      {/* Event Image */}
      <div className="relative overflow-hidden h-48">
        <img
          src={event.coverImage}
          alt={event.eventName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {(showUpcomingBadge && isUpcoming) && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center shadow-lg">
            <FiClock className="w-3 h-3 mr-1" />
            Upcoming
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Event Content */}
      <div className="p-6">
        {/* Event Name */}
        <h3 className="text-xl font-bold text-secondary-900 mb-3 group-hover:text-primary-600 transition-colors duration-200 line-clamp-2">
          {event.eventName}
        </h3>
        
        {/* Event Date */}
        <div className="flex items-center text-secondary-500 text-sm mb-3">
          <FiCalendar className="w-4 h-4 mr-2 text-primary-500" />
          <span className="font-medium">
            {format(new Date(event.eventDate), 'MMMM dd, yyyy')}
          </span>
        </div>

        {/* Venue (if available) */}
        {event.venue && (
          <div className="flex items-center text-secondary-500 text-sm mb-3">
            <FiMapPin className="w-4 h-4 mr-2 text-primary-500" />
            <span>{event.venue}</span>
          </div>
        )}

        {/* Short Description */}
        <p className="text-secondary-600 text-sm mb-6 line-clamp-3 leading-relaxed">
          {event.shortDescription}
        </p>

        {/* View Details Button */}
        <Link
          to={`/events/${event._id}`}
          className="inline-flex items-center justify-center w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 group-hover:shadow-lg"
        >
          View Details
          <FiArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>
    </motion.div>
  );
};

export default EventCard;