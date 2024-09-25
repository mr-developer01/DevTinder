const express = require("express");
const app = express();
const { connectDb } = require("./config/database");
const userModel = require("./models/user");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { signupValidation } = require("./utils/signupValidation");
const { updateValidation } = require("./utils/updateValidation");
const { userAuth } = require("./middlewares/userAuth");

app.use(express.json());
app.use(cookieParser());

// creating a user
app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password, skills, age, gender } =
      req.body;
    // validation of data:--
    signupValidation(req);

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    await userModel.create({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
      skills,
      age,
      gender,
    });
    res.send("User added successfully");
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

// login a user
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await userModel.findOne({ emailId });

    if (!user) {
      throw new Error("Invalid credentials.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // create a jWT token
      const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$3636", { expiresIn: '1d' });

      // adding token to cookie
      res.cookie("token", token,  { maxAge: 60000 * 60 * 24 * 7 });
      res.send("Login successfully!");
    } else {
      throw new Error("Invalid credentials.");
    }
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  const user = req.user;

  res.send(user);
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

app.patch("/user/:userId", async (req, res) => {
  try {
    const userId = req.params?.userId;

    const data = req.body;
    // validating data from req.body:--
    updateValidation(data);

    const findUser = await userModel.findById({ _id: userId });
    if (!findUser) return res.status(400).send("No such user find!!");

    const { firstName, lastName, password, skills, photoUrl } = data;

    const newPass = await bcrypt.hash(password, 10);

    const user = await userModel.findByIdAndUpdate(
      { _id: userId },
      { firstName, lastName, password: newPass, skills, photoUrl },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );
    res.status(200).send("Updated...");
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
    console.error("Db is not connected!! : " + err.message);
  });
