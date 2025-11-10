const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define User schema (same as in index.js)
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
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    cartData: {
        type: Object,
        default: {}
    },
    wishlist: {
        type: [Number],
        default: []
    },
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

async function seedAdmin() {
    try {
        // Check if admin already exists
        const existingAdmin = await Users.findOne({ email: 'admin@shopper.com' });
        
        if (existingAdmin) {
            console.log('✅ Admin user already exists with email: admin@shopper.com');
            if (existingAdmin.role !== 'admin') {
                // Update existing user to admin
                await Users.findByIdAndUpdate(existingAdmin._id, { role: 'admin' });
                console.log('✅ Updated existing user to admin role');
            }
            return;
        }

        // Hash the admin password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash('admin123', saltRounds);
        
        // Create empty cart
        let cart = {};
        for (let i = 0; i < 300; i++) {
            cart[i] = 0;
        }
        
        // Create admin user
        const adminUser = new Users({
            name: 'Admin User',
            email: 'admin@shopper.com',
            password: hashedPassword,
            role: 'admin',
            cartData: cart,
            wishlist: [],
            preferences: {
                newsletter: false,
                notifications: true,
                preferredCategories: []
            }
        });

        await adminUser.save();
        
        console.log('🎉 Admin user created successfully!');
        console.log('📧 Email: admin@shopper.com');
        console.log('🔑 Password: admin123');
        console.log('⚠️  Please change the password after first login!');
        
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
    } finally {
        mongoose.connection.close();
    }
}

// Run the seeding function
seedAdmin();
