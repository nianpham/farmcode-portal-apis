const { ecokaModel } = require('~/model');
const { ObjectId } = require("mongodb");

async function getAllProducts() {
  return ecokaModel.product.find({});
}

async function getProductById(id) {
  return ecokaModel.product.findOne({ _id: new ObjectId(id) });
}

async function updateProduct(id, data) {
  return ecokaModel.product.updateOne({ _id: new ObjectId(id) }, data);
}

async function createProduct(data) {
  return await ecokaModel.product.insertOne(data);
}

async function deleteProduct(id) {
  const dataUpdate = {
    deleted_at: new Date(),
  };
  return ecokaModel.product.updateOne({ _id: new ObjectId(id) }, dataUpdate);
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
