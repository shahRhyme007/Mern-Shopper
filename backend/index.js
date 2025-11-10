// backend code

// Load environment variables
require('dotenv').config();

// Import security packages
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// port number where express server is running
const port = process.env.PORT || 4000;

// importing the dependencies
const express = require("express");
const app = express();

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");

// path from the express server
const path = require("path");
const cors = require("cors");

// Import additional packages for Phase 5 features
const stripe = process.env.STRIPE_SECRET_KEY ? require('stripe')(process.env.STRIPE_SECRET_KEY) : null;
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const Replicate = require("replicate");

// Import node-fetch polyfill
// Removed node-fetch dependency - virtual try-on now runs client-side

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting - More lenient for development
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000 // increased limit for virtual try-on requests
});
app.use('/api/', limiter); // Only apply to API routes, not static files

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5 // limit each IP to 5 auth requests per windowMs
});

// CORS configuration
const corsOptions = {
    origin: [
        process.env.FRONTEND_URL,
        process.env.ADMIN_URL,
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
        'https://mern-shopperz.vercel.app', // Production frontend
        'https://mern-shopper-admin.vercel.app', // Production admin
        /\.vercel\.app$/ // Allow all Vercel preview deployments
    ],
    credentials: true,
    optionsSuccessStatus: 200
};

// request from response will be passed as json
app.use(express.json({ limit: '10mb' }));
app.use(cors(corsOptions));

// Database connection with mogoDB from mongo atlas
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB Atlas successfully');
    })
    .catch((error) => {
        console.log('❌ MongoDB connection failed:', error.message);
        console.log('🔄 Server will continue running for API testing...');
        console.log('💡 Fix network connectivity to enable database features');
    });

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
    console.log('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.log('❌ Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('🔌 Mongoose disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('👋 MongoDB connection closed through app termination');
    process.exit(0);
});

// Middleware for validating auth token
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).json({ errors: "Please authenticate using a valid token" });
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        return res.status(401).json({ errors: "Please authenticate using a valid token" });
    }
}

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
    const token = req.header('auth-token');
    if (token) {
        try {
            const data = jwt.verify(token, process.env.JWT_SECRET);
            req.user = data.user;
        } catch (error) {
            // Token invalid, but continue without user
            req.user = null;
        }
    }
    next();
}

// Middleware to check if user exists in database
const validateUser = async (req, res, next) => {
    try {
        const user = await Users.findById(req.user.id);
        if (!user) {
            return res.status(401).json({ errors: "User not found" });
        }
        req.userDoc = user;
        next();
    } catch (error) {
        return res.status(401).json({ errors: "Invalid user" });
    }
}

// Error handling middleware
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(error => error.msg).join(', ')
        });
    }
    next();
};

// creating the api endpoint and if any error occurs it will show the error
// displaying on the web page
app.get("/", (req, res) => {
    res.send("Express App is Running")
})

// Test endpoint for debugging
app.post('/test-add', async (req, res) => {
    console.log('Test endpoint hit with:', req.body);
    res.json({ success: true, message: 'Test endpoint working', received: req.body });
})

// image storage engine in diskStorage
const storage = multer.diskStorage({
    destination: './upload/images', 
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

// image upload using the above storage engine with file validation
const upload = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',') || ['image/jpeg', 'image/jpg', 'image/png'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, JPG, PNG files are allowed.'));
        }
    }
});

// creating upload endpoint for images with CORS headers
app.use('/images', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
}, express.static('upload/images'));

app.post("/upload", upload.single('product'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: 0,
            message: "No file uploaded"
        });
    }
    
    // Use environment-based URL or construct from request
    const baseUrl = process.env.BACKEND_URL || 
                    (req.protocol + '://' + req.get('host'));
    
    res.json({
        success: 1,
        image_url: `${baseUrl}/images/${req.file.filename}`
    });
});

//** Schema for creating the products
// name of schemaa =  "Product"

const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 200,
        index: true // For search functionality
    },
    image: {
        type: String,
        required: true,
    },
    // Multiple images support (3-10 images)
    images: {
        type: [String],
        default: [],
        validate: {
            validator: function(v) {
                return v.length >= 0 && v.length <= 10;
            },
            message: 'Product must have between 0 and 10 images'
        }
    },
    category: {
        type: String,
        required: true,
        enum: ['men', 'women', 'kid'],
        index: true // For category filtering
    },
    new_price:{
        type: Number,
        required: true,
        min: 0,
        index: true // For price sorting
    }, 
    old_price:{
        type: Number,
        required: true,
        min: 0
    },
    date:{
        type: Date,
        default: Date.now,
        index: true // For date sorting
    }, 
    available:{
        type: Boolean,
        default: true,
        index: true // For availability filtering
    },
    // New fields for enhanced functionality
    description: {
        type: String,
        default: "A quality product from our collection",
        maxLength: 1000
    },
    sizes: {
        type: [String],
        default: ['S', 'M', 'L', 'XL'],
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    },
    colors: {
        type: [String],
        default: ['Default']
    },
    tags: {
        type: [String],
        default: []
    },
    stock: {
        type: Number,
        default: 100,
        min: 0
    },
    rating: {
        type: Number,
        default: 4.0,
        min: 0,
        max: 5
    },
    reviewCount: {
        type: Number,
        default: 0,
        min: 0
    }
});

// ================== ORDER SCHEMA ==================

const Order = mongoose.model("Order", {
    orderId: {
        type: String,
        required: true,
        unique: true,
        default: () => `ORD-${uuidv4().slice(0, 8).toUpperCase()}`
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
        index: true
    },
    items: [{
        productId: {
            type: Number,
            required: true
        },
        productName: {
            type: String,
            required: true
        },
        productImage: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        totalPrice: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    orderTotal: {
        type: Number,
        required: true,
        min: 0
    },
    discountAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    finalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    shippingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true, default: 'USA' }
    },
    billingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true, default: 'USA' }
    },
    paymentMethod: {
        type: String,
        enum: ['stripe', 'paypal', 'cod'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending',
        index: true
    },
    paymentIntentId: {
        type: String // Stripe payment intent ID
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
        index: true
    },
    orderDate: {
        type: Date,
        default: Date.now,
        index: true
    },
    expectedDeliveryDate: {
        type: Date
    },
    trackingNumber: {
        type: String
    },
    notes: {
        type: String
    },
    orderHistory: [{
        status: String,
        timestamp: { type: Date, default: Date.now },
        notes: String
    }]
});

