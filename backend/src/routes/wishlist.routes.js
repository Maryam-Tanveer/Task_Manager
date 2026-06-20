const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist.controller');

/**
 * @swagger
 * tags:
 *   - name: Wishlist
 *     description: Wishlist management endpoints
 */

/**
 * @swagger
 * /api/wishlist/{userId}:
 *   get:
 *     tags:
 *       - Wishlist
 *     summary: Get user's wishlist
 *     description: Retrieve all items in user's wishlist
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Wishlist retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Wishlist'
 *       404:
 *         description: Wishlist not found
 */
router.get('/:userId', wishlistController.getWishlist);

/**
 * @swagger
 * /api/wishlist/{userId}/add:
 *   post:
 *     tags:
 *       - Wishlist
 *     summary: Add item to wishlist
 *     description: Add a product to user's wishlist
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Item added to wishlist successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Wishlist'
 */
router.post('/:userId/add', wishlistController.addToWishlist);

/**
 * @swagger
 * /api/wishlist/{userId}/remove/{productId}:
 *   delete:
 *     tags:
 *       - Wishlist
 *     summary: Remove item from wishlist
 *     description: Remove a product from user's wishlist
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *       - name: productId
 *         in: path
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item removed from wishlist successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Wishlist'
 */
router.delete('/:userId/remove/:productId', wishlistController.removeFromWishlist);

/**
 * @swagger
 * /api/wishlist/{userId}/toggle:
 *   put:
 *     tags:
 *       - Wishlist
 *     summary: Toggle wishlist item
 *     description: Add item if not present, remove if already present
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Wishlist item toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Wishlist'
 */
router.put('/:userId/toggle', wishlistController.toggleWishlistItem);

/**
 * @swagger
 * /api/wishlist/{userId}/check/{productId}:
 *   get:
 *     tags:
 *       - Wishlist
 *     summary: Check if product is in wishlist
 *     description: Check if a product is in user's wishlist
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *       - name: productId
 *         in: path
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Check result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 isInWishlist:
 *                   type: boolean
 */
router.get('/:userId/check/:productId', wishlistController.isInWishlist);

/**
 * @swagger
 * /api/wishlist/{userId}/clear:
 *   delete:
 *     tags:
 *       - Wishlist
 *     summary: Clear entire wishlist
 *     description: Remove all items from user's wishlist
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Wishlist cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.delete('/:userId/clear', wishlistController.clearWishlist);

module.exports = router;
