import mongoose, { Schema, model, models } from 'mongoose';

const OrderSchema = new Schema(
  {
    clientName: {
      type: String,
      required: true,
    },
    clientEmail: {
      type: String,
      required: true,
    },
    projectTitle: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
    notes: {
      type: String,
    }
  },
  { timestamps: true }
);

const Order = models.Order || model('Order', OrderSchema);

export default Order;
