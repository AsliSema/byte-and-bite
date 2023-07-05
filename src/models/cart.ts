import { Schema, model, Document, Types } from 'mongoose';
import { IDish } from './dish.ts';

export interface ICart extends Document {
  _id: string;
  user: Types.ObjectId;
  dishes?: IDish[];
  createdAt?: string;
  updatedAt?: string;
}

const cartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'cart must belong to user'],
    },
    dishes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Dish',
        required: false,
      },
    ],
  },
  { timestamps: true }
);

const Cart = model<ICart>('Cart', cartSchema);
export default Cart;
