const Store = require('../models/storeModel');

/**
 * Lấy store của user từ userId trong JWT token
 * @param {string} userId - User ID từ req.user.userId
 * @returns {Promise<Object>} Store object
 * @throws {Error} Nếu không tìm thấy store
 */
const getUserStore = async (userId) => {
  const store = await Store.findOne({ owner_id: userId });
  if (!store) {
    throw new Error('Store not found for this user');
  }
  return store;
};

/**
 * Lấy storeId của user
 * @param {string} userId - User ID từ req.user.userId
 * @returns {Promise<string>} Store ID
 * @throws {Error} Nếu không tìm thấy store
 */
const getUserStoreId = async (userId) => {
  const store = await getUserStore(userId);
  return store._id.toString();
};

/**
 * Kiểm tra xem user có quyền truy cập store không
 * @param {string} userId - User ID từ req.user.userId
 * @param {string} storeId - Store ID cần kiểm tra
 * @returns {Promise<boolean>} True nếu user sở hữu store
 */
const isStoreOwner = async (userId, storeId) => {
  const store = await Store.findById(storeId);
  if (!store) {
    return false;
  }
  return store.owner_id.toString() === userId;
};

module.exports = {
  getUserStore,
  getUserStoreId,
  isStoreOwner
};
