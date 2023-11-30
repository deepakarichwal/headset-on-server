const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.updateUser = catchAsync(async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body);

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getUserCart = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.userId);

  res.status(200).json({
    status: "success",
    data: {
      cart: user.cart,
    },
  });
});

exports.addToCart = catchAsync(async (req, res) => {
  if (!req.body.userId) req.body.userId = req.params.userId;
  await User.updateOne(
    { _id: req.body.userId },
    { $addToSet: { cart: req.body.productId } }
  );

  res.status(201).json({
    status: "success",
    message: "Successfully added to cart",
  });
});

exports.removeFromCart = catchAsync(async (req, res) => {
  if (!req.body.userId) req.body.userId = req.params.userId;
  if (!req.body.itemId) req.body.itemId = req.params.itemId;

  await User.updateOne(
    { _id: req.body.userId },
    { $pull: { cart: req.body.itemId } }
  );

  res.status(200).json({
    status: "success",
    message: "Successfully removed from cart",
  });
});