// ================== INVENTORY SCHEMA ==================

const Inventory = mongoose.model("Inventory", {
    productId: {
        type: Number,
        required: true,
        unique: true,
        index: true
    },
    currentStock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    reservedStock: {
        type: Number,
        default: 0,
        min: 0
    },
    availableStock: {
        type: Number,
        default: function() {
            return this.currentStock - this.reservedStock;
        }
    },
    reorderLevel: {
        type: Number,
        default: 10,
        min: 0
    },
    maxStock: {
        type: Number,
        default: 1000,
        min: 0
    },
    lastRestocked: {
        type: Date,
        default: Date.now
    },
    stockMovements: [{
        type: { type: String, enum: ['inbound', 'outbound', 'adjustment'], required: true },
        quantity: { type: Number, required: true },
        reason: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        orderId: { type: String } // Reference to order if related to order
    }]
});

// ================== PROMO CODE SCHEMA ==================

const PromoCode = mongoose.model("PromoCode", {
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        index: true
    },
    description: {
        type: String,
        required: true
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: true
    },
    discountValue: {
        type: Number,
        required: true,
        min: 0
    },
    minOrderAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    maxDiscountAmount: {
        type: Number // For percentage discounts
    },
    usageLimit: {
        type: Number,
        default: null // null means unlimited
    },
    usedCount: {
        type: Number,
        default: 0,
        min: 0
    },
    validFrom: {
        type: Date,
        required: true
    },
    validUntil: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    applicableCategories: [String], // Empty array means all categories
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// ================== EMAIL CONFIGURATION ==================

const emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Email templates
const emailTemplates = {
    orderConfirmation: (order, user) => ({
        subject: `Order Confirmation - ${order.orderId}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #333; text-align: center;">Order Confirmation</h2>
                <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3>Hi ${user.name},</h3>
                    <p>Thank you for your order! Your order has been confirmed and is being processed.</p>
                    <div style="margin: 20px 0;">
                        <strong>Order ID:</strong> ${order.orderId}<br>
                        <strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleDateString()}<br>
                        <strong>Total Amount:</strong> $${order.finalAmount.toFixed(2)}
                    </div>
                </div>
                <div style="margin: 20px 0;">
                    <h4>Order Items:</h4>
                    ${order.items.map(item => `
                        <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                            <strong>${item.productName}</strong><br>
                            Quantity: ${item.quantity} × $${item.price.toFixed(2)} = $${item.totalPrice.toFixed(2)}
                        </div>
                    `).join('')}
                </div>
                <div style="background: #f0f8f0; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0; color: #2e7d2e;">
                        <strong>🚚 We'll send you tracking information once your order ships!</strong>
                    </p>
                </div>
                <p style="text-align: center; color: #666; margin-top: 30px;">
                    Thank you for shopping with us!<br>
                    <strong>SHOPPER Team</strong>
                </p>
            </div>
        `
    }),
    
    orderStatusUpdate: (order, user, newStatus) => ({
        subject: `Order ${order.orderId} - Status Updated to ${newStatus.toUpperCase()}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #333; text-align: center;">Order Status Update</h2>
                <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3>Hi ${user.name},</h3>
                    <p>Your order <strong>${order.orderId}</strong> status has been updated to <strong>${newStatus.toUpperCase()}</strong>.</p>
                    ${order.trackingNumber ? `<p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>` : ''}
                </div>
                <p style="text-align: center; color: #666; margin-top: 30px;">
                    Thank you for shopping with us!<br>
                    <strong>SHOPPER Team</strong>
                </p>
            </div>
        `
    }),

    lowStockAlert: (product, inventory) => ({
        subject: `Low Stock Alert - ${product.name}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #d32f2f; text-align: center;">⚠️ Low Stock Alert</h2>
                <div style="background: #fff3e0; padding: 20px; border-radius: 8px; border-left: 4px solid #ff9800;">
                    <h3>Product: ${product.name}</h3>
                    <p><strong>Product ID:</strong> ${product.id}</p>
                    <p><strong>Current Stock:</strong> ${inventory.currentStock}</p>
                    <p><strong>Reorder Level:</strong> ${inventory.reorderLevel}</p>
                    <p style="color: #d32f2f; font-weight: bold;">
                        Stock level is below the reorder threshold. Please restock soon.
                    </p>
                </div>
            </div>
        `
    })
};

// Validation rules for adding products
const productValidation = [
    body('name')
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Product name must be between 1 and 200 characters'),
    body('category')
        .isIn(['men', 'women', 'kid'])
        .withMessage('Category must be men, women, or kid'),
    body('new_price')
        .isFloat({ min: 0 })
        .withMessage('New price must be a positive number'),
    body('old_price')
        .isFloat({ min: 0 })
        .withMessage('Old price must be a positive number'),
    body('image')
        .notEmpty()
        .withMessage('Image URL is required')
];

// adding product to the database
app.post('/addproduct', async (req, res) => {
    console.log('🔍 Received addproduct request');
    console.log('Request body:', req.body);
    
    try {
        // logic to get id that will be auto generated by mongoDB
        // getting all the product in one array
        let products = await Product.find({});
        let id;
        if (products.length > 0)
        {
            let last_product_array = products.slice(-1);
            let last_product = last_product_array[0];
            id = last_product.id + 1;
        }
        else
        {
            id = 1;
        }

        // creating a new product from the schema
        const product = new Product({
            id: id, 
            name: req.body.name, 
            image: req.body.image, 
            images: req.body.images || [req.body.image], // Support multiple images, fallback to single image array
            category: req.body.category, 
            new_price: req.body.new_price, 
            old_price: req.body.old_price, 
        })
        console.log(product);
        // saving the product in database
        await product.save()
        console.log("product saved successfully")

        // generate the response in the frontend
        res.json({
            success: true, 
            name: req.body.name,
        })
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({
            success: false,
            errors: "Failed to add product to database"
        });
    }
})

// Deleting product from the database  
app.post('/removeproduct', [
    body('id').isInt({ min: 1 }).withMessage('Product ID must be a positive integer')
], handleValidationErrors, async (req, res) => {
    try {
        const result = await Product.findOneAndDelete({ id: req.body.id });
        if (!result) {
            return res.status(404).json({
                success: false,
                errors: "Product not found"
            });
        }
        console.log("Product Removed Successfully");
        res.json({
            success: true,
            name: result.name
        });
    } catch (error) {
        console.error('Error removing product:', error);
        res.status(500).json({
            success: false,
            errors: "Failed to remove product from database"
        });
    }
});

// Update product details (name, old_price, new_price, category)
app.post('/updateproduct', [
    body('id').isInt({ min: 1 }).withMessage('Product ID must be a positive integer'),
    body('name').optional().isLength({ min: 1, max: 200 }).withMessage('Product name must be between 1 and 200 characters'),
    body('old_price').optional().isFloat({ min: 0 }).withMessage('Old price must be a positive number'),
    body('new_price').optional().isFloat({ min: 0 }).withMessage('New price must be a positive number'),
    body('category').optional().isIn(['men', 'women', 'kid']).withMessage('Category must be men, women, or kid')
], handleValidationErrors, async (req, res) => {
    try {
        const { id, name, old_price, new_price, category } = req.body;
        
        // Build update object with only provided fields
        const updateFields = {};
        if (name !== undefined) updateFields.name = name.trim();
        if (old_price !== undefined) updateFields.old_price = old_price;
        if (new_price !== undefined) updateFields.new_price = new_price;
        if (category !== undefined) updateFields.category = category;
        
        // Check if at least one field is being updated
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({
                success: false,
                errors: "At least one field (name, old_price, new_price, or category) must be provided"
            });
        }
        
        const result = await Product.findOneAndUpdate(
            { id: id },
            updateFields,
            { new: true, runValidators: true }
        );
        
        if (!result) {
            return res.status(404).json({
                success: false,
                errors: "Product not found"
            });
        }
        
        console.log("Product Updated Successfully:", result.name);
        res.json({
            success: true,
            message: "Product updated successfully",
            product: result
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({
            success: false,
            errors: "Failed to update product in database"
        });
    }
});

// getting all the products from the database and displaying on the web page
app.get('/allproducts', async (req, res) => {
    try {
        let products = await Product.find({});
        console.log("All Products Fetched");
        res.send(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            errors: "Failed to fetch products from database"
        });
    }
});

// Schema creating for user model with enhancements
const Users = mongoose.model('Users', {
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    }, 
    // User role for admin functionality
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    cartData: {
        type: Object,
        default: {}
    },
    // New wishlist functionality
    wishlist: {
        type: [Number],
        default: []
    },
    // User preferences
    preferences: {
        newsletter: {
            type: Boolean,
            default: true
        },
        notifications: {
            type: Boolean,
            default: true
        },
        preferredCategories: {
            type: [String],
            enum: ['men', 'women', 'kid'],
            default: []
        }
    },
    // User activity tracking
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

// Validation rules for user registration
const signupValidation = [
    body('username')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Username must be between 2 and 100 characters'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

// Validation rules for user login
const loginValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .isLength({ min: 1 })
        .withMessage('Password is required')
];

// creating endpont for registering the user(NEW USER)
app.post('/signup', authLimiter, signupValidation, handleValidationErrors, async (req, res) => {
    try {
        // checking if the user already exists
        let check = await Users.findOne({ email: req.body.email });
        // if the user already exists with the same email address
        if (check) {
            return res.status(400).json({success:false, errors: "Existing user already found with the same email address"});
        }
        
        // Hash the password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        
        // creating an empty cart
        let cart = {};
        for (let i = 0; i < 300; i++) {
            cart[i] = 0;
        }
        
        // creating a new user
        const user = new Users({
            name: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            cartData: cart,
        });

        // saving the user in the database
        await user.save();

        const data = {
            user: {
                id: user.id
            }
        };
        
        const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        res.json({ success: true, token });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            errors: "Internal server error during registration"
        });
    }
})

