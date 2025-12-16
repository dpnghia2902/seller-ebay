const Product = require('../models/productModel');
const Store = require('../models/storeModel');
const Inventory = require('../models/inventoryModel');
const { getUserStoreId, isStoreOwner } = require('../utils/storeHelper');

// Create Product for a specific store
const createProduct = async (req, res) => {
  try {
    const { storeId } = req.params;

    // Verify store exists
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Kiểm tra quyền sở hữu store (chỉ owner mới được tạo sản phẩm)
    if (store.owner_id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You do not have permission to add products to this store' });
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

    // Verify store exists and check ownership
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Kiểm tra quyền sở hữu store
    if (store.owner_id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You do not have permission to update products in this store' });
    }

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

    // Verify store exists and check ownership
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Kiểm tra quyền sở hữu store
    if (store.owner_id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You do not have permission to modify products in this store' });
    }

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

    // Verify store exists and check ownership
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Kiểm tra quyền sở hữu store
    if (store.owner_id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You do not have permission to delete products from this store' });
    }

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

// ============= NEW FUNCTIONS FOR FRONTEND COMPATIBILITY =============

// GET /api/products?search=&status=&page=&limit=
// Get all products của user's store với pagination và filters
const getAllProducts = async (req, res) => {
  try {
    // Lấy storeId từ userId trong JWT
    const storeId = await getUserStoreId(req.user.userId);

    // Parse query parameters
    const { search = '', status = '', page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build query
    const query = { store_id: storeId };

    // Search filter (title hoặc description)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } }
      ];
    }

    // Status filter
    if (status) {
      if (status.toLowerCase() === 'hidden') {
        query.is_hidden = true;
      } else if (status.toLowerCase() === 'available') {
        query.is_hidden = false;
      }
    }

    // Execute query với pagination
    const [products, total] = await Promise.all([
      Product.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ created_at: -1 }),
      Product.countDocuments(query)
    ]);

    // Calculate total pages
    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
      products,
      total,
      page: parseInt(page),
      totalPages
    });
  } catch (err) {
    res.status(400).json({ message: 'Error fetching products', error: err.message });
  }
};

// GET /api/products/:productId
// Get single product by ID (không cần storeId trong path)
const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    // Lấy storeId từ userId trong JWT
    const storeId = await getUserStoreId(req.user.userId);

    const product = await Product.findOne({ _id: productId, store_id: storeId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Get inventory info
    const inventory = await Inventory.findOne({ product_id: productId });

    res.status(200).json({
      ...product.toObject(),
      inventory
    });
  } catch (err) {
    res.status(400).json({ message: 'Error fetching product', error: err.message });
  }
};

// POST /api/products
// Create product với JSON body (hỗ trợ image_url từ frontend)
const createProductNew = async (req, res) => {
  try {
    // Lấy storeId từ userId trong JWT
    const storeId = await getUserStoreId(req.user.userId);

    const { title, description, price, sku, status, image_url, images: imageUrls, initial_quantity = 0 } = req.body;

    // Xử lý images - có thể từ image_url hoặc images array
    let images = [];
    if (image_url) {
      images = [image_url];
    } else if (imageUrls && Array.isArray(imageUrls)) {
      images = imageUrls;
    }

    // Xử lý status -> is_hidden
    const is_hidden = status && status.toLowerCase() === 'hidden';

    const productData = {
      store_id: storeId,
      title,
      description,
      price,
      sku,
      images,
      is_hidden,
      created_at: Date.now(),
      updated_at: Date.now()
    };

    const newProduct = new Product(productData);
    await newProduct.save();

    // Create initial inventory entry
    const inventory = new Inventory({
      product_id: newProduct._id,
      quantity: initial_quantity,
      location: ''
    });
    await inventory.save();

    res.status(201).json({
      ...newProduct.toObject(),
      inventory
    });
  } catch (err) {
    res.status(400).json({ message: 'Error creating product', error: err.message });
  }
};

// PUT /api/products/:productId
// Update product với JSON body
const updateProductNew = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Lấy storeId từ userId trong JWT
    const storeId = await getUserStoreId(req.user.userId);

    // Verify product belongs to user's store
    const product = await Product.findOne({ _id: productId, store_id: storeId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { title, description, price, sku, status, image_url, images: imageUrls } = req.body;

    const updateData = {
      updated_at: Date.now()
    };

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (sku !== undefined) updateData.sku = sku;

    // Xử lý status -> is_hidden
    if (status !== undefined) {
      updateData.is_hidden = status.toLowerCase() === 'hidden';
    }

    // Xử lý images
    if (image_url) {
      updateData.images = [image_url];
    } else if (imageUrls && Array.isArray(imageUrls)) {
      updateData.images = imageUrls;
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

// PATCH /api/products/:productId/status
// Update product status với giá trị cụ thể (Available/Hidden)
const updateProductStatus = async (req, res) => {
  try {
    const { productId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    // Lấy storeId từ userId trong JWT
    const storeId = await getUserStoreId(req.user.userId);

    const product = await Product.findOne({ _id: productId, store_id: storeId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Set is_hidden based on status
    const is_hidden = status.toLowerCase() === 'hidden';

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { is_hidden, updated_at: Date.now() },
      { new: true }
    );

    res.status(200).json({
      message: `Product status updated to ${status}`,
      product: updatedProduct
    });
  } catch (err) {
    res.status(400).json({ message: 'Error updating product status', error: err.message });
  }
};

// POST /api/products/upload-image
// Upload single image và return URL
const uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Return image URL and ID
    const imageUrl = req.file.path;
    const imageId = req.file.filename;

    res.status(200).json({
      url: imageUrl,
      imageId: imageId
    });
  } catch (err) {
    res.status(400).json({ message: 'Error uploading image', error: err.message });
  }
};

// POST /api/products/draft
// Save product as draft
const saveDraft = async (req, res) => {
  try {
    // Lấy storeId từ userId trong JWT
    const storeId = await getUserStoreId(req.user.userId);

    const { title, description, price, sku, image_url, images: imageUrls } = req.body;

    // Xử lý images
    let images = [];
    if (image_url) {
      images = [image_url];
    } else if (imageUrls && Array.isArray(imageUrls)) {
      images = imageUrls;
    }

    // Draft product is hidden by default
    const productData = {
      store_id: storeId,
      title: title || 'Draft Product',
      description: description || '',
      price: price || 0,
      sku: sku || `DRAFT-${Date.now()}`,
      images,
      is_hidden: true, // Draft products are hidden
      created_at: Date.now(),
      updated_at: Date.now()
    };

    const newProduct = new Product(productData);
    await newProduct.save();

    // Create initial inventory entry
    const inventory = new Inventory({
      product_id: newProduct._id,
      quantity: 0,
      location: ''
    });
    await inventory.save();

    res.status(201).json({
      message: 'Draft saved successfully',
      product: newProduct,
      inventory
    });
  } catch (err) {
    res.status(400).json({ message: 'Error saving draft', error: err.message });
  }
};

// DELETE /api/products/:productId
// Delete product (không cần storeId trong path)
const deleteProductNew = async (req, res) => {
  try {
    const { productId } = req.params;

    // Lấy storeId từ userId trong JWT
    const storeId = await getUserStoreId(req.user.userId);

    const product = await Product.findOne({ _id: productId, store_id: storeId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
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
  deleteProduct,
  // New functions for frontend compatibility
  getAllProducts,
  getProductById,
  createProductNew,
  updateProductNew,
  updateProductStatus,
  uploadProductImage,
  saveDraft,
  deleteProductNew
};
