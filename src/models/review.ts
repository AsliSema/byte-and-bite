import { Schema, model, Types, Document } from 'mongoose';

export interface IReview extends Document {
  user: Types.ObjectId;
  dish: Types.ObjectId;
  comment?: string;
  rating: number;
}

const reviewSchema = new Schema<IReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },

    dish: {
      type: Schema.Types.ObjectId,
      ref: 'Dish',
      required: [true, 'Review must belong to a dish'],
    },

    comment: {
      type: String,
      required: false,
    },

    rating: {
      type: Number,
      min: [1, 'Min ratings value is 1.0'],
      max: [5, 'Max ratings value is 5.0'],
      required: [true, 'review ratings is required'],
    },
  },
  { timestamps: true }
);

const Review = model<IReview>('Review', reviewSchema);
export default Review;
