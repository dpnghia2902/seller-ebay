const Product = require('../models/productModel');
const Store = require('../models/storeModel');
const Inventory = require('../models/inventoryModel');

// Create Product for a specific store
const createProduct = async (req, res) => {
  try {
    const { storeId } = req.params;

    // Verify store exists
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Handle images from multer
    const images = req.files ? req.files.map(file => file.path) : [];

    const productData = {
      ...req.body,
      store_id: storeId,
      images: images,
      updated_at: Date.now()
    };

    const newProduct = new Product(productData);
    await newProduct.save();

    // Create initial inventory entry
    const inventory = new Inventory({
      product_id: newProduct._id,
      quantity: req.body.initial_quantity || 0,
      location: req.body.location || ''
    });
    await inventory.save();

    res.status(201).json({
      product: newProduct,
      inventory: inventory
    });
  } catch (err) {
    res.status(400).json({ message: 'Error creating product', error: err.message });
  }
};

// Get All Products for a specific store
const getStoreProducts = async (req, res) => {
  try {
    const { storeId } = req.params;

    // Verify store exists
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const products = await Product.find({ store_id: storeId });
    res.status(200).json(products);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching products', error: err.message });
  }
};

// Get Product by ID for a specific store
const getStoreProductById = async (req, res) => {
  try {
    const { storeId, productId } = req.params;

    const product = await Product.findOne({ _id: productId, store_id: storeId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found in this store' });
    }

    // Also get inventory information
    const inventory = await Inventory.findOne({ product_id: productId });

    res.status(200).json({
      product: product,
      inventory: inventory
    });
  } catch (err) {
    res.status(400).json({ message: 'Error fetching product', error: err.message });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  try {
    const { storeId, productId } = req.params;

    // Verify product belongs to store
    const product = await Product.findOne({ _id: productId, store_id: storeId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found in this store' });
    }

    // Handle new images from multer
    const newImages = req.files ? req.files.map(file => file.path) : [];
    
    const updateData = {
      ...req.body,
      updated_at: Date.now()
    };

    // If new images are uploaded, add them to existing images
    if (newImages.length > 0) {
      updateData.images = [...product.images, ...newImages];
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: 'Error updating product', error: err.message });
  }
};

// Hide/Unhide Product
const toggleProductVisibility = async (req, res) => {
  try {
    const { storeId, productId } = req.params;

    const product = await Product.findOne({ _id: productId, store_id: storeId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found in this store' });
    }

    product.is_hidden = !product.is_hidden;
    product.updated_at = Date.now();
    await product.save();

    res.status(200).json({
      message: `Product ${product.is_hidden ? 'hidden' : 'visible'} successfully`,
      product: product
    });
  } catch (err) {
    res.status(400).json({ message: 'Error updating product visibility', error: err.message });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const { storeId, productId } = req.params;

    const product = await Product.findOne({ _id: productId, store_id: storeId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found in this store' });
    }

    // Delete associated inventory
    await Inventory.deleteMany({ product_id: productId });

    // Delete product
    await Product.findByIdAndDelete(productId);

    res.status(200).json({ message: 'Product and associated inventory deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting product', error: err.message });
  }
};

module.exports = {
  createProduct,
  getStoreProducts,
  getStoreProductById,
  updateProduct,
  toggleProductVisibility,
  deleteProduct
};
