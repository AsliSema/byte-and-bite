import {Document, Schema, model, Types} from "mongoose";

export interface IDish extends Document{
    name: string;
    cooker: Types.ObjectId;
    description: string;
    images: string[];
    quantity: number;
    price: number;
    category: "vegeterian" | "non-vegeterian" | "gluten-free" | "vegan";
    sold? : boolean;
    slug? : string;
    ratingsAvagare?: number;
    ratingsQuantity?: number
}

const DishSchema = new Schema<IDish>({
    name: {
        type: String,
        required: true
    },
    cooker: {
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },
    description: {
        type: String,
        required: true
    },
    images: {
        type: [
            {
              type: String,
              required: true,
            },
        ],
        minlength: 1,
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        required: true,
        type: String,
        enum: ["vegeterian", "non-vegeterian", "gluten-free", "vegan"]
    },
    sold: Boolean,
    slug: String,
    ratingsAvarage: Number,
    ratingsQuantity: Number,
},
{
    timestamps: true
})

const Dish = model<IDish>("Dish", DishSchema);

export default Dish;