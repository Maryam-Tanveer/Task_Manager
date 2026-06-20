const mongoose = require('mongoose');

/**
 * Order Schema
 */
const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
      default: function () {
        return `ORD-${Date.now()}`;
      },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        image: String,
        _id: false,
      },
    ],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingAddress: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
      state: String,
      country: {
        type: String,
        required: true,
      },
    },
    billingAddress: {
      firstName: String,
      lastName: String,
      street: String,
      city: String,
      zipCode: String,
      state: String,
      country: String,
    },
    paymentMethod: {
      type: String,
      enum: ['credit-card', 'debit-card', 'paypal'],
      required: [true, 'Payment method is required'],
    },
    paymentDetails: {
      cardLast4: String,
      cardBrand: String,
      transactionId: String,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    estimatedDelivery: {
      type: Date,
      default: function () {
        return new Date(Date.now() + 5 * 24 * 60 * 60 * 1000); // 5 days from now
      },
    },
    deliveredAt: Date,
    shippingTrackingNumber: String,
    notes: String,
    cancelledAt: Date,
    cancelReason: String,
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

/**
 * Indexes for performance
 */
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ orderId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
