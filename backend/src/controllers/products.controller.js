const Product = require('../models/Product');
const logger = require('../utils/logger');

/**
 * Get all products with filtering, sorting, and search
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllProducts = async (req, res) => {
  try {
    const { category, search, sortBy, page = 1, limit = 20, minPrice, maxPrice } = req.query;

    logger.info('📦 Fetching all products');

    // Build filter query
    const filter = { isActive: true };

    if (category && category !== 'all') {
      filter.category = category.toLowerCase();
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Search functionality
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [search.toLowerCase()] } },
      ];
    }

    // Build sort query
    let sortQuery = { createdAt: -1 }; // Default: newest first
    if (sortBy === 'price-low') {
      sortQuery = { price: 1 };
    } else if (sortBy === 'price-high') {
      sortQuery = { price: -1 };
    } else if (sortBy === 'rating') {
      sortQuery = { rating: -1 };
    } else if (sortBy === 'popular') {
      sortQuery = { reviewCount: -1 };
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const products = await Product.find(filter)
      .sort(sortQuery)
      .skip(skip)
      .limit(limitNum)
      .select('name description price discountPrice category image rating reviewCount stock');

    // Get total count
    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: products,
      pagination: {
        current: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    logger.error(`❌ Error fetching products: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Get single product by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    logger.info(`🔍 Fetching product with ID: ${id}`);

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    logger.error(`❌ Error fetching product: ${error.message}`);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
    });
  }
};

/**
 * Get product categories
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getCategories = async (req, res) => {
  try {
    logger.info('📂 Fetching product categories');

    const categories = await Product.distinct('category', { isActive: true });

    res.json({
      success: true,
      data: categories.sort(),
      count: categories.length,
    });
  } catch (error) {
    logger.error(`❌ Error fetching categories: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
    });
  }
};

/**
 * Create new product (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, image, rating } = req.body;

    logger.info(`✨ Creating new product: ${name}`);

    // Validate required fields
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, price, and category are required',
      });
    }

    // Create product
    const product = new Product({
      name,
      description,
      price,
      category,
      stock: stock || 0,
      image,
      rating: rating || 0,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    logger.error(`❌ Error creating product: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Update product (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    logger.info(`✏️ Updating product with ID: ${id}`);

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    logger.error(`❌ Error updating product: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
    });
  }
};

/**
 * Delete product (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    logger.info(`🗑️ Deleting product with ID: ${id}`);

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    logger.error(`❌ Error deleting product: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
    });
  }
};

/**
 * Get featured products
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    logger.info('⭐ Fetching featured products');

    const products = await Product.find({ isActive: true })
      .sort({ rating: -1, reviewCount: -1 })
      .limit(parseInt(limit))
      .select('name description price discountPrice category image rating reviewCount');

    res.json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (error) {
    logger.error(`❌ Error fetching featured products: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured products',
    });
  }
};
