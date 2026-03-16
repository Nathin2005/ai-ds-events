import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMenu, FiX, FiCalendar, FiHome, FiClock, FiUser } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  // Navigation items as per PRD requirements
  const navItems = [
    { name: 'Home', path: '/', icon: FiHome },
    { name: 'Events', path: '/events', icon: FiCalendar },
    { name: 'Upcoming Events', path: '/events?filter=upcoming', icon: FiClock },
  ];

  const isActive = (path) => {
    if (path === '/events?filter=upcoming') {
      return location.pathname === '/events' && location.search === '?filter=upcoming';
    }
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white/95 backdrop-blur-sm border-b border-secondary-200 sticky top-0 z-50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - AI & DS Department */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-display font-bold text-xl text-secondary-900">
                AI & DS Events
              </span>
              <p className="text-xs text-secondary-500 -mt-1">Department Portal</p>
            </div>
          </Link>

          {/* Desktop Navigation Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'text-primary-600 bg-primary-50 shadow-sm'
                      : 'text-secondary-600 hover:text-primary-600 hover:bg-secondary-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* Admin Section */}
            <div className="ml-6 pl-6 border-l border-secondary-200">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-secondary-600 hover:text-primary-600 hover:bg-secondary-50 transition-all duration-200 font-medium"
                  >
                    <FiUser className="w-4 h-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="btn-secondary text-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/admin/login"
                  className="btn-primary text-sm"
                >
                  Admin Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-secondary-600 hover:text-primary-600 hover:bg-secondary-50 transition-colors duration-200"
            >
              {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-secondary-200 bg-white"
          >
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-secondary-600 hover:text-primary-600 hover:bg-secondary-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {/* Mobile Admin Section */}
              <div className="pt-3 mt-3 border-t border-secondary-200">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-secondary-600 hover:text-primary-600 hover:bg-secondary-50 transition-all duration-200 font-medium"
                    >
                      <FiUser className="w-5 h-5" />
                      <span>Admin Dashboard</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 rounded-lg text-secondary-600 hover:text-primary-600 hover:bg-secondary-50 transition-all duration-200 font-medium"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/admin/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 rounded-lg text-primary-600 font-semibold hover:bg-primary-50 transition-all duration-200"
                  >
                    Admin Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;