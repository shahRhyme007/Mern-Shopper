const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => {
        console.error('❌ MongoDB connection failed:', err);
        process.exit(1);
    });

// Product Schema
const Product = mongoose.model("Product", {
    id: Number,
    name: String,
    image: String,
    images: [String],
    category: String,
    new_price: Number,
    old_price: Number,
    date: Date,
    available: Boolean
});

async function fixImageUrls() {
    try {
        console.log('🔍 Finding products with localhost image URLs...\n');
        
        // Get your Render backend URL from environment or use default
        const BACKEND_URL = process.env.BACKEND_URL || 'https://mern-shopper.onrender.com';
        
        // Find all products with localhost in image URL
        const products = await Product.find({
            $or: [
                { image: /localhost/ },
                { images: /localhost/ }
            ]
        });
        
        console.log(`📦 Found ${products.length} products with localhost URLs\n`);
        
        if (products.length === 0) {
            console.log('✅ No products need fixing!');
            process.exit(0);
        }
        
        let fixedCount = 0;
        
        for (const product of products) {
            const oldImage = product.image;
            
            // Fix main image URL
            if (product.image && product.image.includes('localhost')) {
                // Extract just the filename part
                const filename = product.image.split('/images/').pop();
                product.image = `${BACKEND_URL}/images/${filename}`;
            }
            
            // Fix images array URLs
            if (product.images && Array.isArray(product.images)) {
                product.images = product.images.map(img => {
                    if (img && img.includes('localhost')) {
                        const filename = img.split('/images/').pop();
                        return `${BACKEND_URL}/images/${filename}`;
                    }
                    return img;
                });
            }
            
            await product.save();
            fixedCount++;
            
            console.log(`✅ Fixed: ${product.name}`);
            console.log(`   Old: ${oldImage}`);
            console.log(`   New: ${product.image}\n`);
        }
        
        console.log(`\n🎉 Successfully updated ${fixedCount} products!`);
        console.log(`\n⚠️  IMPORTANT: Images must exist on Render server!`);
        console.log(`   Current images on Render will be lost on restart (ephemeral filesystem)`);
        console.log(`   Consider uploading images again through admin panel or use Cloudinary`);
        
    } catch (error) {
        console.error('❌ Error fixing image URLs:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n👋 Database connection closed');
        process.exit(0);
    }
}

// Run the fix
fixImageUrls();

