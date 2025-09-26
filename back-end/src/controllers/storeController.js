const Store = require('../models/storeModel');

// Create Store
const createStore = async (req, res) => {
  try {
    const newStore = new Store(req.body);
    await newStore.save();
    res.status(201).json(newStore);
  } catch (err) {
    res.status(400).json({ message: 'Error creating store', error: err.message });
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

// Update Store
const updateStore = async (req, res) => {
  try {
    const updatedStore = await Store.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedStore) {
      return res.status(404).json({ message: 'Store not found' });
    }
    res.status(200).json(updatedStore);
  } catch (err) {
    res.status(400).json({ message: 'Error updating store', error: err.message });
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
