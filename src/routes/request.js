const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const requestRouter = express.Router();

requestRouter.get("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;

  res.send(user.firstName + " sent connection request!");
});

module.exports = requestRouter;
