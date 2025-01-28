const { iattModel } = require('~/model');
const { ObjectId } = require("mongodb");

async function getAllProducts() {
  return iattModel.product.find({});
}

async function getProductById(id) {
  return iattModel.product.findOne({ _id: new ObjectId(id) });
}

async function updateProduct(id, data) {
  return iattModel.product.updateOne({ _id: new ObjectId(id) }, data);
}

async function createProduct(data) {
  return await iattModel.product.insertOne(data);
}

async function deleteProduct(_id) {
  const dataUpdate = {
    deleted_at: new Date(),
  };
  return iattModel.product.updateOne({ _id: new ObjectId(_id) }, dataUpdate);
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
