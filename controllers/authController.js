import { signupUser, loginUser } from "../services/authService.js";

export const signup = async (req, res) => {
  try {
    const result = await signupUser(req.body);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(201).json(result); // 201 for successful creation
  } catch (error) {
    console.error("Unexpected signup error:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred",
    });
  }
};

export const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);

    if (!result.success) {
      return res.status(400).json(result); // Return 400 for failed login
    }

    return res.status(200).json(result); // 200 for successful login
  } catch (error) {
    console.error("Unexpected login error:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred",
    });
  }
};
