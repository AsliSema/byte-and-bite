import mongoose, { Schema, model, Document, Types } from 'mongoose';

export interface IOrder extends Document {
  user: Types.ObjectId;
  cookId: string;
  orderItems: Array<{product: Types.ObjectId; quantity: number; }>;
  deliveryFee: number;
  totalOrderPrice: number;
  paymentMethodType: string;
}

const orderSchema = new Schema<IOrder>(
  {
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  cookId: String,
  orderItems: [
    {
      product: {
        type: Types.ObjectId,
        ref: 'Dish',
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  deliveryFee: { type: Number, default: 0 },
  totalOrderPrice: { type: Number, default: 0 },
  paymentMethodType: { type: String, default: 'Cash' }
},
{timestamps: true}
);
const Order = model<IOrder>('Order', orderSchema);
export default Order;