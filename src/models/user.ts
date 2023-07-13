// Import the necessary modules
import mongoose, { Document, Schema } from 'mongoose';

// Define the user schema
export interface IUser extends Document {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  profileImage: string;
  password: string;
  role?: 'admin' | 'cook' | 'customer';
  isActive?: boolean;
  address: {
    city: string;
    district: string;
    neighborhood: string;
    streetAddress: string;
  };
}


const userSchema= new Schema<IUser>({
  firstname: {
    type: String,
    required: [true,'First name is required']
  },
  lastname: {
    type: String,
    required: [true,'Last name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,

  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    validate: {
      validator: (value: string) => /^\d{10}$/.test(value),
      message: 'Invalid phone number format'
    }
  },
  profileImage: {
    type: String,
    required: [true, 'Profile image is required']
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
      required: [true, 'District is required']
    },
    neighborhood: {
      type: String,
      required: [true, 'Neighborhood is required']
    },
    streetAddress: {
      type: String,
      required: [true, 'Street address is required'],
      timestamp:true
    }
  }
});

// Create the user model
const User = mongoose.model<IUser>('User', userSchema);

// Export the user
export default User;

