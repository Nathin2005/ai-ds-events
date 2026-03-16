import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiUpload, FiX, FiCalendar } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { eventsAPI, uploadAPI } from '../../services/api';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    shortDescription: '',
    fullDescription: '',
    venue: '',
    organizer: '',
    coverImage: '',
    galleryImages: []
  });

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await eventsAPI.getById(id);
      if (response.data.success) {
        const event = response.data.data;
        setFormData({
          eventName: event.eventName,
          eventDate: event.eventDate.split('T')[0], // Format for date input
          shortDescription: event.shortDescription,
          fullDescription: event.fullDescription,
          venue: event.venue || '',
          organizer: event.organizer || '',
          coverImage: event.coverImage,
          galleryImages: event.galleryImages || []
        });
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      toast.error('Failed to load event data');
      navigate('/admin/dashboard');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCoverImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingCover(true);
      const response = await uploadAPI.single(file);
      if (response.data.success) {
        setFormData({
          ...formData,
          coverImage: response.data.data.url
        });
        toast.success('Cover image updated successfully');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload cover image');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await eventsAPI.update(id, formData);
      if (response.data.success) {
        toast.success('Event updated successfully!');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Update event error:', error);
      toast.error(error.response?.data?.message || 'Failed to update event');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading event data...</p>
        </div>
      </div>
    );
  }

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
              Edit Event
            </h1>
            <p className="text-lg text-secondary-600">
              Update event information and details
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
                Event Information
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
                    maxLength={100}
                  />
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
                    className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Venue */}
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    Venue
                  </label>
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Organizer */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    Organizer
                  </label>
                  <input
                    type="text"
                    name="organizer"
                    value={formData.organizer}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Descriptions */}
            <div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">Descriptions</h3>
              
              <div className="space-y-6">
                {/* Short Description */}
                <div>
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
                  />
                </div>
              </div>
            </div>

            {/* Cover Image */}
            <div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">Cover Image</h3>
              <div className="border-2 border-dashed border-secondary-300 rounded-xl p-6 text-center">
                <img
                  src={formData.coverImage}
                  alt="Current cover"
                  className="w-full max-w-md h-48 object-cover rounded-lg mx-auto mb-4 shadow-lg"
                />
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
                      Change Cover Image
                    </>
                  )}
                </label>
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
                disabled={loading || uploadingCover}
                className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="loading-spinner mr-2"></div>
                    Updating...
                  </div>
                ) : (
                  'Update Event'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditEvent;