const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const userRouter = express.Router();

// User Auth
userRouter.route("/signup").post(authController.signup);
userRouter.route("/login").post(authController.login);

// User Data
userRouter.route("/").get(authController.protect, userController.getAllUsers);

userRouter
  .route("/:id")
  .get(authController.protect, userController.getUser)
  .patch(authController.protect, userController.updateUser)
  .delete(authController.protect, userController.deleteUser);

// User Cart
userRouter
  .route("/:userId/cart")
  .get(authController.protect, userController.getUserCart)
  .patch(authController.protect, userController.addToCart);

userRouter
  .route("/:userId/cart/:itemId")
  .patch(authController.protect, userController.removeFromCart);

module.exports = userRouter;
