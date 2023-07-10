// Import the necessary modules
import mongoose, { Document, Schema } from 'mongoose';

interface Address {
  city: string;
  district: string;
  neighborhood: string;
  streetAddress: string;
}

// Define the user schema
interface UserSchema extends Document {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  profileImage: string;
  password: string;
  role: 'admin' | 'cook' | 'customer';
  isActive: boolean;
  address: string;
}

const addressSchema: Schema<Address> = new Schema({
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
    required: [true, 'Street address is required']
  }
});

const userSchema: Schema<UserSchema> = new Schema({
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
    validate: {
        validator: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: 'Invalid email format'
    }
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
    type: String
  }
});

// Create the user model
const UserModel = mongoose.model<UserSchema>('User', userSchema);

// Export the user model
export default UserModel;

