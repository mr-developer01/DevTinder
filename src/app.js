const express = require("express");
const app = express();
const { connectDb } = require("./config/database");
const userModel = require("./models/user");
const { sociallyRestrictedSkills } = require("./utils/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    const data = req.body;

    if (data?.skills.length > 10)
      return res.status(400).send("Skills must be less than 8");

    const userSkill = data?.skills;
    userSkill.forEach((skill) => {
      const isSkillPresent = sociallyRestrictedSkills.includes(
        skill.toLowerCase()
      );
      if (isSkillPresent) throw new Error(`You can't add skills like ${skill}`);
    });

    const allowedUpdates = [
      "firstName",
      "lastName",
      "emailId",
      "about",
      "skills",
      "age",
      "gender",
      "password",
    ];

    const isAllowedUpdates = Object.keys(data).every((k) =>
      allowedUpdates.includes(k)
    );
    console.log(isAllowedUpdates);

    if (!isAllowedUpdates)
      return res.status(400).send("Some fields can't allow to update!");

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

app.patch("/user/:userId", async (req, res) => {
  try {
    const userId = req.params?.userId;

    const findUser = await userModel.findById({ _id: userId });
    if (!findUser) return res.status(400).send("No such user find!!");

    const data = req.body;

    if (data?.skills.length > 10)
      return res.status(400).send("Skills must be less than 8");

    const userSkill = data?.skills;
    userSkill.forEach((skill) => {
      const isSkillPresent = sociallyRestrictedSkills.includes(
        skill.toLowerCase()
      );
      if (isSkillPresent) throw new Error(`You can't add skills like ${skill}`);
    });

    const allowedUpdates = [
      "firstName",
      "lastName",
      "skills",
      "age",
      "gender",
      "about",
      "password",
      "photoUrl",
    ];

    const isAllowedUpdates = Object.keys(data).every((k) =>
      allowedUpdates.includes(k)
    );
    console.log(isAllowedUpdates);

    if (!isAllowedUpdates)
      return res.status(400).send("Some fields can't allow to update!");

    const user = await userModel.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
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
