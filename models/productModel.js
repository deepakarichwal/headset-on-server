const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A product must have a name"],
    unique: true,
    minlength: [8, "A tour name must have more than 10 characters"],
  },
  productCategory: {
    type: String,
    required: [true, "A product must have a product category"],
    enum: {
      values: ["headset", "watch", "smartphone"],
      message: "Product category is either: headset, watch, smartphone",
    },
  },
  overview: {
    type: String,
    required: [true, "A product must have an overview"],
    minlength: 50,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: [true, "A product should have a price"],
  },
  imageCover: {
    type: String,
    required: [true, "A product should have a cover image"],
  },
  rating: {
    type: Number,
    default: 4,
    min: [1, "Rating must be above 1.0"],
    max: [5, "Rating must be below or equal to 5.0"],
  },
  in_stock: {
    type: Boolean,
  },
  best_seller: {
    type: Boolean,
  },
  featuredProduct: {
    type: Boolean,
    default: false,
  },
  slug: {
    type: String,
  },
});

productSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });

  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
