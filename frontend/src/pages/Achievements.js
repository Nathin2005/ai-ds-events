import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiUser, FiUsers, FiFolder, FiCalendar, FiTrendingUp, FiFilter, FiStar, FiMapPin } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { achievementsAPI } from '../services/api';
import { format } from 'date-fns';

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [filter, setFilter] = useState({
    type: 'all',
    level: 'all',
    year: 'all'
  });

  useEffect(() => {
    fetchAchievements();
    fetchStats();
  }, [activeTab, filter]);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (activeTab !== 'all') {
        params.category = activeTab;
      }
      if (filter.type !== 'all') {
        params.type = filter.type;
      }
      if (filter.level !== 'all') {
        params.level = filter.level;
      }
      if (filter.year !== 'all') {
        params.year = filter.year;
      }
      
      const response = await achievementsAPI.getAll(params);
      if (response.data.success) {
        setAchievements(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
      toast.error('Failed to fetch achievements');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await achievementsAPI.getStats();
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'international':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'national':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'state':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'regional':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'institutional':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-secondary-100 text-secondary-800 border-secondary-200';
    }
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 'international':
        return '🌍';
      case 'national':
        return '🇮🇳';
      case 'state':
        return '🏛️';
      case 'regional':
        return '🏘️';
      case 'institutional':
        return '🏫';
      default:
        return '🏆';
    }
  };

  const getPositionColor = (position) => {
    switch (position) {
      case '1st':
        return 'bg-yellow-100 text-yellow-800';
      case '2nd':
        return 'bg-gray-100 text-gray-800';
      case '3rd':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getPositionIcon = (position) => {
    switch (position) {
      case '1st':
        return '🥇';
      case '2nd':
        return '🥈';
      case '3rd':
        return '🥉';
      case 'special_mention':
        return '⭐';
      default:
        return '🏆';
    }
  };

  const tabs = [
    { id: 'all', label: 'All Achievements', icon: FiAward },
    { id: 'faculty', label: 'Faculty', icon: FiUser },
    { id: 'student', label: 'Students', icon: FiUsers },
    { id: 'project', label: 'Projects', icon: FiFolder }
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
              <FiAward className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary-900 mb-4">
            Awards & Achievements
          </h1>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto leading-relaxed">
            Celebrating the outstanding accomplishments of our faculty, students, and projects 
            in various competitions, research, and academic pursuits.
          </p>
        </motion.div>

        {/* Statistics Cards */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
          >
            <div className="card p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FiAward className="w-6 h-6 text-primary-600" />
              </div>
              <div className="text-2xl font-bold text-secondary-900 mb-1">{stats.total}</div>
              <div className="text-sm text-secondary-600">Total Achievements</div>
            </div>
            
            <div className="card p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FiUser className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-secondary-900 mb-1">{stats.faculty}</div>
              <div className="text-sm text-secondary-600">Faculty Achievements</div>
            </div>
            
            <div className="card p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FiUsers className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-secondary-900 mb-1">{stats.student}</div>
              <div className="text-sm text-secondary-600">Student Achievements</div>
            </div>
            
            <div className="card p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FiFolder className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-secondary-900 mb-1">{stats.project}</div>
              <div className="text-sm text-secondary-600">Project Achievements</div>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">Type</label>
              <select
                value={filter.type}
                onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Types</option>
                <option value="award">Award</option>
                <option value="recognition">Recognition</option>
                <option value="publication">Publication</option>
                <option value="patent">Patent</option>
                <option value="competition">Competition</option>
                <option value="research">Research</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">Level</label>
              <select
                value={filter.level}
                onChange={(e) => setFilter({ ...filter, level: e.target.value })}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Levels</option>
                <option value="international">International</option>
                <option value="national">National</option>
                <option value="state">State</option>
                <option value="regional">Regional</option>
                <option value="institutional">Institutional</option>
              </select>
            </div>
            
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
            
            <div className="flex items-end">
              <button
                onClick={() => setFilter({ type: 'all', level: 'all', year: 'all' })}
                className="w-full btn-secondary"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </motion.div>

        {/* Achievements Grid */}
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
        ) : achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="card overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Certificate/Achievement Image */}
                {achievement.certificateImage && (
                  <div className="h-48 bg-gradient-to-br from-secondary-100 to-secondary-200 overflow-hidden">
                    <img
                      src={achievement.certificateImage}
                      alt={achievement.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  {/* Badges */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getLevelColor(achievement.level)}`}>
                      {getLevelIcon(achievement.level)} {achievement.level.charAt(0).toUpperCase() + achievement.level.slice(1)}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        achievement.category === 'faculty' 
                          ? 'bg-blue-100 text-blue-800' 
                          : achievement.category === 'student'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {achievement.category.charAt(0).toUpperCase() + achievement.category.slice(1)}
                      </span>
                      {achievement.prize?.position && achievement.prize.position !== 'participation' && (
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPositionColor(achievement.prize.position)}`}>
                          {getPositionIcon(achievement.prize.position)} {achievement.prize.position}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-secondary-900 mb-2 line-clamp-2">
                    {achievement.title}
                  </h3>

                  {/* Achiever Info */}
                  <div className="mb-3">
                    <p className="text-secondary-800 font-semibold">{achievement.achievedBy}</p>
                    {achievement.achieverId && (
                      <p className="text-sm text-secondary-600">{achievement.achieverId}</p>
                    )}
                  </div>

                  {/* Co-achievers */}
                  {achievement.coAchievers && achievement.coAchievers.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm text-secondary-600">
                        <strong>Team:</strong> {achievement.coAchievers.map(ca => ca.name).join(', ')}
                      </p>
                    </div>
                  )}

                  {/* Mentor */}
                  {achievement.mentor?.name && (
                    <div className="mb-3">
                      <p className="text-sm text-secondary-600">
                        <strong>Mentor:</strong> {achievement.mentor.name}
                        {achievement.mentor.designation && ` (${achievement.mentor.designation})`}
                      </p>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-secondary-600 mb-4 line-clamp-3 text-sm">
                    {achievement.description}
                  </p>

                  {/* Awarding Body */}
                  <div className="mb-3">
                    <p className="text-sm text-secondary-600">
                      <strong>Awarded by:</strong> {achievement.awardingBody}
                    </p>
                  </div>

                  {/* Prize Amount */}
                  {achievement.prize?.amount && (
                    <div className="mb-3">
                      <p className="text-sm text-secondary-600">
                        <strong>Prize:</strong> {achievement.prize.currency} {achievement.prize.amount.toLocaleString()}
                      </p>
                    </div>
                  )}

                  {/* Achievement Date */}
                  <div className="flex items-center text-secondary-500 text-sm mb-2">
                    <FiCalendar className="w-4 h-4 mr-1" />
                    <span>Achieved: {format(new Date(achievement.achievementDate), 'MMM dd, yyyy')}</span>
                  </div>

                  {/* Type */}
                  <div className="text-xs text-secondary-500">
                    Type: {achievement.type.charAt(0).toUpperCase() + achievement.type.slice(1)}
                  </div>

                  {/* Tags */}
                  {achievement.tags && achievement.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {achievement.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full">
                          #{tag}
                        </span>
                      ))}
                      {achievement.tags.length > 3 && (
                        <span className="px-2 py-1 bg-secondary-100 text-secondary-600 text-xs rounded-full">
                          +{achievement.tags.length - 3}
                        </span>
                      )}
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
            <FiAward className="w-16 h-16 text-secondary-400 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-secondary-900 mb-2">
              No Achievements Found
            </h3>
            <p className="text-secondary-600 max-w-md mx-auto">
              {activeTab === 'all' 
                ? "No achievements found. Check back soon for updates on our accomplishments."
                : `No ${activeTab} achievements found. Try adjusting your filters or check back later.`
              }
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Achievements;