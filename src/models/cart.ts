import { Schema, model, Document, Types } from 'mongoose';

export interface ICart extends Document {
  _id: string;
  cartItems: Array<{ product: Types.ObjectId; quantity: number }>;
  totalCartPrice: number;
  user: Types.ObjectId;
  createdAt?: string;
  updatedAt?: string;
}

const cartSchema = new Schema<ICart>(
  {
    cartItems: [
      {
        product: {
          type: Schema.ObjectId,
          ref: 'Dish',
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    totalCartPrice: {
      type: Number,
      default: 0,
    },
    user: {
      type: Schema.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Cart = model<ICart>('Cart', cartSchema);
export default Cart;
