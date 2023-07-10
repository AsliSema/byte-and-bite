// Import the necessary modules
import mongoose, { Document, Schema } from 'mongoose';

// Define the user schema
interface UserSchema extends Document {
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  password: string;
  role: 'admin' | 'cooker' | 'customer';
  isActive: boolean;
  address: string;
}

const userSchema: Schema<UserSchema> = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'cooker', 'customer'],
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

