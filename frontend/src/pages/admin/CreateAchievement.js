import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiUpload, FiX, FiCalendar, FiUser, FiAward, FiStar } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { achievementsAPI, uploadAPI } from '../../services/api';

const CreateAchievement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'student',
    type: 'award',
    description: '',
    achievedBy: '',
    achieverId: '',
    coAchievers: [{ name: '', id: '', role: '' }],
    mentor: {
      name: '',
      designation: ''
    },
    awardingBody: '',
    achievementDate: '',
    level: 'institutional',
    prize: {
      position: 'participation',
      amount: '',
      currency: 'INR'
    },
    certificateImage: '',
    additionalImages: [],
    documentUrl: '',
    tags: [''],
    year: new Date().getFullYear(),
    isPublished: true
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('mentor.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        mentor: {
          ...prev.mentor,
          [field]: value
        }
      }));
    } else if (name.startsWith('prize.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        prize: {
          ...prev.prize,
          [field]: field === 'amount' ? (value ? parseFloat(value) : '') : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleCoAchieverChange = (index, field, value) => {
    const newCoAchievers = [...formData.coAchievers];
    newCoAchievers[index] = {
      ...newCoAchievers[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      coAchievers: newCoAchievers
    }));
  };

  const addCoAchiever = () => {
    setFormData(prev => ({
      ...prev,
      coAchievers: [...prev.coAchievers, { name: '', id: '', role: '' }]
    }));
  };

  const removeCoAchiever = (index) => {
    if (formData.coAchievers.length > 1) {
      const newCoAchievers = formData.coAchievers.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        coAchievers: newCoAchievers
      }));
    }
  };

  const handleTagChange = (index, value) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData(prev => ({
      ...prev,
      tags: newTags
    }));
  };

  const addTag = () => {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, '']
    }));
  };

  const removeTag = (index) => {
    if (formData.tags.length > 1) {
      const newTags = formData.tags.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        tags: newTags
      }));
    }
  };

  const handleImageUpload = async (file, type) => {
    try {
      setUploading(true);
      const response = await uploadAPI.single(file);
      
      if (response.data.success) {
        if (type === 'certificate') {
          setFormData(prev => ({
            ...prev,
            certificateImage: response.data.data.secure_url
          }));
        } else if (type === 'additional') {
          setFormData(prev => ({
            ...prev,
            additionalImages: [...prev.additionalImages, response.data.data.secure_url]
          }));
        } else if (type === 'document') {
          setFormData(prev => ({
            ...prev,
            documentUrl: response.data.data.secure_url
          }));
        }
        toast.success('File uploaded successfully');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const removeAdditionalImage = (index) => {
    const newImages = formData.additionalImages.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      additionalImages: newImages
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.achievedBy || !formData.awardingBody || !formData.achievementDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Filter out empty co-achievers and tags
    const filteredCoAchievers = formData.coAchievers.filter(ca => ca.name.trim() !== '');
    const filteredTags = formData.tags.filter(tag => tag.trim() !== '');

    try {
      setLoading(true);
      const achievementData = {
        ...formData,
        coAchievers: filteredCoAchievers,
        tags: filteredTags
      };

      const response = await achievementsAPI.create(achievementData);
      
      if (response.data.success) {
        toast.success('Achievement created successfully!');
        navigate('/admin/achievements');
      }
    } catch (error) {
      console.error('Error creating achievement:', error);
      toast.error(error.response?.data?.message || 'Failed to create achievement');
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
              to="/admin/achievements"
              className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-200 text-secondary-600 hover:text-primary-600"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-display font-bold text-secondary-900">
                Add New Achievement
              </h1>
              <p className="text-secondary-600 mt-1">
                Record a new award or achievement
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
                <FiAward className="w-5 h-5 mr-2 text-primary-600" />
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Achievement Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter achievement title"
                    required
                  />
                </div>
                
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
                    <option value="project">Project</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
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
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Level *
                  </label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    <option value="international">International</option>
                    <option value="national">National</option>
                    <option value="state">State</option>
                    <option value="regional">Regional</option>
                    <option value="institutional">Institutional</option>
                  </select>
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
                  placeholder="Describe the achievement in detail"
                  required
                />
              </div>
            </div>

            {/* Achiever Information */}
            <div>
              <h2 className="text-xl font-semibold text-secondary-900 mb-6 flex items-center">
                <FiUser className="w-5 h-5 mr-2 text-primary-600" />
                Achiever Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Primary Achiever Name *
                  </label>
                  <input
                    type="text"
                    name="achievedBy"
                    value={formData.achievedBy}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Name of the main achiever"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    {formData.category === 'student' ? 'Roll Number' : formData.category === 'faculty' ? 'Employee ID' : 'Project ID'}
                  </label>
                  <input
                    type="text"
                    name="achieverId"
                    value={formData.achieverId}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder={`Enter ${formData.category === 'student' ? 'roll number' : formData.category === 'faculty' ? 'employee ID' : 'project ID'}`}
                  />
                </div>
              </div>

              {/* Co-Achievers */}
              <div className="mt-6">
                <h3 className="text-lg font-medium text-secondary-900 mb-4">Co-Achievers (Team Members)</h3>
                <div className="space-y-4">
                  {formData.coAchievers.map((coAchiever, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-secondary-200 rounded-lg">
                      <div>
                        <input
                          type="text"
                          value={coAchiever.name}
                          onChange={(e) => handleCoAchieverChange(index, 'name', e.target.value)}
                          className="input-field"
                          placeholder="Name"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={coAchiever.id}
                          onChange={(e) => handleCoAchieverChange(index, 'id', e.target.value)}
                          className="input-field"
                          placeholder="ID/Roll No"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={coAchiever.role}
                          onChange={(e) => handleCoAchieverChange(index, 'role', e.target.value)}
                          className="input-field"
                          placeholder="Role"
                        />
                      </div>
                      <div className="flex items-center">
                        {formData.coAchievers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCoAchiever(index)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addCoAchiever}
                    className="btn-secondary text-sm"
                  >
                    Add Co-Achiever
                  </button>
                </div>
              </div>

              {/* Mentor Information */}
              <div className="mt-6">
                <h3 className="text-lg font-medium text-secondary-900 mb-4">Mentor/Guide Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Mentor Name
                    </label>
                    <input
                      type="text"
                      name="mentor.name"
                      value={formData.mentor.name}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Mentor/guide name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Designation
                    </label>
                    <input
                      type="text"
                      name="mentor.designation"
                      value={formData.mentor.designation}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Mentor designation"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Award Details */}
            <div>
              <h2 className="text-xl font-semibold text-secondary-900 mb-6 flex items-center">
                <FiStar className="w-5 h-5 mr-2 text-primary-600" />
                Award Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Awarding Body *
                  </label>
                  <input
                    type="text"
                    name="awardingBody"
                    value={formData.awardingBody}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Organization that gave the award"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Achievement Date *
                  </label>
                  <input
                    type="date"
                    name="achievementDate"
                    value={formData.achievementDate}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Position/Rank
                  </label>
                  <select
                    name="prize.position"
                    value={formData.prize.position}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="1st">1st Place</option>
                    <option value="2nd">2nd Place</option>
                    <option value="3rd">3rd Place</option>
                    <option value="participation">Participation</option>
                    <option value="special_mention">Special Mention</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Prize Amount
                  </label>
                  <div className="flex space-x-2">
                    <select
                      name="prize.currency"
                      value={formData.prize.currency}
                      onChange={handleInputChange}
                      className="input-field w-24"
                    >
                      <option value="INR">INR</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                    <input
                      type="number"
                      name="prize.amount"
                      value={formData.prize.amount}
                      onChange={handleInputChange}
                      className="input-field flex-1"
                      placeholder="Prize amount"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <h2 className="text-xl font-semibold text-secondary-900 mb-6">
                Tags
              </h2>
              <div className="space-y-4">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => handleTagChange(index, e.target.value)}
                      className="input-field flex-1"
                      placeholder={`Tag ${index + 1}`}
                    />
                    {formData.tags.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTag}
                  className="btn-secondary text-sm"
                >
                  Add Another Tag
                </button>
              </div>
            </div>

            {/* File Uploads */}
            <div>
              <h2 className="text-xl font-semibold text-secondary-900 mb-6 flex items-center">
                <FiUpload className="w-5 h-5 mr-2 text-primary-600" />
                Documents & Images
              </h2>
              
              {/* Certificate Image */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Certificate/Award Image
                </label>
                <div className="border-2 border-dashed border-secondary-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                  {formData.certificateImage ? (
                    <div className="space-y-3">
                      <img
                        src={formData.certificateImage}
                        alt="Certificate"
                        className="max-h-48 mx-auto object-contain rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, certificateImage: '' }))}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove Certificate Image
                      </button>
                    </div>
                  ) : (
                    <div>
                      <FiUpload className="w-8 h-8 text-secondary-400 mx-auto mb-2" />
                      <p className="text-sm text-secondary-600 mb-2">Upload certificate image</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) handleImageUpload(file, 'certificate');
                        }}
                        className="hidden"
                        id="certificateImage"
                      />
                      <label htmlFor="certificateImage" className="btn-secondary text-sm cursor-pointer">
                        {uploading ? 'Uploading...' : 'Choose File'}
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Images */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Additional Images
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {formData.additionalImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Additional ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeAdditionalImage(index)}
                        className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) handleImageUpload(file, 'additional');
                  }}
                  className="hidden"
                  id="additionalImages"
                />
                <label htmlFor="additionalImages" className="btn-secondary text-sm cursor-pointer">
                  {uploading ? 'Uploading...' : 'Add More Images'}
                </label>
              </div>
            </div>

            {/* Publication Status */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleInputChange}
                className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
              />
              <label className="text-sm font-medium text-secondary-700">
                Publish this achievement (make it visible to public)
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-secondary-200">
              <Link
                to="/admin/achievements"
                className="btn-secondary"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || uploading}
                className="btn-primary"
              >
                {loading ? 'Creating Achievement...' : 'Create Achievement'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateAchievement;