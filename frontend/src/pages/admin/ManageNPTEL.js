import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiPlus } from 'react-icons/fi';

const ManageNPTEL = () => {
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
              Manage NPTEL Certifications
            </h1>
            <p className="text-lg text-secondary-600">
              Manage faculty and student NPTEL course certifications
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Link
              to="/admin"
              className="btn-secondary"
            >
              Back to Dashboard
            </Link>
            <Link
              to="/admin/nptel/create"
              className="btn-primary flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 transform"
            >
              <FiPlus className="w-5 h-5" />
              <span>Add Certification</span>
            </Link>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="card p-12 text-center"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg">
              <FiTrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
            NPTEL Certification Management
          </h2>
          <p className="text-secondary-600 mb-8 max-w-2xl mx-auto">
            Add and manage NPTEL course certifications for faculty and students. 
            Track completion rates, scores, and achievements in online learning.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link to="/admin/nptel/create" className="btn-primary flex items-center space-x-2">
              <FiPlus className="w-5 h-5" />
              <span>Add Your First Certification</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ManageNPTEL;