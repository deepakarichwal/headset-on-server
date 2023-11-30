const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "A user must have an email"],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  role: {
    type: String,
    enum: {
      values: ["user", "admin"],
      message: "A user is either: user or admin",
    },
    default: "user",
  },
  password: {
    type: String,
    required: [true, "A user must have a password"],
    trim: true,
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "A user must have a password confirm"],

    trim: true,
    minlength: 8,

    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "Password is not matching!",
    },
  },
  passwordChangedAt: {
    type: Date,
  },
  cart: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
});

userSchema.pre(/^find/, function (next) {
  this.populate({
    path: "cart",
    select: "-__v",
  });
  next();
});

userSchema.methods.correctPassword = async function (
  filledPassword,
  userPassword
) {
  return await bcrypt.compare(filledPassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimeStamp < changedTimeStamp;
  }
  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
