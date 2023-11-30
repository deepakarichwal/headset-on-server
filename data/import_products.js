const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Product = require("../productModel");
const FeaturedProduct = require("../featuredProductModel");

dotenv.config({ path: `./config.env` });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {})
  .then(() => console.log("DB connection successfully..."));

const products = JSON.parse(
  fs.readFileSync(`${__dirname}/featured_products.json`, "utf-8")
);

const importData = async () => {
  try {
    await FeaturedProduct.create(products);
    console.log("Data imported successfully!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await FeaturedProduct.deleteMany();
    console.log("Data deleted successfully!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

console.log(process.argv);

//To import data: node data/import_products.js --import
//To delete data: node data/import_products.js --delete
