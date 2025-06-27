const port = 4000;
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require('fs');

const app = express();

app.use(express.json());
app.use(cors());

// Database Connection With MongoDB
mongoose.connect("mongodb+srv://rhyme:password@cluster0.8qqns.mongodb.net/e-commerce");

// Schema for Creating Products
const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
    default: "A quality product from our collection"
  },
  sizes: {
    type: [String],
    default: ["S", "M", "L", "XL"]
  },
  colors: {
    type: [String],
    default: ["Default"]
  },
  tags: {
    type: [String],
    default: []
  },
  stock: {
    type: Number,
    default: 100
  },
  rating: {
    type: Number,
    default: 4,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  }
});

async function fixImageURLs() {
  try {
    console.log('🔧 Fixing product image URLs...');
    
    // Get all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products to fix`);
    
    // Create placeholder images if they don't exist
    const uploadDir = path.join(__dirname, 'upload', 'images');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    for (let i = 1; i <= 36; i++) {
      const placeholderPath = path.join(uploadDir, `product_${i}.png`);
      if (!fs.existsSync(placeholderPath)) {
        // Create a simple placeholder image (1x1 pixel)
        const placeholder = Buffer.from([
          0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
          0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
          0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
          0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
          0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41,
          0x54, 0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00,
          0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01,
          0xE5, 0x27, 0xDE, 0xFC, 0x00, 0x00, 0x00, 0x00,
          0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
        ]);
        fs.writeFileSync(placeholderPath, placeholder);
        console.log(`Created placeholder image: product_${i}.png`);
      }
    }
    
    // Update each product with correct image URL
    for (const product of products) {
      const correctImageURL = `http://localhost:4000/images/product_${product.id}.png`;
      
      await Product.findOneAndUpdate(
        { id: product.id },
        { image: correctImageURL },
        { new: true }
      );
      
      console.log(`✅ Updated product ${product.id}: ${product.name}`);
    }
    
    console.log('🎉 All product images fixed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error fixing images:', error);
    process.exit(1);
  }
}

fixImageURLs(); 