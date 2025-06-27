# 🚀 E-commerce Backend API Documentation

## 📋 Base URL
```
http://localhost:4000
```

## 🔐 Authentication
Most user-specific endpoints require an `auth-token` header:
```
Headers: {
  "auth-token": "your_jwt_token_here"
}
```

---

## 🛍️ **PRODUCT APIs**

### Get All Products (Enhanced)
- **GET** `/products`
- **Query Parameters:**
  - `page` (number): Page number (default: 1)
  - `limit` (number): Items per page (default: 50)
  - `category` (string): Filter by category (men/women/kid)
  - `sortBy` (string): Sort field (default: date)
  - `sortOrder` (string): asc/desc (default: desc)

### Get Single Product
- **GET** `/product/:id`
- **Parameters:** Product ID

### Get All Products (Original - Backward Compatible)
- **GET** `/allproducts`

### Search Products
- **GET** `/search`
- **Query Parameters:**
  - `q` (string, required): Search query
  - `category` (string): Filter by category
  - `minPrice` (number): Minimum price
  - `maxPrice` (number): Maximum price
  - `page` (number): Page number
  - `limit` (number): Items per page

### Get Popular Products
- **GET** `/popular`
- **Query Parameters:**
  - `category` (string): Filter by category
  - `limit` (number): Number of products (default: 10)

### Get New Arrivals
- **GET** `/newarrivals`
- **Query Parameters:**
  - `category` (string): Filter by category
  - `limit` (number): Number of products (default: 10)

---

## 👤 **USER AUTHENTICATION**

### Register User
- **POST** `/signup`
- **Body:**
```json
{
  "username": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

### Login User
- **POST** `/login`
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

### Get User Profile
- **GET** `/profile`
- **Requires:** Authentication

### Update User Profile
- **POST** `/updateprofile`
- **Requires:** Authentication
- **Body:**
```json
{
  "name": "Updated Name"
}
```

---

## 🛒 **CART MANAGEMENT**

### Get User Cart
- **GET** `/getcart`
- **Requires:** Authentication

### Add Item to Cart
- **POST** `/addtocart`
- **Requires:** Authentication
- **Body:**
```json
{
  "itemId": 1
}
```

### Remove Item from Cart
- **POST** `/removefromcart`
- **Requires:** Authentication
- **Body:**
```json
{
  "itemId": 1
}
```

### Clear Entire Cart
- **POST** `/clearcart`
- **Requires:** Authentication

---

## ❤️ **WISHLIST MANAGEMENT**

### Get User Wishlist
- **GET** `/getwishlist`
- **Requires:** Authentication

### Add Item to Wishlist
- **POST** `/addtowishlist`
- **Requires:** Authentication
- **Body:**
```json
{
  "itemId": 1
}
```

### Remove Item from Wishlist
- **POST** `/removefromwishlist`
- **Requires:** Authentication
- **Body:**
```json
{
  "itemId": 1
}
```

---

## 🏪 **ADMIN PRODUCT MANAGEMENT**

### Add Product
- **POST** `/addproduct`
- **Body:**
```json
{
  "name": "Product Name",
  "image": "http://localhost:4000/images/product_image.png",
  "category": "women",
  "new_price": 50.00,
  "old_price": 80.00
}
```

### Remove Product
- **POST** `/removeproduct`
- **Body:**
```json
{
  "id": 1
}
```

### Upload Product Image
- **POST** `/upload`
- **Content-Type:** multipart/form-data
- **Body:** Form data with 'product' field containing image file

---

## 📊 **ANALYTICS & STATISTICS**

### Get Dashboard Statistics
- **GET** `/stats`
- **Returns:**
```json
{
  "success": true,
  "stats": {
    "totalProducts": 10,
    "totalUsers": 5,
    "activeProducts": 8,
    "inactiveProducts": 2,
    "categoryStats": [
      {"_id": "women", "count": 5},
      {"_id": "men", "count": 3}
    ],
    "recentUsers": [...],
    "recentProducts": [...]
  }
}
```

---

## 🔧 **UTILITY ENDPOINTS**

### Health Check
- **GET** `/`
- **Returns:** "Express App is Running"

### Serve Static Images
- **GET** `/images/:filename`
- **Returns:** Image file

---

## 📝 **Enhanced Product Schema**

Products now include additional fields:
- `description`: Product description
- `sizes`: Available sizes array
- `colors`: Available colors array
- `tags`: Product tags for search
- `stock`: Stock quantity
- `rating`: Average rating (0-5)
- `reviewCount`: Number of reviews

## 👤 **Enhanced User Schema**

Users now include:
- `wishlist`: Array of product IDs
- `preferences`: User preferences object
- `lastLogin`: Last login timestamp
- `isActive`: Account status

---

## 🛡️ **Security Features**

- Password hashing with bcrypt
- JWT token authentication
- Input validation with express-validator
- Rate limiting (100 requests/15min, 5 auth requests/15min)
- CORS configuration
- Helmet security headers
- File upload validation

---

## 📄 **Response Format**

All endpoints return JSON in this format:
```json
{
  "success": true/false,
  "data": "...",  // or specific field names
  "errors": "Error message if any"
}
```

## 🔄 **Backward Compatibility**

All original endpoints remain unchanged:
- `/allproducts` - Original product listing
- `/signup` - Original user registration
- `/login` - Original user login
- `/addproduct` - Original product creation
- `/removeproduct` - Original product deletion
- `/upload` - Original image upload 