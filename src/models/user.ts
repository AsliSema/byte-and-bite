// Define the User interface
interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    profileImage: string;
    password: string;
    role: "admin" | "cooker" | "customer";
    isActive: boolean;
//  wishlist: string[];
    address: string;
  }
  
  // Define the UserModule class
  class UserModule {
    private users: User[];
  
    constructor() {
      // Initialize the users array
      this.users = [];
    }
  
    // Register a new user
    registerUser(
      name: string,
      email: string,
      phone: string,
      profileImage: string,
      password: string,
      role: "admin" | "cooker" | "customer",
      address: string
    ): User {
      const newUser: User = {
        id: this.users.length + 1,
        name,
        email,
        phone,
        profileImage,
        password,
        role,
        isActive: true,
       // wishlist: [],
        address,
      };
  
      this.users.push(newUser);
      return newUser;
    }
  
    // Find a user by email and password
    findUser(email: string, password: string): User | undefined {
      return this.users.find(
        (user) => user.email === email && user.password === password
      );
    }
  
    // Get user by ID
    getUserById(id: number): User | undefined {
      return this.users.find((user) => user.id === id);
    }
  
    /* Add a meal to user's wishlist
    addToWishlist(userId: number, meal: string): void {
      const user = this.getUserById(userId);
      if (user) {
        user.wishlist.push(meal);
      }
    }
  */
    // Update user's profile image
    updateProfileImage(userId: number, newImage: string): void {
      const user = this.getUserById(userId);
      if (user) {
        user.profileImage = newImage;
      }
    }
  
    // Deactivate a user account
    deactivateAccount(userId: number): void {
      const user = this.getUserById(userId);
      if (user) {
        user.isActive = false;
      }
    }
  }
  
  // Create an instance of the UserModule class
  const userModule = new UserModule();
  
  // Usage example
  const user1 = userModule.registerUser(
    "John Doe",
    "john@example.com",
    "1234567890",
    "profile.jpg",
    "password123",
    "customer",
    "123 ABC Street"
  );
  const user2 = userModule.registerUser(
    "Jane Smith",
    "jane@example.com",
    "9876543210",
    "avatar.png",
    "secret456",
    "cooker",
    "456 XYZ Avenue"
  );
  
  //userModule.addToWishlist(user1.id, "Lasagna");
  //userModule.addToWishlist(user1.id, "Pizza");
  
  console.log(userModule.findUser("john@example.com", "password123")); // Output: User { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', profileImage: 'profile.jpg', password: 'password123', role: 'customer', isActive: true, wishlist: [ 'Lasagna', 'Pizza' ], address: '123 ABC Street' }
  console.log(userModule.getUserById(2)); // Output: User { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '9876543210', profileImage: 'avatar.png', password:
  