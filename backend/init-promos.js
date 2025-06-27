const mongoose = require('mongoose');
require('dotenv').config();

// Database Connection
mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://rhyme:password@cluster0.8qqns.mongodb.net/e-commerce");

// PromoCode Schema
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

// Sample promo codes
const samplePromos = [
    {
        code: 'WELCOME10',
        description: 'Welcome discount - 10% off your first order',
        discountType: 'percentage',
        discountValue: 10,
        minOrderAmount: 50,
        maxDiscountAmount: 20,
        usageLimit: null,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        applicableCategories: []
    },
    {
        code: 'SAVE20',
        description: 'Save $20 on orders over $100',
        discountType: 'fixed',
        discountValue: 20,
        minOrderAmount: 100,
        usageLimit: 100,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 3 months from now
        applicableCategories: []
    },
    {
        code: 'SUMMER25',
        description: 'Summer sale - 25% off all items',
        discountType: 'percentage',
        discountValue: 25,
        minOrderAmount: 0,
        maxDiscountAmount: 50,
        usageLimit: 500,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 2 months from now
        applicableCategories: []
    },
    {
        code: 'FREESHIP',
        description: 'Free shipping on any order',
        discountType: 'fixed',
        discountValue: 15, // Typical shipping cost
        minOrderAmount: 0,
        usageLimit: null,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 month from now
        applicableCategories: []
    },
    {
        code: 'BIGDEAL',
        description: 'Big Deal - 30% off orders over $200',
        discountType: 'percentage',
        discountValue: 30,
        minOrderAmount: 200,
        maxDiscountAmount: 100,
        usageLimit: 50,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        applicableCategories: []
    }
];

async function initializePromos() {
    try {
        console.log('🔄 Initializing promo codes...');
        
        for (const promoData of samplePromos) {
            const existingPromo = await PromoCode.findOne({ code: promoData.code });
            
            if (!existingPromo) {
                const promo = new PromoCode(promoData);
                await promo.save();
                console.log(`✅ Created promo code: ${promoData.code}`);
            } else {
                console.log(`⏭️  Promo code already exists: ${promoData.code}`);
            }
        }
        
        console.log('🎉 Promo codes initialization complete!');
        console.log('\n📋 Available Promo Codes:');
        console.log('• WELCOME10 - 10% off first order over $50');
        console.log('• SAVE20 - $20 off orders over $100');
        console.log('• SUMMER25 - 25% off all items (max $50 discount)');
        console.log('• FREESHIP - Free shipping on any order');
        console.log('• BIGDEAL - 30% off orders over $200 (max $100 discount)');
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error initializing promo codes:', error);
        process.exit(1);
    }
}

initializePromos(); 