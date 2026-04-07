import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiCalendar, FiExternalLink, FiHome, FiClock, FiFilter } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { mousAPI } from '../services/api';
import { format } from 'date-fns';

const MOUs = () => {
  const [mous, setMous] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMOUs();
  }, [filter]);

  const fetchMOUs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter !== 'all') {
        params.status = filter;
      }
      
      const response = await mousAPI.getAll(params);
      if (response.data.success) {
        setMous(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching MOUs:', error);
      toast.error('Failed to fetch MOUs');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'terminated':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const filterOptions = [
    { value: 'all', label: 'All MOUs' },
    { value: 'active', label: 'Active' },
    { value: 'expired', label: 'Expired' },
    { value: 'terminated', label: 'Terminated' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg">
              <FiFileText className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary-900 mb-4">
            Memorandums of Understanding
          </h1>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto leading-relaxed">
            Explore our strategic partnerships and collaborations with industry leaders, 
            fostering innovation and opportunities for our AI & DS community.
          </p>
        </motion.div>

        {/* Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <FiFilter className="w-5 h-5 text-secondary-600" />
              <span className="text-secondary-700 font-medium">Filter by Status:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    filter === option.value
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-white text-secondary-600 hover:bg-primary-50 hover:text-primary-600 border border-secondary-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* MOUs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="card p-6">
                <div className="skeleton w-full h-48 mb-4 rounded-lg"></div>
                <div className="skeleton h-6 mb-2"></div>
                <div className="skeleton h-4 w-2/3 mb-4"></div>
                <div className="skeleton h-4 w-1/2"></div>
              </div>
            ))}
          </div>
        ) : mous.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mous.map((mou, index) => (
              <motion.div
                key={mou._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="card overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Company Logo */}
                {mou.companyLogo && (
                  <div className="h-48 bg-gradient-to-br from-secondary-100 to-secondary-200 flex items-center justify-center p-6">
                    <img
                      src={mou.companyLogo}
                      alt={`${mou.companyName} logo`}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(mou.currentStatus || mou.status)}`}>
                      {(mou.currentStatus || mou.status).charAt(0).toUpperCase() + (mou.currentStatus || mou.status).slice(1)}
                    </span>
                    <div className="flex items-center text-secondary-500 text-sm">
                      <FiCalendar className="w-4 h-4 mr-1" />
                      {format(new Date(mou.signingDate), 'MMM yyyy')}
                    </div>
                  </div>

                  {/* Company Name */}
                  <div className="flex items-center mb-3">
                    <FiHome className="w-5 h-5 text-primary-600 mr-2" />
                    <h3 className="text-xl font-bold text-secondary-900">
                      {mou.companyName}
                    </h3>
                  </div>

                  {/* MOU Title */}
                  <h4 className="text-lg font-semibold text-secondary-800 mb-3 line-clamp-2">
                    {mou.mouTitle}
                  </h4>

                  {/* Description */}
                  <p className="text-secondary-600 mb-4 line-clamp-3">
                    {mou.description}
                  </p>

                  {/* Validity */}
                  <div className="flex items-center text-secondary-500 text-sm mb-4">
                    <FiClock className="w-4 h-4 mr-1" />
                    <span>Valid until: {format(new Date(mou.validUntil), 'MMM dd, yyyy')}</span>
                  </div>

                  {/* Benefits */}
                  {mou.benefits && mou.benefits.length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-sm font-semibold text-secondary-700 mb-2">Key Benefits:</h5>
                      <ul className="text-sm text-secondary-600 space-y-1">
                        {mou.benefits.slice(0, 3).map((benefit, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            <span className="line-clamp-1">{benefit}</span>
                          </li>
                        ))}
                        {mou.benefits.length > 3 && (
                          <li className="text-primary-600 text-xs">
                            +{mou.benefits.length - 3} more benefits
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Contact Person */}
                  {mou.contactPerson?.name && (
                    <div className="text-sm text-secondary-600 mb-4">
                      <strong>Contact:</strong> {mou.contactPerson.name}
                      {mou.contactPerson.designation && (
                        <span className="block text-xs text-secondary-500">
                          {mou.contactPerson.designation}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Document Link */}
                  {mou.mouDocument && (
                    <a
                      href={mou.mouDocument}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors duration-200"
                    >
                      <FiExternalLink className="w-4 h-4 mr-1" />
                      View MOU Document
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <FiFileText className="w-16 h-16 text-secondary-400 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-secondary-900 mb-2">
              No MOUs Found
            </h3>
            <p className="text-secondary-600 max-w-md mx-auto">
              {filter === 'all' 
                ? "We haven't established any MOUs yet. Check back soon for updates on our partnerships."
                : `No ${filter} MOUs found. Try adjusting your filter or check back later.`
              }
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MOUs;