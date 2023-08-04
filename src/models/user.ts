import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from "bcrypt";

export interface IUser extends Document {
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  profileImage?: string;
  password: string;
  role?: 'admin' | 'cook' | 'customer';
  isActive?: boolean;
  address?: Address;
}

export interface Address {
  city: string;
  district: string;
  neighborhood: string;
  addressInfo: string;
}

const userSchema = new Schema<IUser>({
  firstname: {
    type: String,
    required: [true, 'First name is required']
  },
  lastname: {
    type: String,
    required: [true, 'Last name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    // required: [true, 'Phone number is required'],
  },
  profileImage: {
    type: String,
  },
  password: {
    type: String,
    // required: [true, 'Password is required'],
    // minlength: [6, 'Password must have at least 6 characters']
  },
  role: {
    type: String,
    enum: ['admin', 'cook', 'customer'],
    default: 'customer'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  address: {
    city: {
      type: String,
      // required: [true, 'City is required']
    },
    district: {
      type: String,
      // required: [true, 'district is required']
    },
    neighborhood: {
      type: String,
      // required: [true, 'neighborhood is required']
    },
    addressInfo: {
      type: String,
      //required: [true, 'address info is required']
    },
  }
},
  { timestamps: true }
);


/**
 * Runs before the model saves and hecks to see if password has been
 * modified and hashes the password before saving to database
 */
userSchema.pre("save", async function (this: IUser, next) {
  if (!this.isModified("password")) next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Create the user model
const User = mongoose.model<IUser>('User', userSchema);

// Export the user
export default User;


/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         firstname:
 *           type: string
 *           default: Alejandro
 *         lastname:
 *           type: string
 *           default: Martinez
 *         email:
 *           type: string
 *           default: amartinez@example.com
 *         phone:
 *           type: string
 *           default: 5551234567     
 *         profileImage:
 *           type: string
 *         password:
 *           type: string
 *         role:
 *           type: string
 *           default: customer
 *         isActive:
 *           type: string
 *           default: true
 *         address:
 *           type: object
 *           default: { city: "34", district: Üsküdar, neighborhood: Mimar Sinan Mah, addressInfo: Çavuşdere Caddesi No:41A İç kapı no:30}
 *    
 */ 