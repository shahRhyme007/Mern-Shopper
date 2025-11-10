import AddProduct from '../../Components/AddProduct/AddProduct';
import ListProduct from '../../Components/ListProduct/ListProduct';
import Dashboard from '../../Components/Dashboard/Dashboard';
import Sidebar from '../../Components/Sidebar/Sidebar';
import './Admin.css';
import { Routes, Route } from 'react-router-dom';

const Admin = () => {
  return (
    <div className="modern-admin">
        <Sidebar />
        <div className="admin-content">
            <Routes>
                <Route path='/' element={<Dashboard />} />
                <Route path='/addproduct' element={<AddProduct />} />
                <Route path='/listproduct' element={<ListProduct />} />
                
                {/* Placeholder routes for new features */}
                <Route path='/categories' element={<PlaceholderPage title="Categories" description="Manage product categories" />} />
                <Route path='/inventory' element={<PlaceholderPage title="Inventory Management" description="Track and manage stock levels" />} />
                <Route path='/orders' element={<PlaceholderPage title="Orders" description="Manage customer orders" />} />
                <Route path='/orders/pending' element={<PlaceholderPage title="Pending Orders" description="Orders awaiting processing" />} />
                <Route path='/orders/shipped' element={<PlaceholderPage title="Shipped Orders" description="Orders that have been shipped" />} />
                <Route path='/orders/analytics' element={<PlaceholderPage title="Order Analytics" description="Order statistics and insights" />} />
                <Route path='/users' element={<PlaceholderPage title="Users" description="Manage customer accounts" />} />
                <Route path='/users/analytics' element={<PlaceholderPage title="User Analytics" description="User behavior and statistics" />} />
                <Route path='/users/reviews' element={<PlaceholderPage title="User Reviews" description="Customer feedback and reviews" />} />
                <Route path='/analytics' element={<PlaceholderPage title="Analytics Dashboard" description="Comprehensive business analytics" />} />
                <Route path='/promotions' element={<PlaceholderPage title="Promotions" description="Manage discounts and promotional campaigns" />} />
                <Route path='/settings' element={<PlaceholderPage title="Settings" description="Admin panel configuration" />} />
            </Routes>
        </div>
    </div>
  );
};

// Placeholder component for future features
const PlaceholderPage = ({ title, description }) => {
  return (
    <div className="placeholder-page">
        <div className="placeholder-content">
            <h1>{title}</h1>
            <p>{description}</p>
            <div className="coming-soon">
                <span>🚀 Coming Soon</span>
                <p>This feature is under development and will be available in the next update.</p>
            </div>
        </div>
    </div>
  );
};

export default Admin;