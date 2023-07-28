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
    category: "breakfast" | "lunch" | "snack" | "dinner" | "drink" | "dessert";
    specificAllergies: string[];
    soldOut?: boolean;
    slug?: string;
    ratingsAverage?: number;
    ratingsQuantity?: number
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
            values: ["breakfast", "lunch", "snack", "dinner", "drink", "dessert"],
            message: '{VALUE} is not supported'
        }
    },
    specificAllergies: [{
        type: String,
        default: []
    }],
    slug: {
        type: String,
        unique: true
    },
    soldOut: {
        type: Boolean,
        default: false
    },
    ratingsAverage: {
        type: Number,
        min: [0, 'Rating must be equal or greater than 0'],
        max: [5, 'Rating must be equal or less than 5'],
        default: 0,
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    },
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
    }
});


const Dish = model<IDish>("Dish", DishSchema);

export default Dish;




/**
 * @openapi
 * components:
 *   schemas:
 *     CreateDishInputForAdmin:
 *       type: object
 *       required:
 *         - cook
 *         - name
 *         - description
 *         - category 
 *         - quantity
 *         - price
 *       properties:
 *         cook:
 *           type: Types.ObjectId
 *           default: 64b4102c207f8f000c724b84
 *         name:
 *           type: string
 *           default: İçli Köfte
 *         description:
 *           type: string
 *           default: I craft my handmade içli köfte by meticulously selecting fine bulgur, tender beef, and fresh herbs while never compromising on quality and freshness. This unique touch holds the secret, absent in industrial productions, at the heart of my içli köfte; because for me, making içli köfte is not just a job, but also an expression of love and dedication reflecting my culture and values.
 *         specificAllergies:
 *           type: string
 *           default: []      
 *         quantity:
 *           type: number
 *           default: 27
 *         price:
 *           type: number
 *           default: 10 
 *         category:
 *           type: string
 *           default: lunch
 *         images:
 *           type: string
 *           default: []                             
 *     Dish:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           default: İçli Köfte
 *         description:
 *           type: string
 *           default: I craft my handmade içli köfte by meticulously selecting fine bulgur, tender beef, and fresh herbs while never compromising on quality and freshness. This unique touch holds the secret, absent in industrial productions, at the heart of my içli köfte; because for me, making içli köfte is not just a job, but also an expression of love and dedication reflecting my culture and values.
 *         specificAllergies:
 *           type: string
 *           default: []      
 *         quantity:
 *           type: number
 *           default: 27
 *         price:
 *           type: number
 *           default: 10 
 *         category:
 *           type: string
 *           default: lunch
 *         images:
 *           type: string
 *           default: []                             
 */ 



