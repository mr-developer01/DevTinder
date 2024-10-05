const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const profileRouter = express.Router();
const userModel = require("../models/user");
const { profileUpdateValidation } = require("../utils/signupValidation");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.json({message: "Fetch user profile", loginUser: user});
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!profileUpdateValidation(req)) {
      throw new Error("Invalid update credentials!!");
    }

    const user = req.user;

    const updatedprofile = await userModel.findByIdAndUpdate(
      { _id: user._id },
      req.body,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    res.status(200).json({
      message: `${user.firstName}, your profile updated successfuly!!`,
      loginUser: updatedprofile,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {

    const {emailId, password} = req.body;

    const checkUser = await userModel.findOne({emailId});

    if(!checkUser) throw new Error("Invalid cradentioals!!")

    const allowUpdate = ["emailId", "password"];

    const isAllowedData = Object.keys(req.body).every((k) =>
      allowUpdate.includes(k)
    );

    if(!isAllowedData) throw new Error("Invalid cradentioals!!")

    const newHashPassword = await bcrypt.hash(password, 10);

    const loggedInUser = await userModel.findOneAndUpdate(
      { emailId },
      { password: newHashPassword },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    res.status(201).json({
      message: `${loggedInUser.firstName} your password is updated!`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

module.exports = profileRouter;
