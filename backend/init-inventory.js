const mongoose = require('mongoose');
require('dotenv').config();

// Database Connection
mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://rhyme:password@cluster0.8qqns.mongodb.net/e-commerce");

// Inventory Schema
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

// Initialize inventory for products 1-36
async function initializeInventory() {
    try {
        console.log('🔄 Initializing inventory data...');
        
        for (let productId = 1; productId <= 36; productId++) {
            const existingInventory = await Inventory.findOne({ productId: productId });
            
            if (!existingInventory) {
                const randomStock = Math.floor(Math.random() * 100) + 20; // Between 20-120 items
                
                const inventory = new Inventory({
                    productId: productId,
                    currentStock: randomStock,
                    reservedStock: 0,
                    reorderLevel: 15,
                    maxStock: 500,
                    stockMovements: [{
                        type: 'inbound',
                        quantity: randomStock,
                        reason: 'Initial stock setup'
                    }]
                });
                
                await inventory.save();
                console.log(`✅ Created inventory for product ${productId} with ${randomStock} items`);
            } else {
                console.log(`⏭️  Inventory already exists for product ${productId}`);
            }
        }
        
        console.log('🎉 Inventory initialization complete!');
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error initializing inventory:', error);
        process.exit(1);
    }
}

initializeInventory(); 