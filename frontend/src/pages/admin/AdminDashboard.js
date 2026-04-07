import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiCalendar, FiClock, FiEdit, FiTrash2, FiEye, FiTrendingUp, FiFileText, FiAward } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { eventsAPI } from '../../services/api';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    past: 0
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(20); // Show 20 events per page

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const allEventsRes = await eventsAPI.getAll({ sort: 'date_desc', limit: 500 });

      if (allEventsRes.data.success) {
        // Sort events by date (newest first)
        const eventsData = allEventsRes.data.data.sort((a, b) => {
          return new Date(b.eventDate) - new Date(a.eventDate);
        });
        setEvents(eventsData);
        
        const now = new Date();
        const upcoming = eventsData.filter(event => new Date(event.eventDate) >= now);
        const past = eventsData.filter(event => new Date(event.eventDate) < now);
        
        setStats({
          total: eventsData.length,
          upcoming: upcoming.length,
          past: past.length
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId, eventName) => {
    if (window.confirm(`Are you sure you want to delete "${eventName}"? This action cannot be undone.`)) {
      try {
        const response = await eventsAPI.delete(eventId);
        if (response.data.success) {
          toast.success('Event deleted successfully');
          fetchDashboardData(); // Refresh the data
        }
      } catch (error) {
        console.error('Error deleting event:', error);
        toast.error(error.response?.data?.message || 'Failed to delete event');
      }
    }
  };

  // Pagination logic
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(events.length / eventsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const statsCards = [
    { 
      label: 'Total Events', 
      value: stats.total, 
      icon: FiCalendar, 
      color: 'primary',
      description: 'All events in the system'
    },
    { 
      label: 'Upcoming Events', 
      value: stats.upcoming, 
      icon: FiClock, 
      color: 'green',
      description: 'Events scheduled for the future'
    },
    { 
      label: 'Past Events', 
      value: stats.past, 
      icon: FiTrendingUp, 
      color: 'blue',
      description: 'Completed events'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-display font-bold text-secondary-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-lg text-secondary-600">
              Manage AI & DS department content and activities
            </p>
          </div>
          <Link
            to="/admin/events/create"
            className="btn-primary flex items-center space-x-2 mt-4 md:mt-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 transform"
          >
            <FiPlus className="w-5 h-5" />
            <span>Create New Event</span>
          </Link>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Link
            to="/admin/events/create"
            className="card p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                <FiCalendar className="w-6 h-6 text-primary-600" />
              </div>
              <FiPlus className="w-5 h-5 text-secondary-400 group-hover:text-primary-600 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">Manage Events</h3>
            <p className="text-sm text-secondary-600">Create and manage department events</p>
          </Link>

          <Link
            to="/admin/mous"
            className="card p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <FiFileText className="w-6 h-6 text-blue-600" />
              </div>
              <FiPlus className="w-5 h-5 text-secondary-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">Manage MOUs</h3>
            <p className="text-sm text-secondary-600">Add and manage company partnerships</p>
          </Link>

          <Link
            to="/admin/nptel"
            className="card p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <FiTrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <FiPlus className="w-5 h-5 text-secondary-400 group-hover:text-green-600 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">NPTEL Certifications</h3>
            <p className="text-sm text-secondary-600">Manage faculty and student certifications</p>
          </Link>

          <Link
            to="/admin/achievements"
            className="card p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                <FiAward className="w-6 h-6 text-yellow-600" />
              </div>
              <FiPlus className="w-5 h-5 text-secondary-400 group-hover:text-yellow-600 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">Awards & Achievements</h3>
            <p className="text-sm text-secondary-600">Manage faculty, student & project achievements</p>
          </Link>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 + 0.4 }}
                whileHover={{ y: -5, scale: 1.05 }}
                className="card p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                    stat.color === 'primary' ? 'bg-primary-100 text-primary-600' :
                    stat.color === 'green' ? 'bg-green-100 text-green-600' :
                    stat.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                    'bg-secondary-100 text-secondary-600'
                  }`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-secondary-900">
                      {loading ? '...' : stat.value}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-secondary-900 font-semibold mb-1">
                    {stat.label}
                  </p>
                  <p className="text-sm text-secondary-500">
                    {stat.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Events Management Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="card overflow-hidden shadow-lg"
        >
          <div className="p-6 border-b border-secondary-200 bg-white">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold text-secondary-900">
                  Event Management
                </h2>
                <p className="text-secondary-600 mt-1">
                  Manage all department events from here
                </p>
              </div>
              <Link
                to="/admin/events/create"
                className="btn-secondary flex items-center space-x-2"
              >
                <FiPlus className="w-4 h-4" />
                <span>Add Event</span>
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border border-secondary-100 rounded-lg">
                    <div className="skeleton w-16 h-16 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="skeleton h-5 mb-2"></div>
                      <div className="skeleton h-4 w-2/3 mb-2"></div>
                      <div className="skeleton h-3 w-1/3"></div>
                    </div>
                    <div className="skeleton w-24 h-8"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : events.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                      Event Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                      Date & Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                      Gallery
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-secondary-200">
                  {currentEvents.map((event) => {
                    const isUpcoming = new Date(event.eventDate) >= new Date();
                    return (
                      <tr key={event._id} className="hover:bg-secondary-50 transition-all duration-200 hover:scale-[1.01] hover:shadow-sm">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <img
                              src={event.coverImage}
                              alt={event.eventName}
                              className="w-16 h-16 rounded-lg object-cover mr-4 shadow-sm"
                            />
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-secondary-900 mb-1">
                                {event.eventName}
                              </div>
                              <div className="text-sm text-secondary-500 line-clamp-2 max-w-xs">
                                {event.shortDescription}
                              </div>
                              {event.venue && (
                                <div className="text-xs text-secondary-400 mt-1">
                                  📍 {event.venue}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-secondary-900 mb-1">
                            {format(new Date(event.eventDate), 'MMM dd, yyyy')}
                          </div>
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            isUpcoming
                              ? 'bg-green-100 text-green-800'
                              : 'bg-secondary-100 text-secondary-800'
                          }`}>
                            {isUpcoming ? '🕒 Upcoming' : '✅ Past'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-secondary-600">
                            {event.galleryImages?.length || 0} images
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              to={`/events/${event._id}`}
                              className="p-2 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded-lg transition-all duration-150"
                              title="View Event"
                            >
                              <FiEye className="w-4 h-4" />
                            </Link>
                            <Link
                              to={`/admin/events/edit/${event._id}`}
                              className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50 rounded-lg transition-all duration-150"
                              title="Edit Event"
                            >
                              <FiEdit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteEvent(event._id, event.eventName)}
                              className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all duration-150"
                              title="Delete Event"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-secondary-200 bg-secondary-50">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-secondary-600">
                      Showing {indexOfFirstEvent + 1} to {Math.min(indexOfLastEvent, events.length)} of {events.length} events
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 text-sm font-medium text-secondary-600 bg-white border border-secondary-300 rounded-lg hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        const isCurrentPage = pageNumber === currentPage;
                        
                        // Show first page, last page, current page, and pages around current page
                        if (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => paginate(pageNumber)}
                              className={`px-3 py-2 text-sm font-medium rounded-lg ${
                                isCurrentPage
                                  ? 'bg-primary-600 text-white'
                                  : 'text-secondary-600 bg-white border border-secondary-300 hover:bg-secondary-50'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        } else if (
                          pageNumber === currentPage - 2 ||
                          pageNumber === currentPage + 2
                        ) {
                          return (
                            <span key={pageNumber} className="px-2 py-2 text-secondary-400">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                      
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 text-sm font-medium text-secondary-600 bg-white border border-secondary-300 rounded-lg hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center">
              <FiCalendar className="w-16 h-16 text-secondary-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                No events yet
              </h3>
              <p className="text-secondary-600 mb-6 max-w-md mx-auto">
                Get started by creating your first event for the AI & DS department. 
                You can add event details, upload images, and manage everything from here.
              </p>
              <Link to="/admin/events/create" className="btn-primary">
                <FiPlus className="w-4 h-4 mr-2" />
                Create Your First Event
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;