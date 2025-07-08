import { useState, useRef } from 'react';

const FileManager = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': token ? `Bearer ${token}` : '',
    };
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploading(true);
    
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      formData.append('section', 'general');
      formData.append('type', 'image');

      const response = await fetch(`${API_BASE_URL}/admin/upload/multiple`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadedFiles(prev => [...prev, ...data.data]);
        alert(`${data.data.length} files uploaded successfully!`);
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      alert('URL copied to clipboard!');
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">File Manager</h3>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {uploading ? 'Uploading...' : 'Upload Files'}
          </label>
        </div>
      </div>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
        <div className="text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-sm">
            Click "Upload Files" or drag and drop files here
          </p>
          <p className="text-xs text-gray-400 mt-1">
            PNG, JPG, GIF up to 5MB each
          </p>
        </div>
      </div>

      {/* Recently Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">Recently Uploaded</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="bg-white border rounded-lg p-4 shadow-sm">
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                  <img
                    src={`${API_BASE_URL.replace('/api', '')}${file.url}`}
                    alt={file.originalName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-full bg-gray-200 hidden items-center justify-center">
                    <span className="text-gray-500 text-sm">Preview not available</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate mb-1">
                    {file.originalName}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                  <div className="flex justify-between items-center">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1 mr-2 truncate">
                      {file.url}
                    </code>
                    <button
                      onClick={() => copyToClipboard(`${API_BASE_URL.replace('/api', '')}${file.url}`)}
                      className="text-blue-600 hover:text-blue-800 text-xs"
                      title="Copy URL"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h5 className="text-sm font-medium text-blue-900 mb-2">File Upload Guidelines</h5>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Maximum file size: 5MB per file</li>
          <li>• Supported formats: PNG, JPG, JPEG, GIF, WebP, SVG</li>
          <li>• Files are automatically optimized for web use</li>
          <li>• Copy the URL to use in content fields</li>
        </ul>
      </div>
    </div>
  );
};

export default FileManager; 