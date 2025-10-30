const Shop = require('../models/shopModel');
const User = require('../models/userModel');

// 🧱 Tạo shop mới (chỉ khi user là buyer)
const createShop = async (req, res) => {
  try {
    const { shop_name, description, address, banner_url } = req.body;
    const user_id = req.user.userId; // từ JWT middleware

    const user = await User.findById(user_id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role === 'seller') {
      return res.status(400).json({ message: 'User already has a shop' });
    }

    // Kiểm tra tên shop đã tồn tại chưa
    const existingShop = await Shop.findOne({ shop_name });
    if (existingShop) {
      return res.status(400).json({ message: 'Shop name already exists' });
    }

    // Tạo shop mới
    const newShop = new Shop({
      owner_id: user._id,
      shop_name,
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

// 🔍 Lấy shop theo ID
const getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id).populate('owner_id', 'email name');
    if (!shop) return res.status(404).json({ message: 'Shop not found' });
    res.json(shop);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✏️ Cập nhật thông tin shop (chỉ chủ shop mới có quyền)
const updateShop = async (req, res) => {
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

// 🗑️ Xóa shop (nếu cần, có thể chỉ admin mới có quyền)
const deleteShop = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const { id } = req.params;

    const shop = await Shop.findById(id);
    if (!shop) return res.status(404).json({ message: 'Shop not found' });

    if (shop.owner_id.toString() !== user_id) {
      return res.status(403).json({ message: 'Not authorized to delete this shop' });
    }

    await shop.deleteOne();

    // Hạ cấp user lại thành buyer (tùy logic)
    await User.findByIdAndUpdate(user_id, { role: 'buyer' });

    res.json({ message: 'Shop deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createShop,
  getShopById,
  updateShop,
  deleteShop
};
