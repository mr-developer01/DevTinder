const express = require("express");
const app = express();
const { connectDb } = require("./config/database");
const userModel = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    const user = await userModel.create(req.body);
    res.send("User added successfully");
  } catch (error) {
    res.status(400).send("Error saving the user: " + error.message);
  }
});

app.get("/user", async (req, res) => {
  const { emailId } = req.body;
  try {
    const users = await userModel.find({ emailId });
    if (users.length === 0) return res.send("No user match with this email");
    res.send(users);
  } catch (error) {
    res.status(400).send("User not found: " + error.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await userModel.find({});
    if (users.length === 0) return res.send("No user till now!!");
    res.send(users);
  } catch (error) {
    res.status(400).send("User not found: " + error.message);
  }
});

app.delete("/user", async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await userModel.findOneAndDelete({ _id: userId });
    if (user) return res.send("User deleted!!");
    res.status(400).send("user not exists!!");
  } catch (error) {
    res.status(400).send("User not found: " + error.message);
  }
});

app.patch("/user", async (req, res) => {
  const { userId } = req.body;
  const { firstName, emailId, skills } = req.body;

  try {
    const findUser = await userModel.findById(userId);
    console.log(findUser);
    
    if (findUser) {
      const user = await userModel.findByIdAndUpdate(
        { _id: userId },
        { firstName, emailId, skills },
        { returnDocument: "after", runValidators: true }
      );
      res.send("Updated...");
    }else{
      return res.send("No such user found!!")
    }
  } catch (error) {
    res.status(400).send("User not found: " + error.message);
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