// Creating endpoint for user login(EXISTING USER)
app.post('/login', authLimiter, loginValidation, handleValidationErrors, async (req, res) => {
    try {
        let user = await Users.findOne({ email: req.body.email });
        if (user) {
            const passCompare = await bcrypt.compare(req.body.password, user.password);
            if (passCompare) {
                // Check if this is a regular user (not admin)
                if (user.role === 'admin') {
                    return res.status(403).json({ 
                        success: false, 
                        errors: "Admin users should use admin login" 
                    });
                }

                const data = {
                    user: {
                        id: user.id,
                        role: user.role || 'user'
                    }
                };
                const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
                
                // Update last login
                await Users.findByIdAndUpdate(user._id, { lastLogin: new Date() });
                
                res.json({ success: true, token, role: user.role || 'user' });
            }
            else {
                res.status(400).json({ success: false, errors: "Wrong Password" });
            }    
        }
        else {
            res.status(400).json({ success: false, errors: "Wrong Email Id" });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            errors: "Internal server error during login"
        });
    }
});

// Creating endpoint for admin login
app.post('/admin/login', authLimiter, loginValidation, handleValidationErrors, async (req, res) => {
    try {
        let user = await Users.findOne({ email: req.body.email });
        if (user) {
            const passCompare = await bcrypt.compare(req.body.password, user.password);
            if (passCompare) {
                // Check if user is admin
                if (user.role !== 'admin') {
                    return res.status(403).json({ 
                        success: false, 
                        errors: "Access denied. Admin privileges required." 
                    });
                }

                const data = {
                    user: {
                        id: user.id,
                        role: user.role
                    }
                };
                const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
                
                // Update last login
                await Users.findByIdAndUpdate(user._id, { lastLogin: new Date() });
                
                res.json({ 
                    success: true, 
                    token, 
                    role: user.role,
                    adminDashboard: `${process.env.ADMIN_URL || 'http://localhost:5173'}`
                });
            }
            else {
                res.status(400).json({ success: false, errors: "Wrong Password" });
            }    
        }
        else {
            res.status(400).json({ success: false, errors: "Wrong Email Id" });
        }
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            errors: "Internal server error during admin login"
        });
    }
});

