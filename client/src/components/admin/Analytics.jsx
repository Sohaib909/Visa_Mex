import { useState, useEffect } from 'react';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    contentBySection: [],
    contentByLanguage: [],
    recentActivity: [],
    summary: {
      total: 0,
      active: 0,
      inactive: 0
    }
  });
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      // Get content analytics
      const response = await fetch(`${API_BASE_URL}/admin/content/analytics`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAnalytics(data.data);
        }
      }

      // Get all content for additional analysis
      const contentResponse = await fetch(`${API_BASE_URL}/admin/content`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (contentResponse.ok) {
        const contentData = await contentResponse.json();
        if (contentData.success) {
          processContentData(contentData.data);
        }
      }

    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const processContentData = (contentData) => {
    // Process content by section
    const sectionCounts = contentData.reduce((acc, item) => {
      acc[item.section] = (acc[item.section] || 0) + 1;
      return acc;
    }, {});

    // Process content by language
    const languageCounts = contentData.reduce((acc, item) => {
      acc[item.language] = (acc[item.language] || 0) + 1;
      return acc;
    }, {});

    // Get recent activity (last 10 items by update date)
    const recentActivity = contentData
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 10)
      .map(item => ({
        id: item._id,
        section: item.section,
        type: item.type,
        language: item.language,
        lastModified: new Date(item.updatedAt).toLocaleDateString(),
        isActive: item.isActive
      }));

    setAnalytics(prev => ({
      ...prev,
      contentBySection: Object.entries(sectionCounts).map(([section, count]) => ({
        section,
        count
      })),
      contentByLanguage: Object.entries(languageCounts).map(([language, count]) => ({
        language,
        count
      })),
      recentActivity,
      summary: {
        total: contentData.length,
        active: contentData.filter(item => item.isActive).length,
        inactive: contentData.filter(item => !item.isActive).length
      }
    }));
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-4 bg-gray-300 rounded mb-4"></div>
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-3 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-4 bg-gray-300 rounded mb-4"></div>
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-3 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Analytics Dashboard</h3>
        <button
          onClick={loadAnalytics}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
        >
          Refresh Data
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">📊</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Content</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.summary.total}</p>
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
              <p className="text-sm font-medium text-gray-600">Active Items</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.summary.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">❌</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Inactive Items</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.summary.inactive}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Content by Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Content by Section</h4>
          <div className="space-y-3">
            {analytics.contentBySection.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-700 capitalize">{item.section}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{
                        width: `${(item.count / analytics.summary.total) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content by Language */}
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Content by Language</h4>
          <div className="space-y-3">
            {analytics.contentByLanguage.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-700">{item.language === 'EN' ? 'English' : 'Spanish'}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{
                        width: `${(item.count / analytics.summary.total) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-md font-semibold text-gray-900">Recent Activity</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Language</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Modified</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.recentActivity.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.section}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.language}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.lastModified}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h5 className="text-sm font-medium text-blue-900 mb-2">Performance Insights</h5>
        <div className="text-sm text-blue-800 space-y-1">
          <p>• Content completion rate: {analytics.summary.total > 0 ? Math.round((analytics.summary.active / analytics.summary.total) * 100) : 0}%</p>
          <p>• Most active section: {analytics.contentBySection.length > 0 ? analytics.contentBySection.reduce((max, item) => item.count > max.count ? item : max).section : 'N/A'}</p>
          <p>• Language distribution: {analytics.contentByLanguage.map(item => `${item.language}: ${item.count}`).join(', ')}</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 