import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiUser, FiArrowLeft, FiClock, FiX } from 'react-icons/fi';
import { eventsAPI } from '../services/api';
import { format } from 'date-fns';

const EventDetails = () => {
  const { id } = useParams();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await eventsAPI.getById(id);
        if (response.data.success) {
          setEventData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="text-center">
          <div className="text-6xl mb-4">📅</div>
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">Event not found</h2>
          <p className="text-secondary-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <Link to="/events" className="btn-primary">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const isUpcoming = new Date(eventData.eventDate) >= new Date();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Back Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link
          to="/events"
          className="inline-flex items-center text-secondary-600 hover:text-primary-600 transition-colors duration-200 font-medium"
        >
          <FiArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </Link>
      </div>

      {/* Event Header Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Event Cover Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <img
                src={eventData.coverImage}
                alt={eventData.eventName}
                className="w-full h-96 object-cover rounded-xl shadow-xl"
              />
              {isUpcoming && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center shadow-lg">
                  <FiClock className="w-4 h-4 mr-2" />
                  Upcoming Event
                </div>
              )}
            </motion.div>

            {/* Event Information */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary-900 mb-4 leading-tight">
                  {eventData.eventName}
                </h1>
              </div>

              {/* Event Meta Information */}
              <div className="space-y-4">
                <div className="flex items-center text-secondary-700 bg-white p-4 rounded-lg shadow-sm">
                  <FiCalendar className="w-6 h-6 mr-4 text-primary-600" />
                  <div>
                    <span className="text-sm text-secondary-500 block">Event Date</span>
                    <span className="text-lg font-semibold">
                      {format(new Date(eventData.eventDate), 'EEEE, MMMM dd, yyyy')}
                    </span>
                  </div>
                </div>

                {eventData.venue && (
                  <div className="flex items-center text-secondary-700 bg-white p-4 rounded-lg shadow-sm">
                    <FiMapPin className="w-6 h-6 mr-4 text-primary-600" />
                    <div>
                      <span className="text-sm text-secondary-500 block">Venue</span>
                      <span className="text-lg font-semibold">{eventData.venue}</span>
                    </div>
                  </div>
                )}

                {eventData.organizer && (
                  <div className="flex items-center text-secondary-700 bg-white p-4 rounded-lg shadow-sm">
                    <FiUser className="w-6 h-6 mr-4 text-primary-600" />
                    <div>
                      <span className="text-sm text-secondary-500 block">Organizer</span>
                      <span className="text-lg font-semibold">{eventData.organizer}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Short Description */}
              <div className="bg-primary-50 p-6 rounded-xl border border-primary-100">
                <p className="text-lg text-secondary-700 leading-relaxed">
                  {eventData.shortDescription}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Event Information Section */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-display font-bold text-secondary-900 mb-8">
              Event Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-secondary-900 mb-4">Event Details</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-secondary-500">Event Name:</span>
                    <p className="text-secondary-900 font-medium">{eventData.eventName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-secondary-500">Date:</span>
                    <p className="text-secondary-900 font-medium">
                      {format(new Date(eventData.eventDate), 'EEEE, MMMM dd, yyyy')}
                    </p>
                  </div>
                  {eventData.venue && (
                    <div>
                      <span className="text-sm font-medium text-secondary-500">Venue:</span>
                      <p className="text-secondary-900 font-medium">{eventData.venue}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-secondary-900 mb-4">Organizer Details</h3>
                <div className="space-y-3">
                  {eventData.organizer && (
                    <div>
                      <span className="text-sm font-medium text-secondary-500">Organized by:</span>
                      <p className="text-secondary-900 font-medium">{eventData.organizer}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-medium text-secondary-500">Department:</span>
                    <p className="text-secondary-900 font-medium">AI & DS Department</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Description */}
            <div>
              <h3 className="text-2xl font-semibold text-secondary-900 mb-6">Detailed Description</h3>
              <div className="prose prose-lg max-w-none text-secondary-700 leading-relaxed">
                {eventData.fullDescription.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Event Photo Gallery Section */}
      {eventData.galleryImages && eventData.galleryImages.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-display font-bold text-secondary-900 mb-4 text-center">
                Event Photo Gallery
              </h2>
              <p className="text-lg text-secondary-600 text-center mb-12 max-w-2xl mx-auto">
                Browse through the photo gallery to see highlights and moments from this event.
                Click on any image to view it in full size.
              </p>
              
              {/* Gallery Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {eventData.galleryImages.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="cursor-pointer group"
                    onClick={() => setSelectedImage(image)}
                  >
                    <div className="relative overflow-hidden rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      <img
                        src={image}
                        alt={`${eventData.eventName} gallery ${index + 1}`}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                        <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200"
            >
              <FiX className="w-8 h-8" />
            </button>
            <img
              src={selectedImage}
              alt="Gallery image"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default EventDetails;