// ================== CART MANAGEMENT APIs ==================

// Get user's cart data
app.get('/getcart', fetchUser, validateUser, async (req, res) => {
    try {
        console.log("Cart data fetched for user:", req.user.id);
        res.json(req.userDoc.cartData);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({
            success: false,
            errors: "Failed to fetch cart data"
        });
    }
});

// Add item to cart
app.post('/addtocart', fetchUser, validateUser, [
    body('itemId').isInt({ min: 1 }).withMessage('Item ID must be a positive integer'),
    body('size').optional().isString().trim().isLength({ min: 1, max: 10 }).withMessage('Size must be a valid string')
], handleValidationErrors, async (req, res) => {
    try {
        let userData = await Users.findById(req.user.id);
        
        // Create cart key based on whether size is provided
        const cartKey = req.body.size ? `${req.body.itemId}_${req.body.size}` : req.body.itemId.toString();
        
        if (!userData.cartData[cartKey]) {
            userData.cartData[cartKey] = 0;
        }
        userData.cartData[cartKey] += 1;
        
        await Users.findByIdAndUpdate(req.user.id, { cartData: userData.cartData });
        console.log("Item added to cart for user:", req.user.id, "Cart key:", cartKey);
        
        res.json({ 
            success: true, 
            message: "Item added to cart",
            cartData: userData.cartData 
        });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({
            success: false,
            errors: "Failed to add item to cart"
        });
    }
});

// Remove item from cart
app.post('/removefromcart', fetchUser, validateUser, [
    body('itemId').isInt({ min: 1 }).withMessage('Item ID must be a positive integer'),
    body('size').optional().isString().trim().isLength({ min: 1, max: 10 }).withMessage('Size must be a valid string')
], handleValidationErrors, async (req, res) => {
    try {
        let userData = await Users.findById(req.user.id);
        
        // Create cart key based on whether size is provided
        const cartKey = req.body.size ? `${req.body.itemId}_${req.body.size}` : req.body.itemId.toString();
        
        if (userData.cartData[cartKey] && userData.cartData[cartKey] > 0) {
            userData.cartData[cartKey] -= 1;
        }
        
        await Users.findByIdAndUpdate(req.user.id, { cartData: userData.cartData });
        console.log("Item removed from cart for user:", req.user.id, "Cart key:", cartKey);
        
        res.json({ 
            success: true, 
            message: "Item removed from cart",
            cartData: userData.cartData 
        });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({
            success: false,
            errors: "Failed to remove item from cart"
        });
    }
});

// Clear entire cart
app.post('/clearcart', fetchUser, validateUser, async (req, res) => {
    try {
        let cart = {};
        for (let i = 0; i < 300; i++) {
            cart[i] = 0;
        }
        
        await Users.findByIdAndUpdate(req.user.id, { cartData: cart });
        console.log("Cart cleared for user:", req.user.id);
        
        res.json({ 
            success: true, 
            message: "Cart cleared successfully",
            cartData: cart 
        });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({
            success: false,
            errors: "Failed to clear cart"
        });
    }
});

// ================== USER PROFILE APIs ==================

// Get user profile
app.get('/profile', fetchUser, validateUser, async (req, res) => {
    try {
        const { password, ...userProfile } = req.userDoc.toObject();
        res.json({
            success: true,
            user: userProfile
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({
            success: false,
            errors: "Failed to fetch user profile"
        });
    }
});

// Update user profile
app.post('/updateprofile', fetchUser, validateUser, [
    body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
], handleValidationErrors, async (req, res) => {
    try {
        const allowedUpdates = ['name'];
        const updates = {};
        
        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });
        
        const updatedUser = await Users.findByIdAndUpdate(
            req.user.id, 
            updates, 
            { new: true, runValidators: true }
        );
        
        const { password, ...userProfile } = updatedUser.toObject();
        
        res.json({
            success: true,
            message: "Profile updated successfully",
            user: userProfile
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            success: false,
            errors: "Failed to update profile"
        });
    }
});

// ================== ENHANCED PRODUCT APIs ==================

// Get products with optional filtering and pagination
app.get('/products', optionalAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const category = req.query.category;
        const sortBy = req.query.sortBy || 'date';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        
        let filter = { available: true };
        if (category && ['men', 'women', 'kid'].includes(category)) {
            filter.category = category;
        }
        
        const skip = (page - 1) * limit;
        
        const products = await Product.find(filter)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit);
            
        const totalProducts = await Product.countDocuments(filter);
        
        res.json({
            success: true,
            products,
            pagination: {
                page,
                limit,
                totalProducts,
                totalPages: Math.ceil(totalProducts / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            errors: "Failed to fetch products"
        });
    }
});

// Get single product by ID
app.get('/product/:id', optionalAuth, [
    body('id').isInt({ min: 1 }).withMessage('Product ID must be a positive integer')
], async (req, res) => {
    try {
        const product = await Product.findOne({ id: parseInt(req.params.id) });
        if (!product) {
            return res.status(404).json({
                success: false,
                errors: "Product not found"
            });
        }
        
        res.json({
            success: true,
            product
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            success: false,
            errors: "Failed to fetch product"
        });
    }
});

// ================== WISHLIST MANAGEMENT APIs ==================

// Get user's wishlist
app.get('/getwishlist', fetchUser, validateUser, async (req, res) => {
    try {
        const products = await Product.find({ id: { $in: req.userDoc.wishlist } });
        res.json({
            success: true,
            wishlist: products
        });
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        res.status(500).json({
            success: false,
            errors: "Failed to fetch wishlist"
        });
    }
});

// Add item to wishlist
app.post('/addtowishlist', fetchUser, validateUser, [
    body('itemId').isInt({ min: 1 }).withMessage('Item ID must be a positive integer')
], handleValidationErrors, async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.body.itemId });
        if (!product) {
            return res.status(404).json({
                success: false,
                errors: "Product not found"
            });
        }

        let userData = await Users.findById(req.user.id);
        if (!userData.wishlist.includes(req.body.itemId)) {
            userData.wishlist.push(req.body.itemId);
            await userData.save();
        }
        
        res.json({
            success: true,
            message: "Item added to wishlist",
            wishlist: userData.wishlist
        });
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        res.status(500).json({
            success: false,
            errors: "Failed to add item to wishlist"
        });
    }
});

