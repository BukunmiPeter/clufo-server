const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

// Signup Service
const signupUser = async ({ fullName, email, password }) => {
  try {
    console.log("Signup request received:", { fullName, email });

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("User already exists:", email);
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    console.log("User creation result:", user);

    if (!user) {
      throw new Error("User creation failed");
    }

    const token = generateToken(user._id, user.role);
    console.log("Token generated:", token);

    const userObject = user.toObject();
    const { password: _, ...otherProps } = userObject;

    return {
      success: true,
      message: "User registered successfully",
      data: { ...otherProps, token },
    };
  } catch (error) {
    console.error("Signup error:", error);
    return {
      success: false,
      message: error.message || "An error occurred during signup",
    };
  }
};

const loginUser = async ({ email, password }) => {
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid credentials");

    const { password: _, ...otherProps } = user.toObject(); // Convert to plain object for safe spreading
    const token = generateToken(user._id, user.role);

    return {
      success: true,
      message: "Sign in successful",
      data: { ...otherProps, token },
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "An error occurred during login",
    };
  }
};

// Token Generator
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

// Export functions using CommonJS
module.exports = {
  signupUser,
  loginUser,
};
