const express = require("express");
const app = express();
const { connectDb } = require("./config/database");

app.get("/users", (req, res) => {
  res.send("Hello!!!");
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