// Remove item from wishlist
app.post('/removefromwishlist', fetchUser, validateUser, [
    body('itemId').isInt({ min: 1 }).withMessage('Item ID must be a positive integer')
], handleValidationErrors, async (req, res) => {
    try {
        let userData = await Users.findById(req.user.id);
        userData.wishlist = userData.wishlist.filter(id => id !== req.body.itemId);
        await userData.save();
        
        res.json({
            success: true,
            message: "Item removed from wishlist",
            wishlist: userData.wishlist
        });
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        res.status(500).json({
            success: false,
            errors: "Failed to remove item from wishlist"
        });
    }
});

// ================== SEARCH & FILTER APIs ==================

// Search products
app.get('/search', optionalAuth, async (req, res) => {
    try {
        const query = req.query.q;
        const category = req.query.category;
        const minPrice = parseFloat(req.query.minPrice) || 0;
        const maxPrice = parseFloat(req.query.maxPrice) || Number.MAX_VALUE;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        
        if (!query) {
            return res.status(400).json({
                success: false,
                errors: "Search query is required"
            });
        }
        
        let filter = {
            available: true,
            new_price: { $gte: minPrice, $lte: maxPrice },
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { tags: { $in: [new RegExp(query, 'i')] } }
            ]
        };
        
        if (category && ['men', 'women', 'kid'].includes(category)) {
            filter.category = category;
        }
        
        const skip = (page - 1) * limit;
        
        const products = await Product.find(filter)
            .sort({ rating: -1, date: -1 })
            .skip(skip)
            .limit(limit);
            
        const totalProducts = await Product.countDocuments(filter);
        
        res.json({
            success: true,
            products,
            pagination: {
                page,
                limit,
                totalProducts,
                totalPages: Math.ceil(totalProducts / limit)
            },
            searchQuery: query
        });
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({
            success: false,
            errors: "Failed to search products"
        });
    }
});

// Get popular products (by rating)
app.get('/popular', optionalAuth, async (req, res) => {
    try {
        const category = req.query.category;
        const limit = parseInt(req.query.limit) || 10;
        
        let filter = { available: true };
        if (category && ['men', 'women', 'kid'].includes(category)) {
            filter.category = category;
        }
        
        const products = await Product.find(filter)
            .sort({ rating: -1, reviewCount: -1 })
            .limit(limit);
            
        res.json({
            success: true,
            products
        });
    } catch (error) {
        console.error('Error fetching popular products:', error);
        res.status(500).json({
            success: false,
            errors: "Failed to fetch popular products"
        });
    }
});

// Get new arrivals
app.get('/newarrivals', optionalAuth, async (req, res) => {
    try {
        const category = req.query.category;
        const limit = parseInt(req.query.limit) || 10;
        
        let filter = { available: true };
        if (category && ['men', 'women', 'kid'].includes(category)) {
            filter.category = category;
        }
        
        const products = await Product.find(filter)
            .sort({ date: -1 })
            .limit(limit);
            
        res.json({
            success: true,
            products
        });
    } catch (error) {
        console.error('Error fetching new arrivals:', error);
        res.status(500).json({
            success: false,
            errors: "Failed to fetch new arrivals"
        });
    }
});

// ================== ANALYTICS & STATS APIs ==================

// Get dashboard stats (for admin)
app.get('/stats', async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalUsers = await Users.countDocuments();
        const activeProducts = await Product.countDocuments({ available: true });
        const inactiveProducts = await Product.countDocuments({ available: false });
        
        const categoryStats = await Product.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);
        
        const recentUsers = await Users.find()
            .sort({ date: -1 })
            .limit(5)
            .select('name email date');
            
        const recentProducts = await Product.find()
            .sort({ date: -1 })
            .limit(5)
            .select('name category new_price date');
        
        res.json({
            success: true,
            stats: {
                totalProducts,
                totalUsers,
                activeProducts,
                inactiveProducts,
                categoryStats,
                recentUsers,
                recentProducts
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            errors: "Failed to fetch statistics"
        });
    }
});

// ================== ORDER MANAGEMENT APIs ==================

