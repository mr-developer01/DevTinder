const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const requestRouter = express.Router();
const ConnectionRequestModel = require("../models/connectionRequest");
const userModel = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;

      const status = req.params.status;
      const toUserId = req.params.toUserId;

      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).send("You can only send or ignore request!");
      }

      if (toUserId === fromUserId.toString()) {
        return res.status(400).send("You can't sent request to yourself!");
      }

      const userToSendRequest = await userModel.findById({ _id: toUserId });

      if (!userToSendRequest) {
        return res.status(400).send("No such user to send request!");
      }

      const existingRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingRequest) {
        return res.status(400).send("Connection request already exists!");
      }

      const connectionRequest = await ConnectionRequestModel.create({
        fromUserId,
        toUserId,
        status,
      });

      res.send(
        `You have sent connection request to ${userToSendRequest.firstName}.`
      );
    } catch (error) {
      res.status(400).send("ERROR: " + error.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loginUser = req.user;
      
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status not allowed!" });
      }

      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loginUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection request not found!" });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({ message: "Connection request " + status, data });

    } catch (error) {
      res.status(400).send("ERROR: " + error.message);
    }
  }
);

module.exports = requestRouter;
