const Order = require('../models/Order');
const logger = require('../utils/logger');

/**
 * Create a new order
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createOrder = async (req, res) => {
  try {
    const {
      userId,
      items,
      subtotal,
      tax,
      shippingCost,
      total,
      shippingAddress,
      billingAddress,
      paymentMethod,
      paymentDetails,
    } = req.body;

    logger.info(`📝 Creating new order for user: ${userId}`);

    // Validate required fields
    if (!userId || !items || items.length === 0 || !total || !shippingAddress || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields for order creation',
      });
    }

    // Validate items
    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Items must be an array',
      });
    }

    // Create order
    const order = new Order({
      userId,
      items,
      subtotal,
      tax,
      shippingCost: shippingCost || 0,
      total,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      paymentDetails,
      status: 'pending',
    });

    await order.save();

    logger.info(`✅ Order created: ${order.orderId}`);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error) {
    logger.error(`❌ Error creating order: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Get all orders for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    logger.info(`📋 Fetching orders for user: ${userId}`);

    // Build filter
    const filter = { userId };
    if (status) {
      filter.status = status;
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Get orders
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('items.productId', 'name price image');

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: orders,
      pagination: {
        current: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    logger.error(`❌ Error fetching user orders: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
    });
  }
};

/**
 * Get single order by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    logger.info(`🔍 Fetching order: ${orderId}`);

    const order = await Order.findOne({ orderId }).populate('items.productId', 'name price image');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    logger.error(`❌ Error fetching order: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
    });
  }
};

/**
 * Update order status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, deliveredAt, shippingTrackingNumber, cancelReason } = req.body;

    logger.info(`✏️ Updating order status: ${orderId}`);

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status',
      });
    }

    // Build update data
    const updateData = { status };
    if (deliveredAt) updateData.deliveredAt = deliveredAt;
    if (shippingTrackingNumber) updateData.shippingTrackingNumber = shippingTrackingNumber;
    if (status === 'cancelled') {
      updateData.cancelledAt = new Date();
      updateData.cancelReason = cancelReason;
    }

    const order = await Order.findOneAndUpdate({ orderId }, updateData, {
      new: true,
      runValidators: true,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    logger.info(`✅ Order status updated: ${orderId} → ${status}`);

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order,
    });
  } catch (error) {
    logger.error(`❌ Error updating order: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to update order',
    });
  }
};

/**
 * Cancel order
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    logger.info(`❌ Cancelling order: ${orderId}`);

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Only allow cancellation of pending orders
    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status: ${order.status}`,
      });
    }

    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.cancelReason = reason || 'User requested cancellation';

    await order.save();

    logger.info(`✅ Order cancelled: ${orderId}`);

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order,
    });
  } catch (error) {
    logger.error(`❌ Error cancelling order: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
    });
  }
};

/**
 * Get order statistics for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getOrderStats = async (req, res) => {
  try {
    const { userId } = req.params;

    logger.info(`📊 Fetching order stats for user: ${userId}`);

    const stats = await Order.aggregate([
      { $match: { userId: require('mongoose').Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$total' },
          pendingCount: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
          },
          confirmedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] },
          },
          shippedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'shipped'] }, 1, 0] },
          },
          deliveredCount: {
            $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] },
          },
          cancelledCount: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] },
          },
        },
      },
    ]);

    res.json({
      success: true,
      data: stats[0] || {
        totalOrders: 0,
        totalSpent: 0,
        pendingCount: 0,
        confirmedCount: 0,
        shippedCount: 0,
        deliveredCount: 0,
        cancelledCount: 0,
      },
    });
  } catch (error) {
    logger.error(`❌ Error fetching order stats: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order statistics',
    });
  }
};
