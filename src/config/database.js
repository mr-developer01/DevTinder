const mongoose = require("mongoose");

module.exports.connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://rahulpratik1212:rahul3636@cluster0.awxyk.mongodb.net/devTinder"
  );
};

// module.exports = connectDb