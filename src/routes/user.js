const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const ConnectionRequestModel = require("../models/connectionRequest");
const UserModel = require("../models/user");
const userRouter = express.Router();

const USER_POPULATE_DATA =
  "firstName lastName age gender about skills photoUrl"; // or ["firstName" "lastName" "age" "gender" "about" "skills"]

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const allReceivedRequest = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_POPULATE_DATA);
    res.json({ message: "Fetch request data!", allReceivedRequest });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

userRouter.get("/user/request/accepted", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const allAcceptedRequest = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "age",
        "gender",
        "about",
        "skills",
        "photoUrl",
      ])
      .populate("toUserId", USER_POPULATE_DATA);

    const data = allAcceptedRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }

      return row.fromUserId;
    });

    res.json({ message: "Fetched all accepted requests", data });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();

    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await UserModel.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_POPULATE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({data: users});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = userRouter;
