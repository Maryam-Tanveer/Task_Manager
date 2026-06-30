const Wishlist = require('../models/Wishlist');
const logger = require('../utils/logger');
const mongoose = require('mongoose');

/**
 * Get user's wishlist
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;

    logger.info(`❤️ Fetching wishlist for user: ${userId}`);

    let wishlist = await Wishlist.findOne({ userId }).populate('items.productId');

    if (!wishlist) {
      // Create empty wishlist if doesn't exist
      wishlist = new Wishlist({
        userId,
        items: [],
      });
      await wishlist.save();
    }

    res.json({
      success: true,
      data: wishlist,
    });
  } catch (error) {
    logger.error(`❌ Error fetching wishlist: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wishlist',
    });
  }
};

/**
 * Add item to wishlist
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.addToWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, title, price, image, category } = req.body;

    logger.info(`➕ Adding to wishlist for user: ${userId}`);

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({
        userId,
        items: [],
      });
    }

    // Check if item already exists
    const existingItem = wishlist.items.find(
      (item) => item.productId.toString() === productId.toString()
    );

    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist',
      });
    }

    // Add item to wishlist
    wishlist.items.push({
      productId,
      title,
      price,
      image,
      category,
      addedAt: new Date(),
    });

    await wishlist.save();

    logger.info(`✅ Item added to wishlist: ${productId}`);

    res.status(201).json({
      success: true,
      message: 'Item added to wishlist',
      data: wishlist,
    });
  } catch (error) {
    logger.error(`❌ Error adding to wishlist: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to add item to wishlist',
    });
  }
};

/**
 * Remove item from wishlist
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.removeFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    logger.info(`➖ Removing from wishlist for user: ${userId}`);

    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found',
      });
    }

    // Remove item from wishlist
    wishlist.items = wishlist.items.filter(
      (item) => item.productId.toString() !== productId.toString()
    );

    await wishlist.save();

    logger.info(`✅ Item removed from wishlist: ${productId}`);

    res.json({
      success: true,
      message: 'Item removed from wishlist',
      data: wishlist,
    });
  } catch (error) {
    logger.error(`❌ Error removing from wishlist: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from wishlist',
    });
  }
};

/**
 * Toggle wishlist item (add if not present, remove if present)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.toggleWishlistItem = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, title, price, image, category } = req.body;

    logger.info(`🔄 Toggling wishlist for user: ${userId}`);

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({
        userId,
        items: [],
      });
    }

    // Check if item exists
    const existingItemIndex = wishlist.items.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    if (existingItemIndex > -1) {
      // Remove item
      wishlist.items.splice(existingItemIndex, 1);
      logger.info(`✅ Item removed from wishlist: ${productId}`);
    } else {
      // Add item
      wishlist.items.push({
        productId,
        title,
        price,
        image,
        category,
        addedAt: new Date(),
      });
      logger.info(`✅ Item added to wishlist: ${productId}`);
    }

    await wishlist.save();

    res.json({
      success: true,
      message: existingItemIndex > -1 ? 'Item removed from wishlist' : 'Item added to wishlist',
      data: wishlist,
      inWishlist: existingItemIndex === -1,
    });
  } catch (error) {
    logger.error(`❌ Error toggling wishlist: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle wishlist item',
    });
  }
};

/**
 * Check if product is in wishlist
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.isInWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    logger.info(`🔍 Checking if product in wishlist: ${productId}`);

    const wishlist = await Wishlist.findOne({
      userId,
      'items.productId': mongoose.Types.ObjectId(productId),
    });

    res.json({
      success: true,
      inWishlist: !!wishlist,
    });
  } catch (error) {
    logger.error(`❌ Error checking wishlist: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to check wishlist',
    });
  }
};

/**
 * Clear entire wishlist
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.clearWishlist = async (req, res) => {
  try {
    const { userId } = req.params;

    logger.info(`🗑️ Clearing wishlist for user: ${userId}`);

    const wishlist = await Wishlist.findOneAndUpdate({ userId }, { items: [] }, { new: true });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found',
      });
    }

    logger.info(`✅ Wishlist cleared`);

    res.json({
      success: true,
      message: 'Wishlist cleared successfully',
      data: wishlist,
    });
  } catch (error) {
    logger.error(`❌ Error clearing wishlist: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to clear wishlist',
    });
  }
};
