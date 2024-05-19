import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import generatetokenandsetcookie from "../utils/generateToken.js";

// Signup functionality
export const signup = async (req, res) => {
  try {
    const { firstName, lastName, username, password, confirmPassword, gender, dateOfBirth, country, email, mobileNo } = req.body;
    console.log("request:", req.body);
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ error: "Username already exists" });
    }
    // Hash passwords
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      firstName,
      lastName,
      username,
      password: hashedPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
      dateOfBirth,
      country,
      email,
      mobileNo,
    });

    if (newUser) {
      // Generate JWT tokens
      generatetokenandsetcookie(newUser.id, res);
      console.log("User", newUser.username);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        firstName: newUser.firstName,
        username: newUser.username,
        profilePic: newUser.profilePic,
      });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Signin functionality
export const signin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcryptjs.compare(password, user?.password || "");

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }

    generatetokenandsetcookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      username: user.username,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in signin controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Signout functionality
export const signout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out Successfully" });
  } catch (error) {
    console.log("Error in signout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};