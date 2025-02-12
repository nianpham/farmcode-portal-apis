const { iattModel } = require('~/model');
const payment = require('~/service/iatt/payment');
const { ObjectId } = require("mongodb");
const crypto = require('crypto');
const axios = require('axios');
const fs = require('fs');

async function getAllOrders() {
  const orders = await iattModel.order.find({});
  return orders
    .filter(order => !order.deleted_at);
}

async function getAllOrdersById(id) {
  const orders = await iattModel.order.find({ account_id: new ObjectId(id) });
  return orders
    .filter(order => !order.deleted_at);
}

async function getOrder(id) {
  return iattModel.order.findOne({ _id: new ObjectId(id) });
}

async function updateOrder(id, data) {
  const order = await iattModel.order.findOne({ _id: new ObjectId(id) });
  if (order.status === "completed") {
    delete data.status;
  }
  if(data.status === 'completed'){
    data.date_completed = new Date();
  }
  return iattModel.order.updateOne({ _id: new ObjectId(id) }, data);
}



async function createOrder(account, order) {
  const { _id, ...accountData } = account;
  await iattModel.account.updateOne({ _id: new ObjectId(account._id) }, accountData);
  let data_input = {};
  if(order.payment_method === 'cash'){
     data_input = {
      product_id: order.product_id,
      account_id: new ObjectId(account._id),
      image: order.image,
      color: order.color,
      size: order.size,
      address: order.address,
      payment_method: order.payment_method,
      total: order.total,
      status: 'waiting',
      date_completed: '',
    }
  }
  else {
      data_input = {
        product_id: order.product_id,
        account_id: new ObjectId(account._id),
        image: order.image,
        color: order.color,
        size: order.size,
        address: order.address,
        payment_method: order.payment_method,
        total: order.total,
        status: 'paid pending',
        date_completed: '',
      }
  }
  const product = await iattModel.product.findOne({ _id: new ObjectId(order.product_id) });
  await iattModel.product.updateOne({ _id: new ObjectId(order.product_id) }, {sold:Number(product.sold) + 1});
  const costumer = await iattModel.account.findOne({ _id: new ObjectId(account._id) });
  await iattModel.account.updateOne({ _id: new ObjectId(account._id) }, {order: Number(costumer.number_orders) + 1});
  const result = await iattModel.order.insertOne(data_input);
  const payment_data = {
    order_id: result.insertedId,
    order_total: order.total,
  }
  const payUrl = await payment.momo(payment_data);
  return payUrl;
}

async function createOrderWithoutLogin(account, order) {
  let user = await iattModel.account.findOne({ phone: account.phone });
  let user_id = '';
  if (!user) {
    const dataAccount = {
      email: '',
      password: crypto.randomBytes(8).toString('hex'),
      name: account.name,
      status: true,
      phone: account.phone,
      role: 'personal',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT18iwsdCCbBfpa50-5BmNa_m_BX087_x1oWQ&s',
      address: account.address,
      ward: account.ward,
      district: account.district,
      province: account.province,
      districtName: account.districtName,
      provinceName: account.provinceName,
      wardName: account.wardName,
    };
    user = await iattModel.account.insertOne(dataAccount);
    user_id = user.insertedId;
  }
  else {
    await iattModel.account.updateOne({ _id: new ObjectId(user._id) }, account);
    user_id = user._id;
  }
  let data_input = {};
  if(order.payment_method === 'cash'){
     data_input = {
      product_id: order.product_id,
      account_id: user_id,
      image: order.image,
      color: order.color,
      size: order.size,
      address: order.address,
      payment_method: order.payment_method,
      total: order.total,
      status: 'waiting',
      date_completed: '',
    }
  }
  else {
     data_input = {
      product_id: order.product_id,
      account_id: user_id,
      image: order.image,
      color: order.color,
      size: order.size,
      address: order.address,
      payment_method: order.payment_method,
      total: order.total,
      status: 'paid pending',
      date_completed: '',
    }
  }
  const product = await iattModel.product.findOne({ _id: new ObjectId(order.product_id) });
  await iattModel.product.updateOne({ _id: new ObjectId(order.product_id) }, {sold:Number(product.sold) + 1});
  const costumer = await iattModel.account.findOne({ _id: new ObjectId(user_id) });
  await iattModel.account.updateOne({ _id: new ObjectId(user_id) }, {order: Number(costumer.number_orders) + 1});
  const result = await iattModel.order.insertOne(data_input);
  const payment_data = {
    order_id: result.insertedId,
    order_total: order.total,
  }
  const payUrl = await payment.momo(payment_data);
  return payUrl;
}

async function deleteOrder(id) {
  const dataUpdate = {
    deleted_at: new Date(),
  };
  const order = await iattModel.order.findOne({ _id: new ObjectId(id) });
  const costumer = await iattModel.account.findOne({ _id: new ObjectId(order.account_id) });
  await iattModel.account.updateOne({ _id: new ObjectId(order.account_id) }, {order: Number(costumer.number_orders) - 1});
  return iattModel.order.updateOne({ _id: new ObjectId(id) }, dataUpdate);
}

module.exports = {
  getAllOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  getAllOrdersById,
  createOrderWithoutLogin,
};
