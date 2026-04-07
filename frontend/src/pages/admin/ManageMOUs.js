import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiFileText, FiCalendar, FiHome } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { mousAPI } from '../../services/api';
import { format } from 'date-fns';

const ManageMOUs = () => {
  const [mous, setMous] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [mousPerPage] = useState(20);

  useEffect(() => {
    fetchMOUs();
  }, []);

  const fetchMOUs = async () => {
    try {
      setLoading(true);
      const response = await mousAPI.getAll({ limit: 500 });
      if (response.data.success) {
        // Sort MOUs by signing date (newest first)
        const mousData = response.data.data.sort((a, b) => {
          return new Date(b.signingDate) - new Date(a.signingDate);
        });
        setMous(mousData);
      }
    } catch (error) {
      console.error('Error fetching MOUs:', error);
      toast.error('Failed to fetch MOUs');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMOU = async (mouId, companyName) => {
    if (window.confirm(`Are you sure you want to delete the MOU with "${companyName}"? This action cannot be undone.`)) {
      try {
        const response = await mousAPI.delete(mouId);
        if (response.data.success) {
          toast.success('MOU deleted successfully');
          fetchMOUs();
        }
      } catch (error) {
        console.error('Error deleting MOU:', error);
        toast.error(error.response?.data?.message || 'Failed to delete MOU');
      }
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

  // Pagination logic
  const indexOfLastMOU = currentPage * mousPerPage;
  const indexOfFirstMOU = indexOfLastMOU - mousPerPage;
  const currentMOUs = mous.slice(indexOfFirstMOU, indexOfLastMOU);
  const totalPages = Math.ceil(mous.length / mousPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
              Manage MOUs
            </h1>
            <p className="text-lg text-secondary-600">
              Manage memorandums of understanding and partnerships
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
              to="/admin/mous/create"
              className="btn-primary flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 transform"
            >
              <FiPlus className="w-5 h-5" />
              <span>Add New MOU</span>
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="card p-6 text-center hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FiFileText className="w-6 h-6 text-primary-600" />
            </div>
            <div className="text-2xl font-bold text-secondary-900 mb-1">{mous.length}</div>
            <div className="text-sm text-secondary-600">Total MOUs</div>
          </div>
          
          <div className="card p-6 text-center hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FiHome className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-secondary-900 mb-1">
              {mous.filter(m => m.status === 'active').length}
            </div>
            <div className="text-sm text-secondary-600">Active MOUs</div>
          </div>
          
          <div className="card p-6 text-center hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FiCalendar className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-secondary-900 mb-1">
              {mous.filter(m => m.status === 'expired').length}
            </div>
            <div className="text-sm text-secondary-600">Expired MOUs</div>
          </div>
          
          <div className="card p-6 text-center hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FiCalendar className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-secondary-900 mb-1">
              {new Date().getFullYear()}
            </div>
            <div className="text-sm text-secondary-600">Current Year</div>
          </div>
        </motion.div>

        {/* MOUs Management Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="card overflow-hidden shadow-lg"
        >
          <div className="p-6 border-b border-secondary-200 bg-white">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold text-secondary-900">
                  MOU Management
                </h2>
                <p className="text-secondary-600 mt-1">
                  Manage all department MOUs from here
                </p>
              </div>
              <Link
                to="/admin/mous/create"
                className="btn-secondary flex items-center space-x-2"
              >
                <FiPlus className="w-4 h-4" />
                <span>Add MOU</span>
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
          ) : mous.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                      Company Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                      MOU Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                      Dates & Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-secondary-200">
                  {currentMOUs.map((mou) => (
                    <tr key={mou._id} className="hover:bg-secondary-50 transition-all duration-200 hover:scale-[1.01] hover:shadow-sm">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {mou.companyLogo ? (
                            <img
                              src={mou.companyLogo}
                              alt={`${mou.companyName} logo`}
                              className="w-16 h-16 rounded-lg object-contain mr-4 shadow-sm bg-white p-2"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-secondary-100 flex items-center justify-center mr-4">
                              <FiHome className="w-8 h-8 text-secondary-400" />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-secondary-900 mb-1">
                              {mou.companyName}
                            </div>
                            {mou.contactPerson?.name && (
                              <div className="text-xs text-secondary-500">
                                Contact: {mou.contactPerson.name}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-secondary-900 mb-1 line-clamp-2">
                          {mou.mouTitle}
                        </div>
                        <div className="text-xs text-secondary-500 line-clamp-2">
                          {mou.description}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-secondary-900 mb-1">
                          Signed: {format(new Date(mou.signingDate), 'MMM dd, yyyy')}
                        </div>
                        <div className="text-xs text-secondary-600 mb-2">
                          Valid until: {format(new Date(mou.validUntil), 'MMM dd, yyyy')}
                        </div>
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(mou.status)}`}>
                          {mou.status.charAt(0).toUpperCase() + mou.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={`/mous`}
                            className="p-2 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded-lg transition-all duration-150"
                            title="View MOU"
                          >
                            <FiEye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/admin/mous/edit/${mou._id}`}
                            className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50 rounded-lg transition-all duration-150"
                            title="Edit MOU"
                          >
                            <FiEdit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteMOU(mou._id, mou.companyName)}
                            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all duration-150"
                            title="Delete MOU"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-secondary-200 bg-secondary-50">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-secondary-600">
                      Showing {indexOfFirstMOU + 1} to {Math.min(indexOfLastMOU, mous.length)} of {mous.length} MOUs
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
              <FiFileText className="w-16 h-16 text-secondary-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                No MOUs yet
              </h3>
              <p className="text-secondary-600 mb-6 max-w-md mx-auto">
                Get started by adding your first MOU. You can manage company partnerships 
                and collaborations from here.
              </p>
              <Link to="/admin/mous/create" className="btn-primary">
                <FiPlus className="w-4 h-4 mr-2" />
                Add Your First MOU
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ManageMOUs;