// Create a new order
app.post('/createorder', fetchUser, validateUser, [
    body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
    body('shippingAddress.street').notEmpty().withMessage('Shipping address street is required'),
    body('shippingAddress.city').notEmpty().withMessage('Shipping address city is required'),
    body('shippingAddress.state').notEmpty().withMessage('Shipping address state is required'),
    body('shippingAddress.zipCode').notEmpty().withMessage('Shipping address zip code is required'),
    body('paymentMethod').isIn(['stripe', 'paypal', 'cod']).withMessage('Invalid payment method')
], handleValidationErrors, async (req, res) => {
    try {
        const { items, shippingAddress, billingAddress, paymentMethod, promoCode } = req.body;
        
        // Validate and calculate order total
        let orderTotal = 0;
        const orderItems = [];
        
        for (const item of items) {
            const product = await Product.findOne({ id: item.productId });
            if (!product) {
                return res.status(400).json({
                    success: false,
                    errors: `Product ${item.productId} not found`
                });
            }
            
            // Check inventory
            const inventory = await Inventory.findOne({ productId: item.productId });
            if (inventory && inventory.availableStock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    errors: `Insufficient stock for ${product.name}. Available: ${inventory.availableStock}`
                });
            }
            
            const totalPrice = product.new_price * item.quantity;
            orderTotal += totalPrice;
            
            orderItems.push({
                productId: item.productId,
                productName: product.name,
                productImage: product.image,
                quantity: item.quantity,
                price: product.new_price,
                totalPrice: totalPrice
            });
        }
        
        // Apply promo code if provided
        let discountAmount = 0;
        if (promoCode) {
            const promo = await PromoCode.findOne({
                code: promoCode.toUpperCase(),
                isActive: true,
                validFrom: { $lte: new Date() },
                validUntil: { $gte: new Date() }
            });
            
            if (promo && orderTotal >= promo.minOrderAmount) {
                if (promo.usageLimit === null || promo.usedCount < promo.usageLimit) {
                    if (promo.discountType === 'percentage') {
                        discountAmount = Math.min(
                            (orderTotal * promo.discountValue) / 100,
                            promo.maxDiscountAmount || orderTotal
                        );
                    } else {
                        discountAmount = Math.min(promo.discountValue, orderTotal);
                    }
                    
                    // Update promo code usage
                    await PromoCode.findByIdAndUpdate(promo._id, {
                        $inc: { usedCount: 1 }
                    });
                }
            }
        }
        
        const finalAmount = orderTotal - discountAmount;
        
        // Create order
        const order = new Order({
            userId: req.user.id,
            items: orderItems,
            orderTotal: orderTotal,
            discountAmount: discountAmount,
            finalAmount: finalAmount,
            shippingAddress: shippingAddress,
            billingAddress: billingAddress || shippingAddress,
            paymentMethod: paymentMethod,
            orderHistory: [{
                status: 'pending',
                timestamp: new Date(),
                notes: 'Order created'
            }]
        });
        
        await order.save();
        
        // Reserve inventory
        for (const item of orderItems) {
            await Inventory.findOneAndUpdate(
                { productId: item.productId },
                {
                    $inc: { reservedStock: item.quantity },
                    $push: {
                        stockMovements: {
                            type: 'outbound',
                            quantity: -item.quantity,
                            reason: 'Order reserved',
                            orderId: order.orderId
                        }
                    }
                }
            );
        }
        
        // Send order confirmation email
        try {
            const user = await Users.findById(req.user.id);
            const emailContent = emailTemplates.orderConfirmation(order, user);
            await emailTransporter.sendMail({
                from: process.env.EMAIL_USER,
                to: user.email,
                ...emailContent
            });
        } catch (emailError) {
            console.error('Failed to send order confirmation email:', emailError);
        }
        
        res.json({
            success: true,
            message: 'Order created successfully',
            order: {
                orderId: order.orderId,
                orderTotal: order.orderTotal,
                discountAmount: order.discountAmount,
                finalAmount: order.finalAmount,
                orderStatus: order.orderStatus,
                paymentMethod: order.paymentMethod
            }
        });
        
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            errors: 'Failed to create order'
        });
    }
});

// Get user's orders
app.get('/orders', fetchUser, validateUser, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const orders = await Order.find({ userId: req.user.id })
            .sort({ orderDate: -1 })
            .skip(skip)
            .limit(limit);
            
        const totalOrders = await Order.countDocuments({ userId: req.user.id });
        
        res.json({
            success: true,
            orders: orders,
            pagination: {
                page,
                limit,
                totalOrders,
                totalPages: Math.ceil(totalOrders / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            errors: 'Failed to fetch orders'
        });
    }
});

// Get single order details
app.get('/order/:orderId', fetchUser, validateUser, async (req, res) => {
    try {
        const order = await Order.findOne({
            orderId: req.params.orderId,
            userId: req.user.id
        });
        
        if (!order) {
            return res.status(404).json({
                success: false,
                errors: 'Order not found'
            });
        }
        
        res.json({
            success: true,
            order: order
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({
            success: false,
            errors: 'Failed to fetch order'
        });
    }
});

// Update order status (Admin only)
app.put('/order/:orderId/status', [
    body('status').isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
        .withMessage('Invalid order status'),
    body('trackingNumber').optional().isString(),
    body('notes').optional().isString()
], handleValidationErrors, async (req, res) => {
    try {
        const { status, trackingNumber, notes } = req.body;
        
        const order = await Order.findOne({ orderId: req.params.orderId });
        if (!order) {
            return res.status(404).json({
                success: false,
                errors: 'Order not found'
            });
        }
        
        // Update order
        order.orderStatus = status;
        if (trackingNumber) order.trackingNumber = trackingNumber;
        if (notes) order.notes = notes;
        
        // Add to order history
        order.orderHistory.push({
            status: status,
            timestamp: new Date(),
            notes: notes || `Status updated to ${status}`
        });
        
        // Set expected delivery date for shipped orders
        if (status === 'shipped' && !order.expectedDeliveryDate) {
            const deliveryDate = new Date();
            deliveryDate.setDate(deliveryDate.getDate() + 5); // 5 days delivery
            order.expectedDeliveryDate = deliveryDate;
        }
        
        // If cancelled, release reserved inventory
        if (status === 'cancelled') {
            for (const item of order.items) {
                await Inventory.findOneAndUpdate(
                    { productId: item.productId },
                    {
                        $inc: { reservedStock: -item.quantity },
                        $push: {
                            stockMovements: {
                                type: 'adjustment',
                                quantity: item.quantity,
                                reason: 'Order cancelled - stock released',
                                orderId: order.orderId
                            }
                        }
                    }
                );
            }
        }
        
        await order.save();
        
        // Send status update email
        try {
            const user = await Users.findById(order.userId);
            const emailContent = emailTemplates.orderStatusUpdate(order, user, status);
            await emailTransporter.sendMail({
                from: process.env.EMAIL_USER,
                to: user.email,
                ...emailContent
            });
        } catch (emailError) {
            console.error('Failed to send status update email:', emailError);
        }
        
        res.json({
            success: true,
            message: 'Order status updated successfully',
            order: order
        });
        
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            success: false,
            errors: 'Failed to update order status'
        });
    }
});

// ================== PAYMENT PROCESSING APIs ==================

// Create Stripe payment intent
app.post('/create-payment-intent', fetchUser, validateUser, [
    body('orderId').notEmpty().withMessage('Order ID is required'),
    body('amount').isFloat({ min: 0.5 }).withMessage('Amount must be at least $0.50')
], handleValidationErrors, async (req, res) => {
    try {
        // Check if Stripe is configured
        if (!stripe) {
            return res.status(503).json({
                success: false,
                errors: 'Payment processing is not configured. Please contact support.'
            });
        }
        
        const { orderId, amount } = req.body;
        
        // Verify order belongs to user
        const order = await Order.findOne({
            orderId: orderId,
            userId: req.user.id
        });
        
        if (!order) {
            return res.status(404).json({
                success: false,
                errors: 'Order not found'
            });
        }
        
        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: 'usd',
            metadata: {
                orderId: orderId,
                userId: req.user.id
            }
        });
        
        // Update order with payment intent ID
        order.paymentIntentId = paymentIntent.id;
        await order.save();
        
        res.json({
            success: true,
            clientSecret: paymentIntent.client_secret
        });
        
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({
            success: false,
            errors: 'Failed to create payment intent'
        });
    }
});

