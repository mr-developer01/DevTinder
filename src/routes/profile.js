const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const profileRouter = express.Router();
const userModel = require("../models/user");
const { profileUpdateValidation } = require("../utils/signupValidation");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
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
      data: updatedprofile,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

profileRouter.patch("/profile/editPassword", userAuth, async (req, res) => {
  try {
    const user = req.user;

    const data = req.body;

    const allowUpdate = ["password"];

    const isAllowedData = Object.keys(data).every((k) =>
      allowUpdate.includes(k)
    );

    if(!isAllowedData) throw new Error("add new password only!!")

    const newHashPassword = await bcrypt.hash(data.password, 10);

    const loggedInUser = await userModel.findByIdAndUpdate(
      { _id: user._id },
      { password: newHashPassword },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    res.status(201).json({
      message: `${user.firstName} your password is updated!`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

module.exports = profileRouter;
