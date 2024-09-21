const mongoose = require("mongoose");

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
      match: [
        /^[a-zA-Z0-9_.±]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9.]+$/,
        "Please fill a valid email address",
      ],
      maxLength: [70, "length is exceding to max requre char!!"],
    },
    password: {
      type: String,
      required: true,
      match: [
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
        "Please fill a valid email address",
      ],
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

module.exports = mongoose.model("User", userSchema);
