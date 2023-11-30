const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Product = require("../models/productModel");

exports.getAllProducts = async (req, res) => {
  const search = req.query.search || "";
  const products = await Product.find({
    name: { $regex: search, $options: "i" },
  });

  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products,
    },
  });
};

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new AppError(`No product found with this ID - (${req.params.id})`, 404)
    );
  }

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });

  next();
});

exports.createProduct = catchAsync(async (req, res) => {
  const newProduct = await Product.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      product: newProduct,
    },
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const updatedProduct = await Product.findByIdAndUpdate(req.params.id);

  if (!updatedProduct) {
    return next(
      new AppError(`No product found with this ID - (${req.params.id})`, 404)
    );
  }

  res.status(200).json({
    status: "success",
    data: {
      product: updatedProduct,
    },
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);

  if (!deletedProduct) {
    return next(
      new AppError(`No product found with this ID - (${req.params.id})`, 404)
    );
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
