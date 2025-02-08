const { iattModel } = require('~/model');
const { ObjectId } = require("mongodb");

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
  return iattModel.order.updateOne({ _id: new ObjectId(id) }, data);
}

async function createOrder(data) {
  const sdt = data.phone;
  let user ;
  let user_id;
  if (data.account_email !== '') {
    const email = data.account_email;
    user = await iattModel.account.findOne({ email: email });
    if(!user) {
      return 'invalidEmail';
    }
    user_id = user._id;
  }
  else {
    user = await iattModel.account.findOne({ phone: sdt });
    if (!user) {
      const dataAccount = {
        email: '',
        account_login: sdt,
        password: sdt,
        name: '',
        status: true,
        phone: sdt,
        role: 'personal',
        avatar: '',
        address: data.address,
        ward: '',
        district: 0,
        province: 0,
        districtName: '',
        provinceName: '',
        wardName: '',
      };
      user = await iattModel.account.insertOne(dataAccount);
      user_id = user.insertedId;
    }
    else {
      user_id = user._id;
    }
  }
  const data_input = {
    product_id: data.product_id,
    account_id: user_id,
    image: data.image,
    color: data.color,
    size: data.size,
    address: data.address,
    payment_method: data.payment_method,
    total: data.total,
    date_completed: '',
  }
  return await iattModel.order.insertOne(data_input);
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
  deleteOrder,
  getAllOrdersById,
};
