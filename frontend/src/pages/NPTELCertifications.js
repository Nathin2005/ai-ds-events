import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiUser, FiUsers, FiAward, FiCalendar, FiStar, FiFilter, FiBookOpen } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { nptelAPI } from '../services/api';
import { format } from 'date-fns';

const NPTELCertifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [filter, setFilter] = useState({
    category: 'all',
    year: 'all',
    grade: 'all'
  });

  useEffect(() => {
    fetchCertifications();
    fetchStats();
  }, [activeTab, filter]);

  const fetchCertifications = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (activeTab !== 'all') {
        params.category = activeTab;
      }
      if (filter.year !== 'all') {
        params.year = filter.year;
      }
      if (filter.grade !== 'all') {
        params.grade = filter.grade;
      }
      
      const response = await nptelAPI.getAll(params);
      if (response.data.success) {
        setCertifications(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching NPTEL certifications:', error);
      toast.error('Failed to fetch NPTEL certifications');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await nptelAPI.getStats();
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'Elite + Gold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Elite':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Successfully Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getGradeIcon = (grade) => {
    switch (grade) {
      case 'Elite + Gold':
        return '🏆';
      case 'Elite':
        return '🥇';
      case 'Successfully Completed':
        return '✅';
      default:
        return '📜';
    }
  };

  const tabs = [
    { id: 'all', label: 'All Certifications', icon: FiBookOpen },
    { id: 'faculty', label: 'Faculty', icon: FiUser },
    { id: 'student', label: 'Students', icon: FiUsers }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

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
              <FiTrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary-900 mb-4">
            NPTEL Certifications
          </h1>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto leading-relaxed">
            Celebrating our faculty and students' achievements in online learning through 
            NPTEL courses and certifications.
          </p>
        </motion.div>

        {/* Statistics Cards */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <div className="card p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FiBookOpen className="w-6 h-6 text-primary-600" />
              </div>
              <div className="text-2xl font-bold text-secondary-900 mb-1">{stats.total}</div>
              <div className="text-sm text-secondary-600">Total Certifications</div>
            </div>
            
            <div className="card p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FiUser className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-secondary-900 mb-1">{stats.faculty}</div>
              <div className="text-sm text-secondary-600">Faculty Certifications</div>
            </div>
            
            <div className="card p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FiUsers className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-secondary-900 mb-1">{stats.student}</div>
              <div className="text-sm text-secondary-600">Student Certifications</div>
            </div>
            
            <div className="card p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FiStar className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-secondary-900 mb-1">{stats.currentYear}</div>
              <div className="text-sm text-secondary-600">This Year</div>
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center mb-8"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 mx-1 mb-2 ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-white text-secondary-600 hover:bg-primary-50 hover:text-primary-600 border border-secondary-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="card p-6 mb-8"
        >
          <div className="flex items-center mb-4">
            <FiFilter className="w-5 h-5 text-secondary-600 mr-2" />
            <span className="text-secondary-700 font-medium">Filters:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">Year</label>
              <select
                value={filter.year}
                onChange={(e) => setFilter({ ...filter, year: e.target.value })}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">Grade</label>
              <select
                value={filter.grade}
                onChange={(e) => setFilter({ ...filter, grade: e.target.value })}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Grades</option>
                <option value="Elite + Gold">Elite + Gold</option>
                <option value="Elite">Elite</option>
                <option value="Successfully Completed">Successfully Completed</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => setFilter({ category: 'all', year: 'all', grade: 'all' })}
                className="w-full btn-secondary"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </motion.div>

        {/* Certifications Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="card p-6">
                <div className="skeleton w-full h-48 mb-4 rounded-lg"></div>
                <div className="skeleton h-6 mb-2"></div>
                <div className="skeleton h-4 w-2/3 mb-4"></div>
                <div className="skeleton h-4 w-1/2"></div>
              </div>
            ))}
          </div>
        ) : certifications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="card overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Certificate Image */}
                <div className="h-48 bg-gradient-to-br from-secondary-100 to-secondary-200 overflow-hidden">
                  <img
                    src={cert.certificateImage}
                    alt={`${cert.courseName} certificate`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="p-6">
                  {/* Grade Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getGradeColor(cert.grade)}`}>
                      {getGradeIcon(cert.grade)} {cert.grade}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      cert.category === 'faculty' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {cert.category.charAt(0).toUpperCase() + cert.category.slice(1)}
                    </span>
                  </div>

                  {/* Course Name */}
                  <h3 className="text-lg font-bold text-secondary-900 mb-2 line-clamp-2">
                    {cert.courseName}
                  </h3>

                  {/* Participant Info */}
                  <div className="mb-3">
                    <p className="text-secondary-800 font-semibold">{cert.participantName}</p>
                    {cert.participantId && (
                      <p className="text-sm text-secondary-600">{cert.participantId}</p>
                    )}
                    {cert.semester && (
                      <p className="text-sm text-secondary-600">Semester: {cert.semester}</p>
                    )}
                  </div>

                  {/* Course Details */}
                  <div className="space-y-2 mb-4">
                    {cert.courseCode && (
                      <div className="text-sm text-secondary-600">
                        <strong>Course Code:</strong> {cert.courseCode}
                      </div>
                    )}
                    {cert.instructor && (
                      <div className="text-sm text-secondary-600">
                        <strong>Instructor:</strong> {cert.instructor}
                      </div>
                    )}
                    {cert.institution && (
                      <div className="text-sm text-secondary-600">
                        <strong>Institution:</strong> {cert.institution}
                      </div>
                    )}
                    {cert.duration && (
                      <div className="text-sm text-secondary-600">
                        <strong>Duration:</strong> {cert.duration}
                      </div>
                    )}
                  </div>

                  {/* Score */}
                  {cert.score && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-secondary-600">Score</span>
                        <span className="font-semibold text-secondary-900">{cert.score}%</span>
                      </div>
                      <div className="w-full bg-secondary-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${cert.score}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Completion Date */}
                  <div className="flex items-center text-secondary-500 text-sm">
                    <FiCalendar className="w-4 h-4 mr-1" />
                    <span>Completed: {format(new Date(cert.completionDate), 'MMM dd, yyyy')}</span>
                  </div>

                  {/* Certificate Number */}
                  {cert.certificateNumber && (
                    <div className="mt-2 text-xs text-secondary-500">
                      Certificate: {cert.certificateNumber}
                    </div>
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
            <FiTrendingUp className="w-16 h-16 text-secondary-400 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-secondary-900 mb-2">
              No Certifications Found
            </h3>
            <p className="text-secondary-600 max-w-md mx-auto">
              {activeTab === 'all' 
                ? "No NPTEL certifications found. Check back soon for updates."
                : `No ${activeTab} certifications found. Try adjusting your filters or check back later.`
              }
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NPTELCertifications;