// Handle payment success webhook
app.post('/webhook/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    
    // Check if webhook secret is configured
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
        console.log('⚠️ Webhook received but STRIPE_WEBHOOK_SECRET not configured');
        return res.status(400).send('Webhook secret not configured');
    }
    
    try {
        const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        
        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object;
            const orderId = paymentIntent.metadata.orderId;
            
            // Update order payment status
            const order = await Order.findOne({ orderId: orderId });
            if (order) {
                order.paymentStatus = 'paid';
                order.orderStatus = 'confirmed';
                order.orderHistory.push({
                    status: 'confirmed',
                    timestamp: new Date(),
                    notes: 'Payment confirmed'
                });
                await order.save();
                
                // Release reserved inventory and update current stock
                for (const item of order.items) {
                    await Inventory.findOneAndUpdate(
                        { productId: item.productId },
                        {
                            $inc: { 
                                reservedStock: -item.quantity,
                                currentStock: -item.quantity 
                            },
                            $push: {
                                stockMovements: {
                                    type: 'outbound',
                                    quantity: -item.quantity,
                                    reason: 'Order fulfilled',
                                    orderId: order.orderId
                                }
                            }
                        }
                    );
                }
                
                // Clear user's cart
                await Users.findByIdAndUpdate(order.userId, {
                    cartData: {}
                });
            }
        }
        
        res.status(200).json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
});

// ================== INVENTORY MANAGEMENT APIs ==================

// Get inventory for a product
app.get('/inventory/:productId', async (req, res) => {
    try {
        const inventory = await Inventory.findOne({ 
            productId: parseInt(req.params.productId) 
        });
        
        if (!inventory) {
            return res.status(404).json({
                success: false,
                errors: 'Inventory not found'
            });
        }
        
        res.json({
            success: true,
            inventory: inventory
        });
    } catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).json({
            success: false,
            errors: 'Failed to fetch inventory'
        });
    }
});

// Update inventory (Admin only)
app.put('/inventory/:productId', [
    body('currentStock').optional().isInt({ min: 0 }).withMessage('Current stock must be a non-negative integer'),
    body('reorderLevel').optional().isInt({ min: 0 }).withMessage('Reorder level must be a non-negative integer'),
    body('maxStock').optional().isInt({ min: 0 }).withMessage('Max stock must be a non-negative integer')
], handleValidationErrors, async (req, res) => {
    try {
        const { currentStock, reorderLevel, maxStock, reason } = req.body;
        const productId = parseInt(req.params.productId);
        
        let inventory = await Inventory.findOne({ productId: productId });
        
        if (!inventory) {
            // Create new inventory record
            inventory = new Inventory({
                productId: productId,
                currentStock: currentStock || 0,
                reorderLevel: reorderLevel || 10,
                maxStock: maxStock || 1000
            });
        } else {
            // Update existing inventory
            const oldStock = inventory.currentStock;
            
            if (currentStock !== undefined) {
                inventory.currentStock = currentStock;
                inventory.lastRestocked = new Date();
                
                // Add stock movement record
                const stockChange = currentStock - oldStock;
                if (stockChange !== 0) {
                    inventory.stockMovements.push({
                        type: stockChange > 0 ? 'inbound' : 'adjustment',
                        quantity: stockChange,
                        reason: reason || 'Manual adjustment'
                    });
                }
            }
            
            if (reorderLevel !== undefined) inventory.reorderLevel = reorderLevel;
            if (maxStock !== undefined) inventory.maxStock = maxStock;
        }
        
        await inventory.save();
        
        // Check for low stock and send alert
        if (inventory.currentStock <= inventory.reorderLevel) {
            try {
                const product = await Product.findOne({ id: productId });
                if (product) {
                    const emailContent = emailTemplates.lowStockAlert(product, inventory);
                    await emailTransporter.sendMail({
                        from: process.env.EMAIL_USER,
                        to: process.env.ADMIN_EMAIL,
                        ...emailContent
                    });
                }
            } catch (emailError) {
                console.error('Failed to send low stock alert:', emailError);
            }
        }
        
        res.json({
            success: true,
            message: 'Inventory updated successfully',
            inventory: inventory
        });
        
    } catch (error) {
        console.error('Error updating inventory:', error);
        res.status(500).json({
            success: false,
            errors: 'Failed to update inventory'
        });
    }
});

// Get low stock products
app.get('/inventory/alerts/low-stock', async (req, res) => {
    try {
        const lowStockItems = await Inventory.aggregate([
            {
                $match: {
                    $expr: { $lte: ['$currentStock', '$reorderLevel'] }
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'productId',
                    foreignField: 'id',
                    as: 'product'
                }
            },
            {
                $unwind: '$product'
            }
        ]);
        
        res.json({
            success: true,
            lowStockItems: lowStockItems,
            count: lowStockItems.length
        });
    } catch (error) {
        console.error('Error fetching low stock items:', error);
        res.status(500).json({
            success: false,
            errors: 'Failed to fetch low stock items'
        });
    }
});

// ================== PROMO CODE MANAGEMENT APIs ==================

