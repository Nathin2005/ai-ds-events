import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiUpload, FiX, FiCalendar, FiHome, FiUser, FiMail, FiPhone } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { mousAPI, uploadAPI } from '../../services/api';

const CreateMOU = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  
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

  const handleChange = (e) => {
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

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Company logo must be less than 5MB');
      return;
    }

    try {
      setUploadingLogo(true);
      const response = await uploadAPI.single(file);
      if (response.data.success) {
        setFormData(prev => ({
          ...prev,
          companyLogo: response.data.data.url
        }));
        toast.success('Company logo uploaded successfully');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload company logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleDocumentUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (10MB limit for documents)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('MOU document must be less than 10MB');
      return;
    }

    try {
      setUploadingDocument(true);
      const response = await uploadAPI.single(file);
      if (response.data.success) {
        setFormData(prev => ({
          ...prev,
          mouDocument: response.data.data.url
        }));
        toast.success('MOU document uploaded successfully');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload MOU document');
    } finally {
      setUploadingDocument(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.companyName.trim()) {
      toast.error('Please enter company name');
      return;
    }

    if (!formData.mouTitle.trim()) {
      toast.error('Please enter MOU title');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Please enter description');
      return;
    }

    if (!formData.signingDate) {
      toast.error('Please select signing date');
      return;
    }

    if (!formData.validUntil) {
      toast.error('Please select valid until date');
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

      const response = await mousAPI.create(mouData);
      
      if (response.data.success) {
        toast.success('MOU created successfully!');
        navigate('/admin/mous');
      }
    } catch (error) {
      console.error('Error creating MOU:', error);
      toast.error(error.response?.data?.message || 'Failed to create MOU');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/admin/mous"
            className="inline-flex items-center text-secondary-600 hover:text-primary-600 transition-colors duration-200 mb-6 font-medium"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to MOUs
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl font-display font-bold text-secondary-900 mb-2">
              Create New MOU
            </h1>
            <p className="text-lg text-secondary-600">
              Add a new memorandum of understanding
            </p>
          </motion.div>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="card p-8 shadow-lg"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-2xl font-semibold text-secondary-900 mb-6 flex items-center">
                <FiHome className="w-6 h-6 mr-3 text-primary-600" />
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter company name"
                    maxLength={100}
                  />
                  <p className="text-xs text-secondary-500 mt-1">
                    {formData.companyName.length}/100 characters
                  </p>
                </div>

                {/* MOU Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    MOU Title *
                  </label>
                  <input
                    type="text"
                    name="mouTitle"
                    required
                    value={formData.mouTitle}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter MOU title"
                    maxLength={200}
                  />
                  <p className="text-xs text-secondary-500 mt-1">
                    {formData.mouTitle.length}/200 characters
                  </p>
                </div>

                {/* Signing Date */}
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    Signing Date *
                  </label>
                  <input
                    type="date"
                    name="signingDate"
                    required
                    value={formData.signingDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                
                {/* Valid Until */}
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    Valid Until *
                  </label>
                  <input
                    type="date"
                    name="validUntil"
                    required
                    value={formData.validUntil}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Status */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="terminated">Terminated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Descriptions */}
            <div>
              <h2 className="text-2xl font-semibold text-secondary-900 mb-6">MOU Descriptions</h2>
              
              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-2">
                  MOU Description *
                </label>
                <textarea
                  name="description"
                  required
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  placeholder="Describe the MOU and its purpose in detail"
                />
              </div>
            </div>

            {/* Contact Person */}
            <div>
              <h2 className="text-2xl font-semibold text-secondary-900 mb-6 flex items-center">
                <FiUser className="w-6 h-6 mr-3 text-primary-600" />
                Contact Person
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="contactPerson.name"
                    value={formData.contactPerson.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    placeholder="Contact person name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    Designation
                  </label>
                  <input
                    type="text"
                    name="contactPerson.designation"
                    value={formData.contactPerson.designation}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    placeholder="Job title/designation"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="contactPerson.email"
                    value={formData.contactPerson.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    placeholder="email@company.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="contactPerson.phone"
                    value={formData.contactPerson.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    placeholder="+91 12345 67890"
                  />
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div>
              <h2 className="text-2xl font-semibold text-secondary-900 mb-6">Key Benefits</h2>
              <div className="space-y-4">
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) => handleBenefitChange(index, e.target.value)}
                      className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder={`Benefit ${index + 1}`}
                    />
                    {formData.benefits.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBenefit(index)}
                        className="p-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addBenefit}
                  className="btn-secondary"
                >
                  Add Another Benefit
                </button>
              </div>
            </div>

            {/* Company Logo */}
            <div>
              <h2 className="text-2xl font-semibold text-secondary-900 mb-6 flex items-center">
                <FiUpload className="w-6 h-6 mr-3 text-primary-600" />
                Company Logo
              </h2>
              
              <div className="border-2 border-dashed border-secondary-300 rounded-xl p-8 text-center">
                {formData.companyLogo ? (
                  <div className="space-y-4">
                    <img
                      src={formData.companyLogo}
                      alt="Company logo"
                      className="max-h-48 mx-auto object-contain rounded-lg shadow-md"
                    />
                    <p className="text-sm text-green-600 mb-4 font-medium">✅ Company logo uploaded successfully</p>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, companyLogo: '' }))}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Remove Logo
                    </button>
                  </div>
                ) : (
                  <div>
                    <FiUpload className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-secondary-700 mb-2">Upload Company Logo</h3>
                    <p className="text-secondary-500 mb-6">
                      Upload a clear logo of the company (JPG, PNG, WebP)
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                      disabled={uploadingLogo}
                    />
                    <label
                      htmlFor="logo-upload"
                      className="btn-primary cursor-pointer inline-flex items-center"
                    >
                      {uploadingLogo ? (
                        <>
                          <div className="loading-spinner mr-2"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <FiUpload className="w-4 h-4 mr-2" />
                          Choose Logo
                        </>
                      )}
                    </label>
                    <p className="text-xs text-secondary-400 mt-2">
                      Maximum file size: 5MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* MOU Document */}
            <div>
              <h2 className="text-2xl font-semibold text-secondary-900 mb-6">MOU Document (Optional)</h2>
              
              <div className="border-2 border-dashed border-secondary-300 rounded-xl p-8 text-center">
                {formData.mouDocument ? (
                  <div className="space-y-4">
                    <div className="text-green-600">
                      <FiUpload className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-lg font-semibold">✅ Document uploaded successfully</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, mouDocument: '' }))}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Remove Document
                    </button>
                  </div>
                ) : (
                  <div>
                    <FiUpload className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-secondary-700 mb-2">Upload MOU Document</h3>
                    <p className="text-secondary-500 mb-6">
                      Upload the official MOU document (PDF, DOC, DOCX)
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleDocumentUpload}
                      className="hidden"
                      id="document-upload"
                      disabled={uploadingDocument}
                    />
                    <label
                      htmlFor="document-upload"
                      className="btn-secondary cursor-pointer inline-flex items-center"
                    >
                      {uploadingDocument ? (
                        <>
                          <div className="loading-spinner mr-2"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <FiUpload className="w-4 h-4 mr-2" />
                          Choose Document
                        </>
                      )}
                    </label>
                    <p className="text-xs text-secondary-400 mt-2">
                      Maximum file size: 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-secondary-200">
              <Link
                to="/admin/mous"
                className="btn-secondary px-6 py-3"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || uploadingLogo || uploadingDocument}
                className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="loading-spinner mr-2"></div>
                    Creating MOU...
                  </div>
                ) : uploadingLogo || uploadingDocument ? (
                  <div className="flex items-center">
                    <div className="loading-spinner mr-2"></div>
                    Uploading Files...
                  </div>
                ) : (
                  'Create MOU'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateMOU;