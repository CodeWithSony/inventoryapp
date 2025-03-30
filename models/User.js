import mongoose from "mongoose";

// Define the User schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Added password field
});

// Create or retrieve the User model
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
