import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiUpload, FiCalendar, FiUser, FiBookOpen, FiAward } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { nptelAPI, uploadAPI } from '../../services/api';

const CreateNPTEL = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    courseName: '',
    category: 'student',
    participantName: '',
    participantId: '',
    department: 'AI & DS',
    year: new Date().getFullYear(),
    completionDate: '',
    score: '',
    certificateImage: '',
    duration: '',
    institution: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (file) => {
    try {
      setUploading(true);
      const response = await uploadAPI.single(file);
      
      if (response.data.success) {
        setFormData(prev => ({
          ...prev,
          certificateImage: response.data.data.secure_url
        }));
        toast.success('Certificate image uploaded successfully');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload certificate image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.courseName || !formData.participantName || !formData.completionDate || !formData.certificateImage) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const response = await nptelAPI.create(formData);
      
      if (response.data.success) {
        toast.success('NPTEL certification created successfully!');
        navigate('/admin/nptel');
      }
    } catch (error) {
      console.error('Error creating NPTEL certification:', error);
      toast.error(error.response?.data?.message || 'Failed to create NPTEL certification');
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

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
              to="/admin/nptel"
              className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-200 text-secondary-600 hover:text-primary-600"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-display font-bold text-secondary-900">
                Add NPTEL Certification
              </h1>
              <p className="text-secondary-600 mt-1">
                Add a new NPTEL course certification
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
            {/* Course Information */}
            <div>
              <h2 className="text-xl font-semibold text-secondary-900 mb-6 flex items-center">
                <FiBookOpen className="w-5 h-5 mr-2 text-primary-600" />
                Course Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Course Name *
                  </label>
                  <input
                    type="text"
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter NPTEL course name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Institution
                  </label>
                  <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Institution offering the course"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., 12 weeks"
                  />
                </div>
              </div>
            </div>

            {/* Participant Information */}
            <div>
              <h2 className="text-xl font-semibold text-secondary-900 mb-6 flex items-center">
                <FiUser className="w-5 h-5 mr-2 text-primary-600" />
                Participant Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Participant Name *
                  </label>
                  <input
                    type="text"
                    name="participantName"
                    value={formData.participantName}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Full name of participant"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    {formData.category === 'student' ? 'Roll Number' : 'Employee ID'}
                  </label>
                  <input
                    type="text"
                    name="participantId"
                    value={formData.participantId}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder={formData.category === 'student' ? 'Student roll number' : 'Faculty employee ID'}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Department name"
                  />
                </div>
              </div>
            </div>

            {/* Certification Details */}
            <div>
              <h2 className="text-xl font-semibold text-secondary-900 mb-6 flex items-center">
                <FiAward className="w-5 h-5 mr-2 text-primary-600" />
                Certification Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Completion Date *
                  </label>
                  <input
                    type="date"
                    name="completionDate"
                    value={formData.completionDate}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Year *
                  </label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Score (%)
                  </label>
                  <input
                    type="number"
                    name="score"
                    value={formData.score}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter percentage score"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>

            {/* Certificate Image */}
            <div>
              <h2 className="text-xl font-semibold text-secondary-900 mb-6 flex items-center">
                <FiUpload className="w-5 h-5 mr-2 text-primary-600" />
                Certificate Image *
              </h2>
              <div className="border-2 border-dashed border-secondary-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors">
                {formData.certificateImage ? (
                  <div className="space-y-4">
                    <img
                      src={formData.certificateImage}
                      alt="Certificate"
                      className="max-h-64 mx-auto object-contain rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, certificateImage: '' }))}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Remove Certificate Image
                    </button>
                  </div>
                ) : (
                  <div>
                    <FiUpload className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                    <p className="text-lg text-secondary-600 mb-2">Upload Certificate Image</p>
                    <p className="text-sm text-secondary-500 mb-4">
                      Upload a clear image of the NPTEL certificate (JPG, PNG, PDF)
                    </p>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) handleImageUpload(file);
                      }}
                      className="hidden"
                      id="certificateImage"
                    />
                    <label htmlFor="certificateImage" className="btn-primary cursor-pointer">
                      {uploading ? 'Uploading...' : 'Choose Certificate Image'}
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-secondary-200">
              <Link
                to="/admin/nptel"
                className="btn-secondary"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || uploading}
                className="btn-primary"
              >
                {loading ? 'Creating Certification...' : 'Create Certification'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateNPTEL;