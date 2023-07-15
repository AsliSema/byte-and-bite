import { Document, Schema, model, Types } from "mongoose";
import slugify from "slugify";

export interface IDish extends Document {
    name: string;
    cook: Types.ObjectId;
    review: Types.ObjectId;
    description: string;
    images: string[];
    quantity: number;
    price: number;
    category: "vegeterian" | "non-vegeterian" | "gluten-free" | "vegan";
    specificAllergies: string[];
    soldOut?: boolean;
    slug?: string;
}

const DishSchema = new Schema<IDish>({
    name: {
        type: String,
        minlength: [2, 'Too short dish title'],
        maxlength: [100, 'Too long dish title'],
        required: true
    },
    cook: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    review: {
        type: Schema.Types.ObjectId,
        ref: 'Review'
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        minlength: [20, 'Too short dish description']
    },
    images: [{
        type: String,
        required: true,
        minlength: [1, 'Add at least 1 image']
    }],
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
        enum: {
            values: ["vegeterian", "non-vegeterian", "gluten-free", "vegan"],
            message: '{VALUE} is not supported'
        }
    },
    specificAllergies: [{
        type: String,
        default: "none"
    }],
    slug: {
        type: String,
        unique: true
    },
    soldOut: Boolean
},
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })


DishSchema.pre<IDish>("validate", async function (this: IDish, next) {
    try {
        const slug = slugify(this.name, { lower: true, strict: true });
        this.slug = slug;
        next();
    } catch (error) {
        // next(error);
        console.log(error);
    }
});

const Dish = model<IDish>("Dish", DishSchema);

export default Dish;


