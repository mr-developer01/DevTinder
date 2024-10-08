const express = require("express");
const authRouter = express.Router();
const userModel = require("../models/user");
const { signupValidation } = require("../utils/signupValidation");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    // validation of data:--
    signupValidation(req);

    const {
      firstName,
      lastName,
      emailId,
      password
    } = req.body;

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      firstName,
      lastName,
      emailId,
      password: hashedPassword
    });
    // create a jWT token
    const token = await user.getJWT();

    // adding token to cookie
    res.cookie("token", token, { maxAge: 60000 * 60 * 24 * 7 });

    res
      .status(200)
      .json({
        message: `${user.firstName}, welcome to dev world!!`,
        loginUser: user,
      });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await userModel.findOne({ emailId });

    if (!user) {
      throw new Error("Invalid credentials.");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials.");
    }

    if (isPasswordValid) {
      // create a jWT token
      const token = await user.getJWT();

      // adding token to cookie
      res.cookie("token", token, { maxAge: 60000 * 60 * 24 * 7 });
      res.json({ message: "Login successfuly!", loginUser: user });
    } else {
      throw new Error("Invalid credentials.");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { maxAge: 0 }).send("You are logged out now!!");
});

module.exports = authRouter;
