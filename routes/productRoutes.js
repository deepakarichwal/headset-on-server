const express = require("express");
const productController = require("../controllers/productController");
const authController = require("../controllers/authController");

const productRouter = express.Router();

productRouter
  .route("/")
  .get(productController.getAllProducts)
  .post(authController.protect, productController.createProduct);

productRouter
  .route("/:id")
  .get(productController.getProduct)
  .patch(authController.protect, productController.updateProduct)
  .delete(authController.protect, productController.deleteProduct);

module.exports = productRouter;
