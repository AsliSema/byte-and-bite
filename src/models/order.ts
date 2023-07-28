import mongoose, { Schema, model, Document, Types } from 'mongoose';

export interface IOrder extends Document {
  user: Types.ObjectId;
  cookId: string;
  orderItems: Array<{ product: Types.ObjectId; quantity: number }>;
  deliveryFee: number;
  isDelivered: boolean;
  isPaid: boolean;
  totalOrderPrice: number;
  deliveryAddress: string;
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
    isDelivered: { type: Boolean, default: false },
    isPaid: { type: Boolean, default: false },
    totalOrderPrice: { type: Number },
    deliveryAddress: String,
    paymentMethodType: { type: String, default: 'Cash' },
  },
  { timestamps: true }
);

const Order = model<IOrder>('Order', orderSchema);
export default Order;

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateOrderResponse:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        user:
 *          type: string
 *        cookId:
 *          type: string
 *        orderItems:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              product:
 *                type: string
 *              quantity:
 *                type: number
 *        deliveryFee:
 *          type: number
 *        isDelivered:
 *          type: boolean
 *        isPaid:
 *          type: boolean
 *        totalOrderPrice:
 *          type: number
 *        deliveryAddress:
 *          type: string
 *        paymentMethodType:
 *          type: string
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 */
