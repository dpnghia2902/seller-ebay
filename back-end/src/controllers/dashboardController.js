const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const Inventory = require('../models/inventoryModel');

/**
 * GET /api/dashboard/summary
 * Returns: { totalSales: number, income: number }
 * totalSales = total number of completed orders
 * income = total revenue from completed orders
 */
exports.getSummary = async (req, res) => {
  try {
    // Get current month start and end dates
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // Calculate total sales (number of orders) in current month
    const totalSales = await Order.countDocuments({
      status: { $in: ['delivered'] },
      created_at: { $gte: startOfMonth, $lte: endOfMonth }
    });

    // Calculate total income (sum of total_amount) in current month
    const incomeResult = await Order.aggregate([
      {
        $match: {
          status: { $in: ['delivered'] },
          created_at: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: '$total_amount' }
        }
      }
    ]);

    const income = incomeResult.length > 0 ? incomeResult[0].totalIncome : 0;

    res.json({
      totalSales,
      income: Math.round(income * 100) / 100 // Round to 2 decimal places
    });
  } catch (error) {
    console.error('Error getting dashboard summary:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard summary',
      error: error.message
    });
  }
};

/**
 * GET /api/dashboard/sales-monthly
 * Returns: [ { month: string, value: number }, ... ]
 * Returns monthly sales data for the last 6-12 months
 */
exports.getMonthlySales = async (req, res) => {
  try {
    const monthsToShow = parseInt(req.query.months) || 6; // Default to 6 months
    const now = new Date();
    
    // Calculate start date (6 months ago)
    const startDate = new Date(now.getFullYear(), now.getMonth() - monthsToShow + 1, 1);

    // Aggregate sales by month
    const monthlySales = await Order.aggregate([
      {
        $match: {
          status: { $in: ['delivered'] },
          created_at: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$created_at' },
            month: { $month: '$created_at' }
          },
          value: { $sum: '$total_amount' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Month names mapping
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Create a map of existing data
    const salesMap = new Map();
    monthlySales.forEach(item => {
      const key = `${item._id.year}-${item._id.month}`;
      salesMap.set(key, Math.round(item.value * 100) / 100);
    });

    // Generate complete array with all months, filling in zeros where needed
    const result = [];
    for (let i = monthsToShow - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const key = `${year}-${month}`;
      
      result.push({
        month: monthNames[month - 1],
        value: salesMap.get(key) || 0
      });
    }

    res.json(result);
  } catch (error) {
    console.error('Error getting monthly sales:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching monthly sales',
      error: error.message
    });
  }
};

/**
 * GET /api/dashboard/top-products
 * Returns: { products: [ { id, name, color, price, sold, status } ] }
 * Returns top selling products (products with most orders)
 */
exports.getTopProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10; // Default to top 10 products

    // Aggregate to find products with most orders
    const topProductsData = await Order.aggregate([
      {
        $match: {
          status: { $in: ['delivered'] }
        }
      },
      {
        $unwind: '$items' // Unwind the items array
      },
      {
        $group: {
          _id: '$items.product_id',
          sold: { $sum: '$items.quantity' }
        }
      },
      {
        $sort: { sold: -1 }
      },
      {
        $limit: limit
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      {
        $unwind: '$productDetails'
      },
      {
        $lookup: {
          from: 'inventories',
          localField: 'productDetails.inventory',
          foreignField: '_id',
          as: 'inventoryDetails'
        }
      },
      {
        $unwind: {
          path: '$inventoryDetails',
          preserveNullAndEmptyArrays: true
        }
      }
    ]);

    // Format the response to match frontend expectations
    const products = topProductsData.map(item => {
      const product = item.productDetails;
      const inventory = item.inventoryDetails;
      
      // Determine color from specifications or tags
      let color = 'N/A';
      if (product.specifications && product.specifications.color) {
        color = product.specifications.color;
      } else if (product.tags && product.tags.length > 0) {
        color = product.tags[0];
      }

      // Determine status based on inventory
      let status = 'In stock';
      if (inventory) {
        if (inventory.quantity === 0) {
          status = 'Out of stock';
        } else if (inventory.quantity <= inventory.reorderLevel) {
          status = 'Low stock';
        }
      }

      return {
        id: product._id,
        name: product.name,
        color: color,
        price: product.price,
        sold: item.sold,
        status: status,
        image: product.images && product.images.length > 0 ? product.images[0] : null
      };
    });

    res.json({
      products
    });
  } catch (error) {
    console.error('Error getting top products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching top products',
      error: error.message
    });
  }
};
