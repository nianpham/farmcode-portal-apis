const { iattModel } = require('~/model');
const { ObjectId } = require("mongodb");

async function getAllOrders() {
  const orders = await iattModel.order.find({});
  return orders
    .filter(order => !order.deleted_at);
}

async function getOrder(id) {
  return iattModel.order.findOne({ _id: new ObjectId(id) });
}

async function updateOrder(id, data) {
  return iattModel.order.updateOne({ _id: new ObjectId(id) }, data);
}

async function createOrder(data) {
  return await iattModel.order.insertOne(data);
}

async function deleteOrder(id) {
  const dataUpdate = {
    deleted_at: new Date(),
  };
  return iattModel.order.updateOne({ _id: new ObjectId(id) }, dataUpdate);
}

module.exports = {
  getAllOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder
};
