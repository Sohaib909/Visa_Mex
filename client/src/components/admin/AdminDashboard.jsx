import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAdminContent } from '../../hooks/useContent';
import ContentManager from './ContentManager';
import FileManager from './FileManager';
import Analytics from './Analytics';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { getAllContent, loading } = useAdminContent();
  const [activeTab, setActiveTab] = useState('content');
  const [stats, setStats] = useState({
    totalContent: 0,
    activeContent: 0,
    totalSections: 0,
    lastUpdate: null
  });

  // Check admin permissions
  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      window.location.href = '/login';
      return;
    }
    
    // Load initial stats
    loadStats();
  }, [isAuthenticated, user]);

  const loadStats = async () => {
    try {
      const response = await getAllContent();
      if (response.success && response.data) {
        const data = response.data;
        const sections = [...new Set(data.map(item => item.section))];
        
        setStats({
          totalContent: data.length,
          activeContent: data.filter(item => item.isActive).length,
          totalSections: sections.length,
          lastUpdate: data.length > 0 ? new Date(Math.max(...data.map(item => new Date(item.updatedAt)))).toLocaleDateString() : null
        });
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const tabs = [
    { id: 'content', label: 'Content Manager', icon: '📝' },
    { id: 'files', label: 'File Manager', icon: '📁' },
    { id: 'analytics', label: 'Analytics', icon: '📊' }
  ];

  if (!isAuthenticated || !user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">You need admin privileges to access this page.</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Content Management System</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome back, {user?.firstName}</span>
              <button 
                onClick={() => window.location.href = '/'}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm"
              >
                Back to Site
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">📄</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Content</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalContent}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">✅</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Content</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.activeContent}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">🏷️</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sections</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalSections}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">🕒</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Last Update</p>
                <p className="text-lg font-semibold text-gray-900">{stats.lastUpdate || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'content' && (
              <ContentManager onContentUpdate={loadStats} />
            )}
            {activeTab === 'files' && (
              <FileManager />
            )}
            {activeTab === 'analytics' && (
              <Analytics />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 