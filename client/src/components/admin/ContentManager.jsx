import { useState, useEffect } from 'react';
import { useAdminContent } from '../../hooks/useContent';

const ContentManager = ({ onContentUpdate }) => {
  const { getAllContent, createContent, updateContent, deleteContent, loading, error } = useAdminContent();
  const [content, setContent] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filters, setFilters] = useState({
    section: '',
    language: '',
    type: '',
    isActive: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form state
  const [formData, setFormData] = useState({
    section: 'hero',
    type: 'title',
    language: 'EN',
    data: {
      title: '',
      description: '',
      text: '',
      name: '',
      question: '',
      answer: '',
      rating: 5,
      iconUrl: '',
      image: '',
      ctaText: '',
      buttonText: ''
    },
    order: 0,
    isActive: true
  });

  const sections = ['hero', 'features', 'testimonials', 'faq', 'about'];
  const types = ['title', 'subtitle', 'description', 'feature', 'testimonial', 'question', 'answer', 'cta', 'image'];
  const languages = ['EN', 'ES'];

  useEffect(() => {
    loadContent();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [content, filters]);

  const loadContent = async () => {
    try {
      const response = await getAllContent();
      if (response.success) {
        setContent(response.data || []);
      }
    } catch (err) {
      console.error('Failed to load content:', err);
    }
  };

  const applyFilters = () => {
    let filtered = [...content];
    
    if (filters.section) {
      filtered = filtered.filter(item => item.section === filters.section);
    }
    if (filters.language) {
      filtered = filtered.filter(item => item.language === filters.language);
    }
    if (filters.type) {
      filtered = filtered.filter(item => item.type === filters.type);
    }
    if (filters.isActive !== '') {
      filtered = filtered.filter(item => item.isActive === (filters.isActive === 'true'));
    }
    
    setFilteredContent(filtered);
    setCurrentPage(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingItem) {
        await updateContent(editingItem._id, formData);
      } else {
        await createContent(formData);
      }
      
      await loadContent();
      if (onContentUpdate) onContentUpdate();
      resetForm();
    } catch (err) {
      console.error('Failed to save content:', err);
      alert('Failed to save content. Please try again.');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      section: item.section,
      type: item.type,
      language: item.language,
      data: { ...item.data },
      order: item.order || 0,
      isActive: item.isActive
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this content?')) return;
    
    try {
      await deleteContent(id);
      await loadContent();
      if (onContentUpdate) onContentUpdate();
    } catch (err) {
      console.error('Failed to delete content:', err);
      alert('Failed to delete content. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      section: 'hero',
      type: 'title',
      language: 'EN',
      data: {
        title: '',
        description: '',
        text: '',
        name: '',
        question: '',
        answer: '',
        rating: 5,
        iconUrl: '',
        image: '',
        ctaText: '',
        buttonText: ''
      },
      order: 0,
      isActive: true
    });
    setEditingItem(null);
    setShowForm(false);
  };

  // Pagination
  const totalPages = Math.ceil(filteredContent.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredContent.slice(startIndex, endIndex);

  const renderDataFields = () => {
    const { section, type } = formData;
    
    if (section === 'testimonials' && type === 'testimonial') {
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.data.name || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                data: { ...prev.data, name: e.target.value }
              }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Testimonial Text</label>
            <textarea
              value={formData.data.text || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                data: { ...prev.data, text: e.target.value }
              }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              rows="3"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
            <input
              type="number"
              min="1"
              max="5"
              value={formData.data.rating || 5}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                data: { ...prev.data, rating: parseInt(e.target.value) }
              }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              type="url"
              value={formData.data.image || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                data: { ...prev.data, image: e.target.value }
              }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="/Pic.png"
            />
          </div>
        </>
      );
    }
    
    if (section === 'features' && type === 'feature') {
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={formData.data.title || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                data: { ...prev.data, title: e.target.value }
              }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.data.description || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                data: { ...prev.data, description: e.target.value }
              }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              rows="3"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Icon URL</label>
            <input
              type="url"
              value={formData.data.iconUrl || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                data: { ...prev.data, iconUrl: e.target.value }
              }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="/icon1.png"
            />
          </div>
        </>
      );
    }
    
    if (section === 'faq') {
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
            <input
              type="text"
              value={formData.data.question || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                data: { ...prev.data, question: e.target.value }
              }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
            <textarea
              value={formData.data.answer || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                data: { ...prev.data, answer: e.target.value }
              }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              rows="4"
              required
            />
          </div>
        </>
      );
    }
    
    // Default fields for hero and other content
    return (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
          <textarea
            value={formData.data.text || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              data: { ...prev.data, text: e.target.value }
            }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            rows="3"
            required
          />
        </div>
        {type === 'cta' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
            <input
              type="text"
              value={formData.data.buttonText || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                data: { ...prev.data, buttonText: e.target.value }
              }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        )}
      </>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Content Management</h3>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Content
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
          <select
            value={filters.section}
            onChange={(e) => setFilters(prev => ({ ...prev, section: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">All Sections</option>
            {sections.map(section => (
              <option key={section} value={section}>{section}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
          <select
            value={filters.language}
            onChange={(e) => setFilters(prev => ({ ...prev, language: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">All Languages</option>
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">All Types</option>
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={filters.isActive}
            onChange={(e) => setFilters(prev => ({ ...prev, isActive: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      {/* Content Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Language</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((item) => (
              <tr key={item._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.section}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.language}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                  {item.data?.title || item.data?.text || item.data?.question || 'No content'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {item.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 text-sm rounded-md ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-90vh overflow-y-auto">
            <h4 className="text-lg font-semibold mb-4">
              {editingItem ? 'Edit Content' : 'Add New Content'}
            </h4>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                  <select
                    value={formData.section}
                    onChange={(e) => setFormData(prev => ({ ...prev, section: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  >
                    {sections.map(section => (
                      <option key={section} value={section}>{section}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  >
                    {types.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  >
                    {languages.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>

              {renderDataFields()}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="mr-2"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">Active</label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManager; 