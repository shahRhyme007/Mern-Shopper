import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { 
  TrendingUp, 
  Package, 
  Users, 
  ShoppingCart, 
  DollarSign,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Star,
  Activity,
  BarChart3
} from 'lucide-react';
import { API_ENDPOINTS } from "../../config/api";

const Dashboard = () => {
  const [analytics, setAnalytics] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentProducts: [],
    loading: true
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setAnalytics(prev => ({ ...prev, loading: true }));
      
      // Fetch products data
      const productsResponse = await fetch(API_ENDPOINTS.ALL_PRODUCTS);
      const productsData = await productsResponse.json();
      
      if (Array.isArray(productsData)) {
        const totalProducts = productsData.length;
        const recentProducts = productsData.slice(-5).reverse(); // Last 5 products
        const totalRevenue = productsData.reduce((sum, product) => sum + (product.new_price || 0), 0);
        
        setAnalytics({
          totalProducts,
          totalUsers: 1250, // Mock data - you can connect to real user API
          totalOrders: 890, // Mock data - you can connect to real orders API
          totalRevenue,
          recentProducts,
          loading: false
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setAnalytics(prev => ({ ...prev, loading: false }));
    }
  };

  const StatCard = ({ icon: Icon, title, value, trend, trendValue, color }) => (
    <div className="stat-card">
      <div className="stat-header">
        <div className={`stat-icon ${color}`}>
          <Icon size={24} />
        </div>
        <div className={`trend ${trend > 0 ? 'positive' : 'negative'}`}>
          {trend > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          <span>{Math.abs(trendValue)}%</span>
        </div>
      </div>
      <div className="stat-content">
        <h3 className="stat-value">{value}</h3>
        <p className="stat-title">{title}</p>
      </div>
    </div>
  );

  const RecentActivityCard = ({ product, index }) => (
    <div className="activity-item" key={product.id || index}>
      <div className="activity-icon">
        <Package size={16} />
      </div>
      <div className="activity-content">
        <div className="activity-main">
          <span className="activity-title">Product Added</span>
          <span className="activity-time">2 hours ago</span>
        </div>
        <p className="activity-description">
          {product.name || 'New Product'} - ${product.new_price || '0'}
        </p>
      </div>
    </div>
  );

  if (analytics.loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Dashboard Overview</h1>
          <p>Welcome back! Here's what's happening with your store today.</p>
        </div>
        <div className="header-actions">
          <button className="refresh-btn" onClick={fetchDashboardData}>
            <Activity size={20} />
            Refresh
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="stats-grid">
        <StatCard
          icon={Package}
          title="Total Products"
          value={analytics.totalProducts.toLocaleString()}
          trend={1}
          trendValue={12}
          color="blue"
        />
        <StatCard
          icon={Users}
          title="Total Users"
          value={analytics.totalUsers.toLocaleString()}
          trend={1}
          trendValue={8}
          color="green"
        />
        <StatCard
          icon={ShoppingCart}
          title="Total Orders"
          value={analytics.totalOrders.toLocaleString()}
          trend={1}
          trendValue={15}
          color="purple"
        />
        <StatCard
          icon={DollarSign}
          title="Revenue"
          value={`$${analytics.totalRevenue.toLocaleString()}`}
          trend={1}
          trendValue={23}
          color="orange"
        />
      </div>

      {/* Content Grid */}
      <div className="content-grid">
        {/* Recent Products */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Recent Products</h3>
            <BarChart3 size={20} />
          </div>
          <div className="card-content">
            {analytics.recentProducts.length > 0 ? (
              analytics.recentProducts.map((product, index) => (
                <div className="product-item" key={product.id || index}>
                  <div className="product-image">
                    <img 
                      src={product.image || '/api/placeholder/40/40'} 
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyNkMyMyAyNiAyNS41IDIzLjUgMjUuNSAyMC41QzI1LjUgMTcuNSAyMyAxNSAyMCAxNUMxNyAxNSAxNC41IDE3LjUgMTQuNSAyMC41QzE0LjUgMjMuNSAxNyAyNiAyMCAyNloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                      }}
                    />
                  </div>
                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <p>${product.new_price}</p>
                  </div>
                  <div className="product-category">
                    <span className={`category-badge ${product.category}`}>
                      {product.category}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <Package size={48} />
                <p>No products found</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Recent Activity</h3>
            <Activity size={20} />
          </div>
          <div className="card-content">
            {analytics.recentProducts.slice(0, 4).map((product, index) => (
              <RecentActivityCard product={product} index={index} key={index} />
            ))}
            {analytics.recentProducts.length === 0 && (
              <div className="empty-state">
                <Activity size={48} />
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <div className="action-card">
            <Package size={24} />
            <h4>Add New Product</h4>
            <p>Create and publish new products</p>
          </div>
          <div className="action-card">
            <Eye size={24} />
            <h4>View All Products</h4>
            <p>Manage your existing inventory</p>
          </div>
          <div className="action-card">
            <Users size={24} />
            <h4>Manage Users</h4>
            <p>View and manage customer accounts</p>
          </div>
          <div className="action-card">
            <BarChart3 size={24} />
            <h4>Analytics</h4>
            <p>View detailed sales analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
