import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiUpload, FiX, FiCalendar, FiMapPin, FiUser } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { eventsAPI, uploadAPI } from '../../services/api';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    shortDescription: '',
    fullDescription: '',
    venue: 'AI & DS Department',
    organizer: 'AI & DS Department',
    coverImage: '',
    galleryImages: []
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCoverImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Cover image must be less than 5MB');
      return;
    }

    try {
      setUploadingCover(true);
      const response = await uploadAPI.single(file);
      if (response.data.success) {
        setFormData({
          ...formData,
          coverImage: response.data.data.url
        });
        toast.success('Cover image uploaded successfully');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload cover image');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate file sizes
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error('All gallery images must be less than 5MB');
      return;
    }

    try {
      setUploadingGallery(true);
      const response = await uploadAPI.multiple(files);
      if (response.data.success) {
        const newImages = response.data.data.map(img => img.url);
        setFormData({
          ...formData,
          galleryImages: [...formData.galleryImages, ...newImages]
        });
        toast.success(`${files.length} images uploaded successfully`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload gallery images');
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = (index) => {
    const updatedImages = formData.galleryImages.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      galleryImages: updatedImages
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.coverImage) {
      toast.error('Please upload a cover image');
      return;
    }

    if (!formData.eventName.trim()) {
      toast.error('Please enter an event name');
      return;
    }

    if (!formData.eventDate) {
      toast.error('Please select an event date');
      return;
    }

    try {
      setLoading(true);
      const response = await eventsAPI.create(formData);
      if (response.data.success) {
        toast.success('Event created successfully!');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Create event error:', error);
      toast.error(error.response?.data?.message || 'Failed to create event');
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
            to="/admin/dashboard"
            className="inline-flex items-center text-secondary-600 hover:text-primary-600 transition-colors duration-200 mb-6 font-medium"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl font-display font-bold text-secondary-900 mb-2">
              Create New Event
            </h1>
            <p className="text-lg text-secondary-600">
              Add a new event to the AI & DS department showcase
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
                <FiCalendar className="w-6 h-6 mr-3 text-primary-600" />
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Event Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    Event Name *
                  </label>
                  <input
                    type="text"
                    name="eventName"
                    required
                    value={formData.eventName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter event name"
                    maxLength={100}
                  />
                  <p className="text-xs text-secondary-500 mt-1">
                    {formData.eventName.length}/100 characters
                  </p>
                </div>

                {/* Event Date */}
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    required
                    value={formData.eventDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Venue */}
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    <FiMapPin className="w-4 h-4 inline mr-1" />
                    Venue
                  </label>
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    placeholder="Event venue"
                  />
                </div>

                {/* Organizer */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    <FiUser className="w-4 h-4 inline mr-1" />
                    Organizer
                  </label>
                  <input
                    type="text"
                    name="organizer"
                    value={formData.organizer}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    placeholder="Event organizer"
                  />
                </div>
              </div>
            </div>

            {/* Descriptions */}
            <div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">Event Descriptions</h3>
              
              {/* Short Description */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-secondary-700 mb-2">
                  Short Description *
                </label>
                <textarea
                  name="shortDescription"
                  required
                  rows={3}
                  value={formData.shortDescription}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  placeholder="Brief description for event cards (max 200 characters)"
                  maxLength={200}
                />
                <p className="text-xs text-secondary-500 mt-1">
                  {formData.shortDescription.length}/200 characters
                </p>
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-2">
                  Full Description *
                </label>
                <textarea
                  name="fullDescription"
                  required
                  rows={6}
                  value={formData.fullDescription}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  placeholder="Detailed event description"
                />
              </div>
            </div>

            {/* Cover Image Upload */}
            <div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">Cover Image *</h3>
              <div className="border-2 border-dashed border-secondary-300 rounded-xl p-8 text-center">
                {formData.coverImage ? (
                  <div>
                    <img
                      src={formData.coverImage}
                      alt="Cover preview"
                      className="w-full max-w-md h-48 object-cover rounded-lg mx-auto mb-4 shadow-lg"
                    />
                    <p className="text-sm text-green-600 mb-4 font-medium">✅ Cover image uploaded successfully</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageUpload}
                      className="hidden"
                      id="cover-upload"
                      disabled={uploadingCover}
                    />
                    <label
                      htmlFor="cover-upload"
                      className="btn-secondary cursor-pointer inline-flex items-center"
                    >
                      {uploadingCover ? (
                        <>
                          <div className="loading-spinner mr-2"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <FiUpload className="w-4 h-4 mr-2" />
                          Change Image
                        </>
                      )}
                    </label>
                  </div>
                ) : (
                  <div>
                    <FiUpload className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-secondary-700 mb-2">Upload Cover Image</h4>
                    <p className="text-secondary-500 mb-4">Choose a high-quality image for your event (Max 5MB)</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageUpload}
                      className="hidden"
                      id="cover-upload"
                      disabled={uploadingCover}
                    />
                    <label
                      htmlFor="cover-upload"
                      className="btn-primary cursor-pointer inline-flex items-center"
                    >
                      {uploadingCover ? (
                        <>
                          <div className="loading-spinner mr-2"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <FiUpload className="w-4 h-4 mr-2" />
                          Choose File
                        </>
                      )}
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Gallery Images Upload */}
            <div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">Gallery Images (Optional)</h3>
              <div className="border-2 border-dashed border-secondary-300 rounded-xl p-8">
                <div className="text-center mb-6">
                  <FiUpload className="w-12 h-12 text-secondary-400 mx-auto mb-3" />
                  <h4 className="text-lg font-semibold text-secondary-700 mb-2">Upload Gallery Images</h4>
                  <p className="text-secondary-500 mb-4">Add multiple images to showcase your event (Max 5MB each)</p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryUpload}
                    className="hidden"
                    id="gallery-upload"
                    disabled={uploadingGallery}
                  />
                  <label
                    htmlFor="gallery-upload"
                    className="btn-secondary cursor-pointer inline-flex items-center"
                  >
                    {uploadingGallery ? (
                      <>
                        <div className="loading-spinner mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FiUpload className="w-4 h-4 mr-2" />
                        Choose Files
                      </>
                    )}
                  </label>
                </div>

                {formData.galleryImages.length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold text-secondary-700 mb-3">
                      Gallery Images ({formData.galleryImages.length})
                    </h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.galleryImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(index)}
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
                to="/admin/dashboard"
                className="btn-secondary px-6 py-3"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || uploadingCover || uploadingGallery}
                className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="loading-spinner mr-2"></div>
                    Creating Event...
                  </div>
                ) : (
                  'Create Event'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateEvent;