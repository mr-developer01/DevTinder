const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
          throw new Error(`${val} is not a valid gender!`);
        }
      },
    },
    photoUrl: {
      type: String,
      validate(val) {
        if (!validator.isURL(val)) {
          throw new Error("Envalid image address: " + val);
        }
      },
    },
    about: {
      type: String,
      default: "Write something about you!!",
      maxLength: [255, "Keep your words around 255..."],
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
      this.photoUrl =
        "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG.png";
    } else if (this.gender === "female") {
      this.photoUrl =
        "https://p.kindpng.com/picc/s/421-4212792_member-icon-female-png-download-anonymous-profile-transparent.png";
    } else {
      this.photoUrl =
        "https://static.vecteezy.com/system/resources/thumbnails/020/911/746/small_2x/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"; // For other cases
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
