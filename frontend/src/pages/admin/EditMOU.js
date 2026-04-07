import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiUpload, FiX, FiCalendar, FiHome, FiUser } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { mousAPI, uploadAPI } from '../../services/api';

const EditMOU = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    companyName: '',
    mouTitle: '',
    description: '',
    signingDate: '',
    validUntil: '',
    companyLogo: '',
    mouDocument: '',
    status: 'active',
    contactPerson: {
      name: '',
      designation: '',
      email: '',
      phone: ''
    },
    benefits: ['']
  });

  useEffect(() => {
    fetchMOU();
  }, [id]);

  const fetchMOU = async () => {
    try {
      setInitialLoading(true);
      const response = await mousAPI.getById(id);
      
      if (response.data.success) {
        const mou = response.data.data;
        setFormData({
          companyName: mou.companyName || '',
          mouTitle: mou.mouTitle || '',
          description: mou.description || '',
          signingDate: mou.signingDate ? new Date(mou.signingDate).toISOString().split('T')[0] : '',
          validUntil: mou.validUntil ? new Date(mou.validUntil).toISOString().split('T')[0] : '',
          companyLogo: mou.companyLogo || '',
          mouDocument: mou.mouDocument || '',
          status: mou.status || 'active',
          contactPerson: {
            name: mou.contactPerson?.name || '',
            designation: mou.contactPerson?.designation || '',
            email: mou.contactPerson?.email || '',
            phone: mou.contactPerson?.phone || ''
          },
          benefits: mou.benefits && mou.benefits.length > 0 ? mou.benefits : ['']
        });
      }
    } catch (error) {
      console.error('Error fetching MOU:', error);
      toast.error('Failed to fetch MOU details');
      navigate('/admin/mous');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('contactPerson.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        contactPerson: {
          ...prev.contactPerson,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleBenefitChange = (index, value) => {
    const newBenefits = [...formData.benefits];
    newBenefits[index] = value;
    setFormData(prev => ({
      ...prev,
      benefits: newBenefits
    }));
  };

  const addBenefit = () => {
    setFormData(prev => ({
      ...prev,
      benefits: [...prev.benefits, '']
    }));
  };

  const removeBenefit = (index) => {
    if (formData.benefits.length > 1) {
      const newBenefits = formData.benefits.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        benefits: newBenefits
      }));
    }
  };

  const handleImageUpload = async (file, type) => {
    try {
      setUploading(true);
      const response = await uploadAPI.single(file);
      
      if (response.data.success) {
        setFormData(prev => ({
          ...prev,
          [type]: response.data.data.secure_url
        }));
        toast.success(`${type === 'companyLogo' ? 'Company logo' : 'MOU document'} uploaded successfully`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.companyName || !formData.mouTitle || !formData.description || 
        !formData.signingDate || !formData.validUntil) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Filter out empty benefits
    const filteredBenefits = formData.benefits.filter(benefit => benefit.trim() !== '');

    try {
      setLoading(true);
      const mouData = {
        ...formData,
        benefits: filteredBenefits
      };

      const response = await mousAPI.update(id, mouData);
      
      if (response.data.success) {
        toast.success('MOU updated successfully!');
        navigate('/admin/mous');
      }
    } catch (error) {
      console.error('Error updating MOU:', error);
      toast.error(error.response?.data?.message || 'Failed to update MOU');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-8">
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="skeleton h-12 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <Link
              to="/admin/mous"
              className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-200 text-secondary-600 hover:text-primary-600"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-display font-bold text-secondary-900">
                Edit MOU
              </h1>
              <p className="text-secondary-600 mt-1">
                Update MOU details for {formData.companyName}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="card p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold text-secondary-900 mb-6 flex items-center">
                <FiHome className="w-5 h-5 mr-2 text-primary-600" />
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter company name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="terminated">Terminated</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  MOU Title *
                </label>
                <input
                  type="text"
                  name="mouTitle"
                  value={formData.mouTitle}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter MOU title"
                  required
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="input-field"
                  placeholder="Describe the MOU and its purpose"
                  required
                />
              </div>
            </div>

            {/* Dates */}
            <div>
              <h2 className="text-xl font-semibold text-secondary-900 mb-6 flex items-center">
                <FiCalendar className="w-5 h-5 mr-2 text-primary-600" />
                Important Dates
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Signing Date *
                  </label>
                  <input
                    type="date"
                    name="signingDate"
                    value={formData.signingDate}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Valid Until *
                  </label>
                  <input
                    type="date"
                    name="validUntil"
                    value={formData.validUntil}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contact Person */}
            <div>
              <h2 className="text-xl font-semibold text-secondary-900 mb-6 flex items-center">
                <FiUser className="w-5 h-5 mr-2 text-primary-600" />
                Contact Person
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="contactPerson.name"
                    value={formData.contactPerson.name}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Contact person name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Designation
                  </label>
                  <input
                    type="text"
                    name="contactPerson.designation"
                    value={formData.contactPerson.designation}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Job title/designation"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="contactPerson.email"
                    value={formData.contactPerson.email}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="email@company.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="contactPerson.phone"
                    value={formData.contactPerson.phone}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="+91 12345 67890"
                  />
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div>
              <h2 className="text-xl font-semibold text-secondary-900 mb-6">
                Key Benefits
              </h2>
              <div className="space-y-4">
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) => handleBenefitChange(index, e.target.value)}
                      className="input-field flex-1"
                      placeholder={`Benefit ${index + 1}`}
                    />
                    {formData.benefits.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBenefit(index)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addBenefit}
                  className="btn-secondary text-sm"
                >
                  Add Another Benefit
                </button>
              </div>
            </div>

            {/* File Uploads */}
            <div>
              <h2 className="text-xl font-semibold text-secondary-900 mb-6 flex items-center">
                <FiUpload className="w-5 h-5 mr-2 text-primary-600" />
                Documents & Images
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Logo */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Company Logo
                  </label>
                  <div className="border-2 border-dashed border-secondary-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                    {formData.companyLogo ? (
                      <div className="space-y-3">
                        <img
                          src={formData.companyLogo}
                          alt="Company logo"
                          className="max-h-32 mx-auto object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, companyLogo: '' }))}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove Logo
                        </button>
                      </div>
                    ) : (
                      <div>
                        <FiUpload className="w-8 h-8 text-secondary-400 mx-auto mb-2" />
                        <p className="text-sm text-secondary-600 mb-2">Upload company logo</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) handleImageUpload(file, 'companyLogo');
                          }}
                          className="hidden"
                          id="companyLogo"
                        />
                        <label htmlFor="companyLogo" className="btn-secondary text-sm cursor-pointer">
                          {uploading ? 'Uploading...' : 'Choose File'}
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* MOU Document */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    MOU Document (PDF)
                  </label>
                  <div className="border-2 border-dashed border-secondary-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                    {formData.mouDocument ? (
                      <div className="space-y-3">
                        <div className="text-green-600">
                          <FiUpload className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm">Document uploaded successfully</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, mouDocument: '' }))}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove Document
                        </button>
                      </div>
                    ) : (
                      <div>
                        <FiUpload className="w-8 h-8 text-secondary-400 mx-auto mb-2" />
                        <p className="text-sm text-secondary-600 mb-2">Upload MOU document</p>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) handleImageUpload(file, 'mouDocument');
                          }}
                          className="hidden"
                          id="mouDocument"
                        />
                        <label htmlFor="mouDocument" className="btn-secondary text-sm cursor-pointer">
                          {uploading ? 'Uploading...' : 'Choose File'}
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-secondary-200">
              <Link
                to="/admin/mous"
                className="btn-secondary"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || uploading}
                className="btn-primary"
              >
                {loading ? 'Updating MOU...' : 'Update MOU'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditMOU;