# 🛍️ MERN Shopper - Full-Stack E-Commerce Platform

<div align="center">

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)
![AI Powered](https://img.shields.io/badge/AI-Powered-purple?style=for-the-badge)

**A modern, feature-rich e-commerce platform with AI-powered virtual try-on, secure payments, and comprehensive admin management.**

[Features](#-key-features) • [Demo](#-demo) • [Installation](#-installation) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Features Documentation](#-features-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

---

## 🎯 Overview

**MERN Shopper** is a production-ready, full-stack e-commerce platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js). It features cutting-edge AI technology for virtual try-on, secure payment processing with Stripe, comprehensive inventory management, and a powerful admin dashboard.

Perfect for fashion e-commerce, clothing stores, and any business looking to provide an innovative online shopping experience with AI-powered features.

---

## ✨ Key Features

### 🛒 **Customer Features**

- **🏪 Modern Shopping Experience**
  - Browse products by category (Men, Women, Kids)
  - Advanced search and filtering
  - Product sorting (price, date, rating)
  - Pagination for better performance
  - Responsive design for all devices

- **🤖 AI-Powered Virtual Try-On**
  - Real AI face swap using Replicate API
  - Multiple professional AI models with fallback
  - Upload photos and see products on yourself
  - 95% realistic results
  - Browser-based processing option

- **🛒 Smart Shopping Cart**
  - Add/remove items with size selection
  - Real-time cart updates
  - Cart persistence (logged-in users)
  - Cart total calculations
  - Promo code support

- **❤️ Wishlist Management**
  - Save favorite products
  - Quick add/remove
  - Persistent across sessions

- **💳 Secure Checkout & Payments**
  - Stripe payment integration
  - Multiple payment methods (Card, PayPal, COD)
  - Shipping & billing address management
  - Order confirmation emails
  - Promo code discounts

- **📦 Order Management**
  - Order history tracking
  - Real-time order status updates
  - Order details view
  - Tracking information
  - Email notifications

- **👤 User Authentication**
  - Secure registration & login
  - JWT token-based authentication
  - Password encryption (bcrypt)
  - Profile management
  - Role-based access (User/Admin)

### 🎛️ **Admin Dashboard Features**

- **📊 Dashboard Analytics**
  - Total products, users, orders statistics
  - Category-wise product distribution
  - Recent users and products
  - Real-time data updates

- **📦 Product Management**
  - Add new products with multiple images
  - Edit product details (name, price, category)
  - Update product availability
  - Delete products
  - Image upload functionality
  - Bulk operations support

- **📋 Inventory Management**
  - Stock level tracking
  - Reserved vs available stock
  - Low stock alerts via email
  - Stock movement history
  - Reorder level configuration
  - Automatic inventory updates on orders

- **🎫 Promo Code Management**
  - Create discount codes
  - Percentage or fixed amount discounts
  - Minimum order requirements
  - Usage limits
  - Expiration dates
  - Category-specific promos

- **🛍️ Order Management**
  - View all orders
  - Update order status (pending, confirmed, processing, shipped, delivered)
  - Add tracking numbers
  - Order cancellation with inventory restoration
  - Customer details access

- **🔐 Admin Authentication**
  - Separate admin login
  - Admin-only route protection
  - Role-based permissions

### 🔧 **Technical Features**

- **Security**
  - Helmet.js for security headers
  - Rate limiting on API endpoints
  - CORS configuration
  - Input validation (express-validator)
  - Password hashing (bcrypt)
  - JWT token authentication

- **Performance**
  - MongoDB indexing for fast queries
  - Pagination for large datasets
  - Image optimization
  - Lazy loading
  - Caching strategies
  - API response optimization

- **Email Notifications**
  - Order confirmation emails
  - Order status update emails
  - Low stock alerts to admin
  - Customizable email templates

- **Developer Experience**
  - Comprehensive API documentation
  - Environment-based configuration
  - Error handling middleware
  - Detailed logging
  - Modular code structure

---

## 🚀 Tech Stack

### **Frontend**

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI Library |
| **React Router DOM** | 6.24.1 | Client-side routing |
| **TailwindCSS** | 3.4.17 | Styling framework |
| **Framer Motion** | 12.19.2 | Animations |
| **GSAP** | 3.13.0 | Advanced animations |
| **Stripe React** | 3.7.0 | Payment integration |
| **TensorFlow.js** | 4.22.0 | AI/ML features |
| **MediaPipe** | Latest | Pose detection |
| **Fabric.js** | 6.7.0 | Canvas manipulation |
| **Three.js** | 0.178.0 | 3D graphics |
| **Lucide React** | Latest | Icon library |

### **Backend**

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | Latest | Runtime environment |
| **Express.js** | 4.19.2 | Web framework |
| **MongoDB** | Latest | Database |
| **Mongoose** | 8.5.1 | ODM for MongoDB |
| **JWT** | 9.0.2 | Authentication |
| **Bcrypt** | 3.0.2 | Password hashing |
| **Stripe** | 18.2.1 | Payment processing |
| **Multer** | Latest | File uploads |
| **Nodemailer** | 7.0.3 | Email service |
| **Replicate** | 1.0.1 | AI face swap API |
| **Helmet** | 8.1.0 | Security headers |
| **Express Validator** | 7.2.1 | Input validation |
| **Express Rate Limit** | 7.5.0 | Rate limiting |

### **Admin Panel**

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI Library |
| **Vite** | 5.3.4 | Build tool |
| **React Router** | 6.25.1 | Routing |
| **Lucide React** | Latest | Icons |

---

## 📁 Project Structure

```
MERN-Shopper/
│
├── frontend/                 # Customer-facing React application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── Components/      # Reusable components
│   │   │   ├── Hero/
│   │   │   ├── Navbar/
│   │   │   ├── ProductDisplay/
│   │   │   ├── Checkout/
│   │   │   ├── VirtualTryOn/
│   │   │   └── ...
│   │   ├── Context/         # React context providers
│   │   ├── Pages/           # Page components
│   │   ├── config/          # Configuration files
│   │   ├── utils/           # Utility functions
│   │   └── App.js           # Main app component
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/                  # Node.js/Express backend
│   ├── upload/              # Uploaded product images
│   │   └── images/
│   ├── index.js             # Main server file
│   ├── package.json
│   ├── .env                 # Environment variables
│   ├── API_DOCUMENTATION.md # API docs
│   ├── seed-admin.js        # Admin seeding script
│   ├── init-inventory.js    # Inventory initialization
│   └── init-promos.js       # Promo code initialization
│
├── admin/                    # Admin dashboard (Vite + React)
│   ├── src/
│   │   ├── Components/
│   │   │   ├── AddProduct/
│   │   │   ├── ListProduct/
│   │   │   ├── Dashboard/
│   │   │   └── ...
│   │   ├── Pages/
│   │   ├── config/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── README.md             
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **MongoDB Atlas Account** - [Sign Up](https://www.mongodb.com/cloud/atlas/register)
- **Git** - [Download](https://git-scm.com/)

### Optional (for advanced features):
- **Stripe Account** - For payment processing - [Sign Up](https://stripe.com/)
- **Replicate API Key** - For AI virtual try-on - [Sign Up](https://replicate.com/)
- **Gmail Account** - For email notifications

---

## 🔧 Installation

### 1. **Clone the Repository**

```bash
git clone https://github.com/yourusername/mern-shopper.git
cd mern-shopper
```

### 2. **Install Backend Dependencies**

```bash
cd backend
npm install
```

### 3. **Install Frontend Dependencies**

```bash
cd ../frontend
npm install
```

### 4. **Install Admin Panel Dependencies**

```bash
cd ../admin
npm install
```

---

## ⚙️ Configuration

### **Backend Configuration**

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:5173

# File Upload Configuration
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/jpg,image/png,image/webp

# Stripe Configuration (Optional)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email Configuration (Optional)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_character_app_password
ADMIN_EMAIL=admin@yourstore.com

# AI Service Configuration (Optional)
REPLICATE_API_TOKEN=r8_your_replicate_token
```

### **Frontend Configuration**

Create a `.env` file in the `frontend` directory:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:4000

# Hugging Face (Optional - for virtual try-on)
REACT_APP_HUGGING_FACE_TOKEN=hf_your_token_here

# Stripe Publishable Key (Optional)
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

### **Admin Panel Configuration**

Create a `.env` file in the `admin` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:4000
```

---

## 🚀 Running the Application

### **Development Mode**

#### 1. Start Backend Server

```bash
cd backend
npm run dev
```
Server will run on `http://localhost:4000`

#### 2. Start Frontend

```bash
cd frontend
npm start
```
Frontend will run on `http://localhost:3000`

#### 3. Start Admin Panel

```bash
cd admin
npm run dev
```
Admin panel will run on `http://localhost:5173`

### **Production Build**

#### Frontend Build

```bash
cd frontend
npm run build
```

#### Admin Build

```bash
cd admin
npm run build
```

---

## 🗄️ Database Setup

### **1. Create MongoDB Atlas Cluster**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP address (or use `0.0.0.0/0` for development)
5. Get your connection string

### **2. Initialize Database with Sample Data**

```bash
cd backend

# Create admin user
node seed-admin.js

# Initialize inventory
node init-inventory.js

# Initialize promo codes
node init-promos.js
```

### **Default Admin Credentials**

After running `seed-admin.js`:
- **Email**: `admin@shopper.com`
- **Password**: `Admin@123`

⚠️ **Change these credentials immediately in production!**

---

## 📚 API Documentation

Comprehensive API documentation is available in `backend/API_DOCUMENTATION.md`.

### **Quick API Overview**

| Endpoint Category | Base Path | Auth Required |
|------------------|-----------|---------------|
| Products | `/products`, `/allproducts` | No |
| Search | `/search`, `/popular`, `/newarrivals` | No |
| Authentication | `/signup`, `/login` | No |
| Cart | `/addtocart`, `/removefromcart`, `/getcart` | Yes |
| Wishlist | `/addtowishlist`, `/removefromwishlist` | Yes |
| Orders | `/createorder`, `/orders`, `/order/:id` | Yes |
| Payments | `/create-payment-intent` | Yes |
| Admin | `/addproduct`, `/removeproduct`, `/updateproduct` | Admin |
| AI Features | `/api/ai-face-swap` | No |

### **Authentication**

Include JWT token in request headers:

```javascript
headers: {
  'auth-token': 'your_jwt_token_here'
}
```

---

## 🎨 Features Documentation

### **Virtual Try-On Setup**

See `VIRTUAL_TRYON_SETUP.md` for detailed setup instructions.

**Quick Setup:**

1. Get Replicate API key from [replicate.com](https://replicate.com/)
2. Add to backend `.env`: `REPLICATE_API_TOKEN=r8_your_token`
3. Restart backend server
4. Virtual try-on will work on product pages!

**Features:**
- Real AI face swap with multiple models
- Automatic fallback system
- Free $10/month credit from Replicate
- ~200-400 virtual try-ons per month

### **Payment Integration**

**Stripe Setup:**

1. Create account at [stripe.com](https://stripe.com/)
2. Get your API keys from dashboard
3. Add to `.env` files:
   - Backend: `STRIPE_SECRET_KEY`
   - Frontend: `REACT_APP_STRIPE_PUBLISHABLE_KEY`
4. Test with Stripe test cards: `4242 4242 4242 4242`

### **Email Notifications**

**Gmail Setup:**

1. Enable 2-factor authentication on Gmail
2. Generate App Password: [Google Account Settings](https://myaccount.google.com/security)
3. Add to backend `.env`:
   - `EMAIL_USER=your_email@gmail.com`
   - `EMAIL_PASS=your_16_char_app_password`

**Email Types:**
- Order confirmations
- Order status updates
- Low stock alerts (to admin)

---

## 🚀 Deployment

See `DEPLOYMENT_GUIDE.md` for detailed deployment instructions.

### **Quick Deploy Options**

#### **Backend Deployment**
- Heroku
- Railway
- Render
- AWS EC2
- DigitalOcean

#### **Frontend Deployment**
- Vercel (Recommended)
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

#### **Database**
- MongoDB Atlas (Managed - Recommended)
- Self-hosted MongoDB

### **Environment Variables for Production**

Ensure all environment variables are set in your hosting platform:
- Set `NODE_ENV=production`
- Update CORS origins with production URLs
- Use production Stripe keys
- Set secure JWT secrets

---

## 🧪 Testing

### **Test User Accounts**

Use these for testing (after running seed scripts):

**Regular User:**
- Email: `test@example.com`
- Password: `Test@123`

**Admin User:**
- Email: `admin@shopper.com`
- Password: `Admin@123`

### **Test Payment Cards (Stripe)**

| Card Number | Description |
|------------|-------------|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 9995` | Decline |
| `4000 0000 0000 3220` | 3D Secure |

Use any future expiry date and any 3-digit CVC.

---

## 🔒 Security Best Practices

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Change default admin credentials** immediately
3. **Use strong JWT secrets** (minimum 32 characters)
4. **Enable HTTPS** in production
5. **Whitelist specific IPs** in MongoDB Atlas for production
6. **Set up rate limiting** (already configured)
7. **Regular security audits**: `npm audit`
8. **Keep dependencies updated**: `npm update`

---

## 🐛 Troubleshooting

### **Common Issues**

#### **1. MongoDB Connection Failed**

```bash
# Error: querySrv ENOTFOUND
```

**Solutions:**
- Check if MongoDB cluster exists and is running
- Verify connection string in `.env`
- Whitelist your IP in MongoDB Atlas Network Access
- Check if cluster is paused (free tier)

#### **2. CORS Errors**

```javascript
// Frontend can't connect to backend
```

**Solutions:**
- Check if frontend port matches CORS configuration
- Update `corsOptions` in `backend/index.js`
- Ensure backend is running
- Clear browser cache

#### **3. Payment Integration Issues**

**Solutions:**
- Verify Stripe keys (test vs production)
- Check if Stripe webhook endpoint is configured
- Test with Stripe test cards
- Check browser console for errors

#### **4. Image Upload Fails**

**Solutions:**
- Check `backend/upload/images/` directory exists
- Verify file size limits in `.env`
- Check file types are allowed
- Ensure proper write permissions

#### **5. Virtual Try-On Not Working**

**Solutions:**
- Verify Replicate API token is set
- Check API credit balance
- Ensure images are properly formatted
- Check browser console for errors

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

### **1. Fork the Repository**

Click the "Fork" button on GitHub.

### **2. Create a Feature Branch**

```bash
git checkout -b feature/AmazingFeature
```

### **3. Commit Your Changes**

```bash
git commit -m 'Add some AmazingFeature'
```

### **4. Push to Branch**

```bash
git push origin feature/AmazingFeature
```

### **5. Open a Pull Request**

Go to GitHub and create a pull request with description.

### **Coding Standards**

- Follow ESLint configuration
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation if needed
- Test thoroughly before submitting

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 MERN Shopper

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 📧 Support

### **Get Help**

- 📖 [Documentation](./backend/API_DOCUMENTATION.md)
- 🐛 [Report Bugs](https://github.com/yourusername/mern-shopper/issues)
- 💡 [Request Features](https://github.com/yourusername/mern-shopper/issues)
- 💬 [Discussions](https://github.com/yourusername/mern-shopper/discussions)

### **Contact**

- **Email**: support@mernshopper.com
- **Website**: [www.mernshopper.com](https://www.mernshopper.com)
- **Twitter**: [@mernshopper](https://twitter.com/mernshopper)

---

## 🌟 Acknowledgments

- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Database hosting
- [Stripe](https://stripe.com/) - Payment processing
- [Replicate](https://replicate.com/) - AI model hosting
- [React](https://reactjs.org/) - Frontend framework
- [Express](https://expressjs.com/) - Backend framework
- [TailwindCSS](https://tailwindcss.com/) - Styling
- All open-source contributors

---


## 🗺️ Roadmap

### **Upcoming Features**

- [ ] Multi-language support
- [ ] Dark mode
- [ ] Product reviews and ratings
- [ ] Social media login (Google, Facebook)
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Real-time chat support
- [ ] AR try-on (using WebXR)
- [ ] Product recommendations (ML)
- [ ] Multi-vendor support

---



<div align="center">

### ⭐ Star this repository if you find it helpful!


[⬆ Back to Top](#-mern-shopper---full-stack-e-commerce-platform)

</div>

