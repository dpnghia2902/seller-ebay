const Inventory = require('../models/inventoryModel');
const Product = require('../models/productModel');
const Store = require('../models/storeModel');

// Get inventory for a specific store
const getStoreInventory = async (req, res) => {
  try {
    const { storeId } = req.params;

    // Verify store exists
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Get all products for this store
    const products = await Product.find({ store_id: storeId });
    const productIds = products.map(p => p._id);

    // Get inventory for all products in this store
    const inventory = await Inventory.find({ product_id: { $in: productIds } })
      .populate('product_id', 'title sku price images');

    res.status(200).json(inventory);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching inventory', error: err.message });
  }
};

// Update inventory quantity
const updateInventory = async (req, res) => {
  try {
    const { inventoryId } = req.params;
    const { quantity, location } = req.body;

    const updateData = { updated_at: Date.now() };
    
    if (quantity !== undefined) {
      if (quantity < 0) {
        return res.status(400).json({ message: 'Quantity cannot be negative' });
      }
      updateData.quantity = quantity;
    }
    
    if (location !== undefined) {
      updateData.location = location;
    }

    const updatedInventory = await Inventory.findByIdAndUpdate(
      inventoryId,
      updateData,
      { new: true }
    ).populate('product_id', 'title sku price');

    if (!updatedInventory) {
      return res.status(404).json({ message: 'Inventory not found' });
    }

    res.status(200).json(updatedInventory);
  } catch (err) {
    res.status(400).json({ message: 'Error updating inventory', error: err.message });
  }
};

// Quick stock adjustment for a product
const adjustProductStock = async (req, res) => {
  try {
    const { storeId, productId } = req.params;
    const { adjustment, location } = req.body;

    if (adjustment === undefined) {
      return res.status(400).json({ message: 'Adjustment value is required' });
    }

    // Verify product belongs to store
    const product = await Product.findOne({ _id: productId, store_id: storeId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found in this store' });
    }

    // Find or create inventory
    let inventory = await Inventory.findOne({ product_id: productId });
    
    if (!inventory) {
      // Create new inventory if doesn't exist
      inventory = new Inventory({
        product_id: productId,
        quantity: Math.max(0, adjustment),
        location: location || '',
        updated_at: Date.now()
      });
    } else {
      // Update existing inventory
      const newQuantity = inventory.quantity + adjustment;
      if (newQuantity < 0) {
        return res.status(400).json({ 
          message: 'Adjustment would result in negative quantity',
          currentQuantity: inventory.quantity,
          attemptedAdjustment: adjustment
        });
      }
      inventory.quantity = newQuantity;
      if (location !== undefined) {
        inventory.location = location;
      }
      inventory.updated_at = Date.now();
    }

    await inventory.save();
    await inventory.populate('product_id', 'title sku price');

    res.status(200).json(inventory);
  } catch (err) {
    res.status(400).json({ message: 'Error adjusting stock', error: err.message });
  }
};

module.exports = {
  getStoreInventory,
  updateInventory,
  adjustProductStock
};
