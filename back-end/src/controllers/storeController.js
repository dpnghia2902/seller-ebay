const Store = require('../models/storeModel');
const User = require('../models/userModel');

// 🧱 Tạo shop mới (chỉ khi user là buyer)
const createStore = async (req, res) => {
  try {
    const { name, description, address, banner_url } = req.body;
    const user_id = req.user.userId; // từ JWT middleware

    const user = await User.findById(user_id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role === 'seller') {
      return res.status(400).json({ message: 'User already has a shop' });
    }

    // Kiểm tra tên shop đã tồn tại chưa
    const existingShop = await Store.findOne({ name });
    if (existingShop) {
      return res.status(400).json({ message: 'Shop name already exists' });
    }

    // Tạo shop mới
    const newShop = new Store({
      owner_id: user._id,
      name,
      description,
      banner_url,
      address
    });

    await newShop.save();

    // Cập nhật role của user thành "seller"
    user.role = 'seller';
    await user.save();

    res.status(201).json({
      message: 'Shop created successfully',
      shop: newShop
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get All Stores
const getStores = async (req, res) => {
  try {
    const stores = await Store.find();
    res.status(200).json(stores);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching stores', error: err.message });
  }
};

// Get Store by ID
const getStoreById = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    res.status(200).json(store);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching store', error: err.message });
  }
};

// ✏️ Cập nhật thông tin shop (chỉ chủ shop mới có quyền)
const updateStore = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const { id } = req.params;
    const updates = req.body;

    const shop = await Shop.findById(id);
    if (!shop) return res.status(404).json({ message: 'Shop not found' });

    if (shop.owner_id.toString() !== user_id) {
      return res.status(403).json({ message: 'Not authorized to update this shop' });
    }

    Object.assign(shop, updates);
    shop.updated_at = Date.now();

    await shop.save();

    res.json({ message: 'Shop updated successfully', shop });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete Store
const deleteStore = async (req, res) => {
  try {
    const deletedStore = await Store.findByIdAndDelete(req.params.id);
    if (!deletedStore) {
      return res.status(404).json({ message: 'Store not found' });
    }
    res.status(200).json({ message: 'Store deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting store', error: err.message });
  }
};

module.exports = { createStore, getStores, getStoreById, updateStore, deleteStore };
