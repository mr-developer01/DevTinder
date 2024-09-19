const express = require("express");
const app = express();
const { connectDb } = require("./config/database");
const userModel = require("./models/user");

app.post("/signup", async (req, res) => {
  const user = new userModel({
    firstName: "Pratik",
    lastName: "NA",
    emailId: "kunal123@gmail.com",
    password: "kunal@123",
  });
  console.log(user);

  try {
    await user.save();
    res.send("User added successfully");
  } catch (error) {
    res.status(400).send("Error saving the user: " + error.message);
  }
});

connectDb()
  .then(() => {
    console.log("Db is connected");
    app.listen(3000, () => {
      console.log("Server is running on port 3000...");
    });
  })
  .catch((err) => {
    console.error("Db is not connected!!");
  });
