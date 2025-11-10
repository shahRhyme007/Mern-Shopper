import { useState } from 'react';
import './Sidebar.css';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag,
  Users, 
  BarChart3,
  Settings,
  Plus,
  List,
  ShoppingCart,
  TrendingUp,
  UserCheck,
  FileText,
  Gift,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({
    products: true,
    orders: false,
    users: false
  });

  const toggleMenu = (menu) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/',
      type: 'single'
    },
    {
      id: 'products',
      title: 'Products',
      icon: Package,
      type: 'expandable',
      expanded: expandedMenus.products,
      subItems: [
        { title: 'Add Product', icon: Plus, path: '/addproduct' },
        { title: 'Product List', icon: List, path: '/listproduct' },
        { title: 'Categories', icon: FileText, path: '/categories' },
        { title: 'Inventory', icon: ShoppingBag, path: '/inventory' }
      ]
    },
    {
      id: 'orders',
      title: 'Orders',
      icon: ShoppingCart,
      type: 'expandable',
      expanded: expandedMenus.orders,
      subItems: [
        { title: 'All Orders', icon: List, path: '/orders' },
        { title: 'Pending Orders', icon: FileText, path: '/orders/pending' },
        { title: 'Shipped Orders', icon: ShoppingBag, path: '/orders/shipped' },
        { title: 'Order Analytics', icon: BarChart3, path: '/orders/analytics' }
      ]
    },
    {
      id: 'users',
      title: 'Users',
      icon: Users,
      type: 'expandable',
      expanded: expandedMenus.users,
      subItems: [
        { title: 'All Users', icon: Users, path: '/users' },
        { title: 'User Analytics', icon: BarChart3, path: '/users/analytics' },
        { title: 'User Reviews', icon: UserCheck, path: '/users/reviews' }
      ]
    },
    {
      id: 'analytics',
      title: 'Analytics',
      icon: TrendingUp,
      path: '/analytics',
      type: 'single'
    },
    {
      id: 'promotions',
      title: 'Promotions',
      icon: Gift,
      path: '/promotions',
      type: 'single'
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: Settings,
      path: '/settings',
      type: 'single'
    }
  ];

  const renderMenuItem = (item) => {
    if (item.type === 'single') {
      return (
        <Link 
          key={item.id} 
          to={item.path} 
          className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
        >
          <item.icon size={20} />
          <span>{item.title}</span>
        </Link>
      );
    }

    if (item.type === 'expandable') {
      return (
        <div key={item.id} className="sidebar-menu-group">
          <button 
            className={`sidebar-item expandable ${item.expanded ? 'expanded' : ''}`}
            onClick={() => toggleMenu(item.id)}
          >
            <div className="menu-item-content">
              <item.icon size={20} />
              <span>{item.title}</span>
            </div>
            {item.expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          
          {item.expanded && (
            <div className="submenu">
              {item.subItems.map((subItem, index) => (
                <Link 
                  key={index}
                  to={subItem.path}
                  className={`submenu-item ${isActive(subItem.path) ? 'active' : ''}`}
                >
                  <subItem.icon size={16} />
                  <span>{subItem.title}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className='modern-sidebar'>
      <div className="sidebar-header">
        <h3>Admin Panel</h3>
        <p>Manage your store</p>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map(renderMenuItem)}
      </nav>

      <div className="sidebar-footer">
        <div className="quick-stats">
          <div className="stat-item">
            <span className="stat-number">24</span>
            <span className="stat-label">New Orders</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">156</span>
            <span className="stat-label">Products</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;