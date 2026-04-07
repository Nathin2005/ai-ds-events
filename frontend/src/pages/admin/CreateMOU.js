import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiUpload, FiX, FiCalendar, FiHome } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { mousAPI, uploadAPI } from '../../services/api';

const CreateMOU = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  
  const [formData, setFormData] = useState({
    companyName: '',
    mouTitle: '',
    description: '',
    signingDate: '',
    validUntil: '',
    companyLogo: '',
    mouPhotos: [],
    status: 'active',
    benefits: ['']
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate file sizes (5MB limit for images)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error('All MOU photos must be less than 5MB');
      return;
    }

    try {
      setUploadingPhotos(true);
      const response = await uploadAPI.multiple(files);
      if (response.data.success) {
        const newImages = response.data.data.map(img => img.url);
        setFormData(prev => ({
          ...prev,
          mouPhotos: [...prev.mouPhotos, ...newImages]
        }));
        toast.success(`${files.length} photos uploaded successfully`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload MOU photos');
    } finally {
      setUploadingPhotos(false);
    }
  };

  const removeMOUPhoto = (index) => {
    const updatedPhotos = formData.mouPhotos.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      mouPhotos: updatedPhotos
    }));
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

            {/* MOU Photos */}
            <div>
              <h2 className="text-2xl font-semibold text-secondary-900 mb-6">MOU Photos (Optional)</h2>
              
              <div className="border-2 border-dashed border-secondary-300 rounded-xl p-8">
                <div className="text-center mb-6">
                  <FiUpload className="w-12 h-12 text-secondary-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-secondary-700 mb-2">Upload MOU Photos</h3>
                  <p className="text-secondary-500 mb-4">
                    Add multiple photos related to the MOU signing or partnership (Max 5MB each)
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleDocumentUpload}
                    className="hidden"
                    id="photos-upload"
                    disabled={uploadingPhotos}
                  />
                  <label
                    htmlFor="photos-upload"
                    className="btn-secondary cursor-pointer inline-flex items-center"
                  >
                    {uploadingPhotos ? (
                      <>
                        <div className="loading-spinner mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FiUpload className="w-4 h-4 mr-2" />
                        Choose Photos
                      </>
                    )}
                  </label>
                  <p className="text-xs text-secondary-400 mt-2">
                    Maximum file size: 5MB per image
                  </p>
                </div>

                {formData.mouPhotos.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-secondary-700 mb-3">
                      MOU Photos ({formData.mouPhotos.length})
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.mouPhotos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={photo}
                            alt={`MOU Photo ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removeMOUPhoto(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                          >
                            <FiX className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
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
                disabled={loading || uploadingLogo || uploadingPhotos}
                className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="loading-spinner mr-2"></div>
                    Creating MOU...
                  </div>
                ) : uploadingLogo || uploadingPhotos ? (
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