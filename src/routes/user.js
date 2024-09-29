const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const ConnectionRequestModel = require("../models/connectionRequest");
const userRouter = express.Router();

const USER_POPULATE_DATA = "firstName lastName age gender about skills"; // or ["firstName" "lastName" "age" "gender" "about" "skills"]

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const allReceivedRequest = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_POPULATE_DATA);
    res.json({ message: "Fetch request data!", allReceivedRequest });
  } catch (error) {
    res.status.send("ERROR: " + error.message);
  }
});

userRouter.get("/user/request", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const allAcceptedRequest = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", ["firstName", "lastName", "age", "gender", "about", "skills"])
      .populate("toUserId", USER_POPULATE_DATA);

    const data = allAcceptedRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }

      return row.fromUserId;
    });

    res.json({ message: "Fetched all accepted requests", data });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

module.exports = userRouter;
