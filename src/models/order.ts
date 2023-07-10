import mongoose, { Document, Schema } from 'mongoose';

const orderItemSchema = new Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  cookId: { type: Schema.Types.ObjectId, ref: 'Cook' },
  orderItems: [orderItemSchema],
  deliveryFee: { type: Number, required: true },
  totalOrderPrice: { type: Number, required: true },
  paymentMethodType: { type: String, required: true },
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },
});


interface IOrder extends Document {
  user: string;
  cookId?: string;
  orderItems: {
    name: string;
    quantity: number;
    price: number;
  }[];
  deliveryFee: number;
  totalOrderPrice: number;
  paymentMethodType: string;
  isPaid: boolean;
  paidAt?: Date;
}

export const Order = mongoose.model<IOrder>('Order', orderSchema);
