import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiAward, FiPlus } from 'react-icons/fi';

const ManageAchievements = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg">
              <FiAward className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-display font-bold text-secondary-900 mb-4">
            Manage Awards & Achievements
          </h1>
          <p className="text-xl text-secondary-600 mb-8">
            This section is under development. Coming soon!
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link to="/admin" className="btn-secondary">
              Back to Dashboard
            </Link>
            <button className="btn-primary flex items-center space-x-2" disabled>
              <FiPlus className="w-5 h-5" />
              <span>Add Achievement (Coming Soon)</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ManageAchievements;