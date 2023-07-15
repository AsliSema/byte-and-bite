import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from "bcrypt";

export interface IUser extends Document {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  profileImage?: string;
  password: string;
  role?: 'admin' | 'cook' | 'customer';
  isActive?: boolean;
  address: Address;
}

export interface Address {
  city: string;
  district?: string;
  neighborhood?: string;
  streetAddress?: string;
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

  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
  },
  profileImage: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must have at least 6 characters']
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
      required: [true, 'City is required']
    },
    district: {
      type: String,
    },
    neighborhood: {
      type: String,
    },
    streetAddress: {
      type: String,
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
