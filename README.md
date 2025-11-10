# 🛍️ MERN Shopper - Full-Stack E-Commerce Platform

<div align="center">

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)
![Stripe](https://img.shields.io/badge/Payments-Stripe-blueviolet?style=for-the-badge&logo=stripe)

**A modern, feature-rich e-commerce platform with secure payments, responsive UI, and a powerful admin management system.**

[Features](#-key-features) • [Demo](#-demo) • [Installation](#-installation) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 🎯 Overview

**MERN Shopper** is a full-stack e-commerce platform built with the **MERN stack (MongoDB, Express.js, React.js, Node.js)**.  
It includes secure Stripe payments, comprehensive inventory management, and an advanced admin dashboard for product and order control.

Perfect for clothing stores or any business seeking a modern, scalable online shopping platform.

---

## 🎬 Demo

🌐 **Customer Frontend:** [https://mern-shopperz.vercel.app](https://mern-shopperz.vercel.app)  
🎛️ **Admin Panel:** [https://mern-shopperz-admin.vercel.app](https://mern-shopperz-admin.vercel.app)  
🔗 **Backend API:** [https://mern-shopper.onrender.com](https://mern-shopper.onrender.com)

### **Test Credentials**

**Customer:**
```
Email: test@example.com  
Password: Test@123
```

**Admin:**
```
Email: admin@shopper.com  
Password: Admin@123
```

---

## ✨ Key Features

### 🛒 Customer Features
- Browse by category (Men, Women, Kids)
- Advanced search, filter, and sorting
- Responsive design for all devices
- Smart cart with quantity and size options
- Wishlist with persistent storage
- Secure checkout with **Stripe** integration
- Order history and tracking
- JWT-based authentication with role-based access

### 🎛️ Admin Dashboard
- Analytics dashboard with user/product/order stats  
- Add/edit/delete products with multiple images  
- Manage inventory and stock levels  
- Handle orders with status updates  
- Create and manage promo codes  
- Role-based admin authentication and protected routes  

### 🔧 Technical Highlights
- **Security:** Helmet.js, JWT, bcrypt, input validation, rate limiting  
- **Performance:** Pagination, MongoDB indexing, image optimization  
- **Notifications:** Order confirmation, status updates via email  
- **Code Quality:** Modular structure, error handling, detailed logging  

---

## 🚀 Tech Stack

| Layer | Technology |
|--------|-------------|
| **Frontend** | React 18, React Router DOM, TailwindCSS, Framer Motion |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose |
| **Payments** | Stripe |
| **Email** | Nodemailer (Gmail SMTP) |
| **Admin Panel** | React + Vite + Lucide Icons |

---

## 📁 Project Structure

```
MERN-Shopper/
├── frontend/      # Customer-facing React app
├── backend/       # Node.js/Express API
├── admin/         # Admin dashboard (Vite + React)
└── README.md
```

---

## 📋 Prerequisites
- Node.js v16+
- MongoDB Atlas account
- Git
- (Optional) Stripe account for payments  
- (Optional) Gmail account for email notifications  

---

## 🔧 Installation

```bash
# 1. Clone repository
git clone https://github.com/yourusername/mern-shopper.git
cd mern-shopper

# 2. Backend setup
cd backend
npm install

# 3. Frontend setup
cd ../frontend
npm install

# 4. Admin setup
cd ../admin
npm install
```

---

## ⚙️ Configuration

### **Backend (.env)**

```env
PORT=4000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_your_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### **Frontend (.env)**
```env
REACT_APP_API_URL=http://localhost:4000
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```

### **Admin (.env)**
```env
VITE_API_URL=http://localhost:4000
```

---

## 🚀 Running the Application

### **Development Mode**
```bash
# Backend
cd backend
npm run dev

# Frontend
cd ../frontend
npm start

# Admin Panel
cd ../admin
npm run dev
```

- Backend: `http://localhost:4000`  
- Frontend: `http://localhost:3000`  
- Admin: `http://localhost:5173`

### **Production Build**
```bash
cd frontend && npm run build
cd ../admin && npm run build
```

---

## 🗄️ Database Setup

```bash
cd backend
node seed-admin.js        # Create default admin
node init-inventory.js    # Initialize products
node init-promos.js       # Create promo codes
```

Default admin credentials:
```
Email: admin@shopper.com
Password: Admin@123
```

---

## 📚 API Overview

| Category | Path | Auth |
|-----------|------|------|
| Products | `/products`, `/allproducts` | ❌ |
| Auth | `/signup`, `/login` | ❌ |
| Cart | `/addtocart`, `/getcart` | ✅ |
| Wishlist | `/addtowishlist`, `/removefromwishlist` | ✅ |
| Orders | `/createorder`, `/orders` | ✅ |
| Payments | `/create-payment-intent` | ✅ |
| Admin | `/addproduct`, `/updateproduct`, `/removeproduct` | 🔒 |

---

## 🧪 Testing

### **Test Users**
- User → `test@example.com` / `Test@123`
- Admin → `admin@shopper.com` / `Admin@123`

### **Stripe Test Cards**
| Card | Result |
|------|---------|
| 4242 4242 4242 4242 | Success |
| 4000 0000 0000 9995 | Decline |
| 4000 0000 0000 3220 | 3D Secure |

---

## 🔒 Security Best Practices
1. Never commit `.env` files  
2. Change default admin credentials  
3. Use strong JWT secrets  
4. Enable HTTPS in production  
5. Whitelist production IPs in MongoDB  
6. Regularly run `npm audit` and updates  

---

## 🐛 Troubleshooting

| Issue | Possible Fix |
|-------|---------------|
| **MongoDB connection failed** | Check URI, whitelist IP, ensure cluster active |
| **CORS errors** | Match CORS origin in backend with frontend URL |
| **Stripe errors** | Verify keys and test cards |
| **Image upload fails** | Ensure `/upload/images` folder exists and correct permissions |

---

## 🤝 Contributing

1. **Fork** the repository  
2. **Create a feature branch** → `git checkout -b feature/AmazingFeature`  
3. **Commit changes** → `git commit -m 'Add AmazingFeature'`  
4. **Push branch** → `git push origin feature/AmazingFeature`  
5. **Open a Pull Request**

---

## 📝 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 MERN Shopper

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files...
```

---

## 📞 Contact

- **Email:** support@mernshopper.com  
- **Website:** [www.mernshopper.com](https://mern-shopper.vercel.app/)

---

## 🌟 Acknowledgments
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Stripe](https://stripe.com/)
- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [TailwindCSS](https://tailwindcss.com/)

---

## 🗺️ Roadmap

### Upcoming Features
- [ ] Multi-language support  
- [ ] Dark mode  
- [ ] Product reviews & ratings  
- [ ] Social login (Google, Facebook)  
- [ ] Advanced analytics dashboard  
- [ ] Product recommendations  
- [ ] Multi-vendor support  

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

[⬆ Back to Top](#-mern-shopper---full-stack-e-commerce-platform)

</div>