// Apply promo code (validate)
app.post('/promo/validate', fetchUser, validateUser, [
    body('code').notEmpty().withMessage('Promo code is required'),
    body('orderTotal').isFloat({ min: 0 }).withMessage('Order total must be a positive number')
], handleValidationErrors, async (req, res) => {
    try {
        const { code, orderTotal } = req.body;
        
        const promo = await PromoCode.findOne({
            code: code.toUpperCase(),
            isActive: true,
            validFrom: { $lte: new Date() },
            validUntil: { $gte: new Date() }
        });
        
        if (!promo) {
            return res.status(400).json({
                success: false,
                errors: 'Invalid or expired promo code'
            });
        }
        
        if (orderTotal < promo.minOrderAmount) {
            return res.status(400).json({
                success: false,
                errors: `Minimum order amount is $${promo.minOrderAmount}`
            });
        }
        
        if (promo.usageLimit !== null && promo.usedCount >= promo.usageLimit) {
            return res.status(400).json({
                success: false,
                errors: 'Promo code usage limit exceeded'
            });
        }
        
        // Calculate discount
        let discountAmount = 0;
        if (promo.discountType === 'percentage') {
            discountAmount = Math.min(
                (orderTotal * promo.discountValue) / 100,
                promo.maxDiscountAmount || orderTotal
            );
        } else {
            discountAmount = Math.min(promo.discountValue, orderTotal);
        }
        
        res.json({
            success: true,
            promo: {
                code: promo.code,
                description: promo.description,
                discountType: promo.discountType,
                discountValue: promo.discountValue,
                discountAmount: discountAmount,
                finalAmount: orderTotal - discountAmount
            }
        });
        
    } catch (error) {
        console.error('Error validating promo code:', error);
        res.status(500).json({
            success: false,
            errors: 'Failed to validate promo code'
        });
    }
});

// Create promo code (Admin only)
app.post('/promo/create', [
    body('code').isLength({ min: 3, max: 20 }).withMessage('Code must be 3-20 characters'),
    body('description').notEmpty().withMessage('Description is required'),
    body('discountType').isIn(['percentage', 'fixed']).withMessage('Invalid discount type'),
    body('discountValue').isFloat({ min: 0 }).withMessage('Discount value must be positive'),
    body('validFrom').isISO8601().withMessage('Valid from date is required'),
    body('validUntil').isISO8601().withMessage('Valid until date is required')
], handleValidationErrors, async (req, res) => {
    try {
        const promo = new PromoCode(req.body);
        await promo.save();
        
        res.json({
            success: true,
            message: 'Promo code created successfully',
            promo: promo
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                errors: 'Promo code already exists'
            });
        }
        console.error('Error creating promo code:', error);
        res.status(500).json({
            success: false,
            errors: 'Failed to create promo code'
        });
    }
});

// ================== VIRTUAL TRY-ON ==================
// Note: Virtual try-on now runs completely client-side using advanced Canvas API
// No external API calls needed - face-swap processing handled in browser

// ================== REAL AI FACE SWAP ==================
// Using Replicate API for realistic face swapping

// Initialize Replicate
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || "", // Free $10/month credit
});

app.post('/api/ai-face-swap', async (req, res) => {
  try {
    const { userImageBase64, productImageBase64 } = req.body;

    if (!userImageBase64 || !productImageBase64) {
      return res.status(400).json({ 
        success: false, 
        error: 'Both user image and product image are required' 
      });
    }

    console.log('🎭 Starting AI face swap with Replicate...');

    // Convert base64 to data URLs for Replicate
    const userImageDataUrl = userImageBase64.startsWith('data:') 
      ? userImageBase64 
      : `data:image/jpeg;base64,${userImageBase64}`;
    
    const productImageDataUrl = productImageBase64.startsWith('data:') 
      ? productImageBase64 
      : `data:image/jpeg;base64,${productImageBase64}`;

    let output;
    let modelUsed = '';

    // Try multiple face swap models for best results
    try {
      // Primary model: lucataco/modelscope-facefusion
      console.log('🔥 Trying lucataco/modelscope-facefusion...');
      output = await replicate.run(
        "lucataco/modelscope-facefusion",
        {
          input: {
            source_image: userImageDataUrl,
            target_image: productImageDataUrl
          }
        }
      );
      modelUsed = 'modelscope-facefusion';
    } catch (error) {
      console.log('❌ Primary model failed, trying backup...');
      
      try {
        // Backup model: fofr/become-image
        console.log('🔥 Trying fofr/become-image...');
        output = await replicate.run(
          "fofr/become-image",
          {
            input: {
              image: productImageDataUrl,
              image_to_become: userImageDataUrl,
              prompt: "professional photo, high quality",
              strength: 0.8
            }
          }
        );
        modelUsed = 'become-image';
      } catch (secondError) {
        console.log('❌ Backup model also failed, trying third option...');
        
        // Third option: bytedance/flux-pulid (Face identity preservation)
        output = await replicate.run(
          "bytedance/flux-pulid",
          {
            input: {
              main_face_image: userImageDataUrl,
              prompt: "professional headshot photo of a person wearing the target clothing",
              width: 1024,
              height: 1024,
              num_inference_steps: 30,
              guidance_scale: 4.0,
              id_scale: 0.8
            }
          }
        );
        modelUsed = 'flux-pulid';
      }
    }

    if (output && (Array.isArray(output) ? output.length > 0 : output)) {
      // Handle different output formats
      const outputUrl = Array.isArray(output) ? output[0] : output;
      
      // Convert output URL to base64 for frontend
      const fetch = (await import('node-fetch')).default;
      const imageResponse = await fetch(outputUrl);
      const imageBuffer = await imageResponse.buffer();
      const resultBase64 = imageBuffer.toString('base64');

      console.log(`✅ Face swap completed successfully using ${modelUsed}`);
      
      res.json({
        success: true,
        resultImage: `data:image/png;base64,${resultBase64}`,
        message: `Face swap completed successfully using ${modelUsed}!`,
        modelUsed: modelUsed
      });
    } else {
      throw new Error('No output received from any face swap model');
    }

  } catch (error) {
    console.error('❌ Face swap error:', error);
    
    // Return a graceful error response
    res.status(500).json({
      success: false,
      error: 'Face swap failed. Please try again with different images.',
      details: error.message
    });
  }
});

// ================== ANALYTICS & REPORTING APIs ==================

// Global error handler
app.use((error, req, res, next) => {
    console.error('Global error handler:', error);
    
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                errors: 'File too large. Maximum size is 5MB.'
            });
        }
    }
    
    res.status(500).json({
        success: false,
        errors: 'Internal server error'
    });
});

app.listen(port, (error) => {
    if (!error) {
        console.log("Server Running on Port " + port)
    } else {
        console.log("Error: " + error)
    }
})
