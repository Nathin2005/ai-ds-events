import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiMapPin, FiGithub, FiLinkedin, FiInstagram } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Department Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <div>
                <span className="font-display font-bold text-xl">AI & DS Department</span>
                <p className="text-secondary-300 text-sm">Event Management System</p>
              </div>
            </div>
            <p className="text-secondary-300 mb-6 max-w-md leading-relaxed">
              Artificial Intelligence & Data Science Department - Fostering innovation 
              through cutting-edge technology education, research, and development of 
              skilled professionals for the digital future.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-secondary-300">
                <FiMapPin className="w-4 h-4 text-primary-400" />
                <span>Kumaran Kottam Campus, Kannampalayam, Sulur, Coimbatore - 641 402</span>
              </div>
              <div className="flex items-center space-x-3 text-secondary-300">
                <FiMail className="w-4 h-4 text-primary-400" />
                <span>principalcet@rvsgroup.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="text-secondary-300 hover:text-white transition-colors duration-200 flex items-center"
                >
                  🏠 Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/events" 
                  className="text-secondary-300 hover:text-white transition-colors duration-200 flex items-center"
                >
                  📅 All Events
                </Link>
              </li>
              <li>
                <Link 
                  to="/events?filter=upcoming" 
                  className="text-secondary-300 hover:text-white transition-colors duration-200 flex items-center"
                >
                  🕒 Upcoming Events
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/login" 
                  className="text-secondary-300 hover:text-white transition-colors duration-200 flex items-center"
                >
                  🔐 Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Academic Focus Areas */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-white">Focus Areas</h3>
            <ul className="space-y-3 text-secondary-300 text-sm">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                Artificial Intelligence
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                Machine Learning
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                Data Science
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                Deep Learning
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                Computer Vision
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                Natural Language Processing
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-secondary-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-secondary-400 text-sm">
              © {currentYear} AI & DS Department. All rights reserved.
            </p>
            <p className="text-secondary-500 text-xs mt-1">
              Built with ❤️ for the AI & DS community
            </p>
          </div>
          
          {/* Social Links */}
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-secondary-400 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-secondary-800"
              aria-label="GitHub"
            >
              <FiGithub className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-secondary-400 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-secondary-800"
              aria-label="LinkedIn"
            >
              <FiLinkedin className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-secondary-400 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-secondary-800"
              aria-label="Instagram"
            >
              <FiInstagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;