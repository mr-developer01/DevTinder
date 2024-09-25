const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: [2, "First name must be more than two char!!"],
      maxLength: [60, "length is exceding to max require char!!"],
    },
    lastName: {
      type: String,
      trim: true,
      maxLength: [60, "length is exceding to max require char!!"],
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      // match: [
      //   /^[a-zA-Z0-9_.±]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9.]+$/,
      //   "Please fill a valid email address",
      // ],
      maxLength: [70, "length is exceding to max requre char!!"],
      validate(val) {
        if (!validator.isEmail(val)) {
          throw new Error("Envalid email address: " + val);
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      maxLength: [70, "length is exceding to max require char!!"],
      // match: [
      //   /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      //   "Please fill a valid email address",
      // ],
      validate(val) {
        if (!validator.isStrongPassword(val)) {
          throw new Error(val + "Not a strong password");
        }
      },
    },
    age: {
      type: Number,
      min: [18, "age must be more or equal to 18!"],
    },
    gender: {
      type: String,
      validate(val) {
        if (!["male", "female", "others"].includes(val)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      validate(val) {
        if (!validator.isURL(val)) {
          throw new Error("Envalid email address: " + val);
        }
      },
    },
    about: {
      type: String,
      default: "Write something about you!!",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (!this.photoUrl) {
    if (this.gender === "male") {
      this.photoUrl = "https://example.com/male-default.png";
    } else if (this.gender === "female") {
      this.photoUrl = "https://example.com/female-default.png";
    } else {
      this.photoUrl = "https://example.com/neutral-default.png"; // For other cases
    }
  }
  next();
});

// Schema methods:--
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$3636", {
    expiresIn: "1d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const hashedPassword = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    hashedPassword
  );

  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
