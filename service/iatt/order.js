const { iattModel } = require('~/model');
const payment = require('~/service/iatt/payment');
const { ObjectId } = require("mongodb");
const crypto = require('crypto');
const axios = require('axios');
const FormData = require('form-data');
const { Readable } = require('stream');


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


async function downloadImage(data) {
  const imageSrc = data.Image_URL;
  const localFile = await downloadImageFromURL(imageSrc);
  const file = await transferImage(localFile);
  return file;
}

async function downloadImageFromURL(imageSrc) {
  try {
      const response = await axios.get(imageSrc, {
          responseType: 'arraybuffer',
      });
      return new Blob([response.data]);
  } catch (error) {
      console.error('Error downloading image:', error.message);
      throw new Error('Failed to download image');
  }
}

async function transferImage(imageBlob) {
  try {
      if (!process.env.CLOUDMERSIVE_API_KEY) {
          throw new Error('CLOUDMERSIVE_API_KEY is not set');
      }

      // Convert Blob to Buffer
      const arrayBuffer = await imageBlob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Convert Buffer to Readable Stream (Node.js compatible)
      const stream = Readable.from(buffer);

      // Prepare FormData
      const form = new FormData();
      form.append("inputFile", stream, { filename: "file.png" });

      // Send request to Cloudmersive API
      const response = await axios.post(
          "https://api.cloudmersive.com/convert/image/set-dpi/300",
          form,
          {
              headers: {
                  ...form.getHeaders(),
                  "Apikey": process.env.CLOUDMERSIVE_API_KEY,
              },
          }
      );

      return response.data;
  } catch (err) {
      console.error("File Read Error:", err);
      throw new Error("File read failed");
  }
}

async function createOrder(account, order) {
  const { _id, ...accountData } = account;
  await iattModel.account.updateOne({ _id: new ObjectId(account._id) }, accountData);
  const data_input = {
    product_id: order.product_id,
    account_id: new ObjectId(account._id),
    image: order.image,
    color: order.color,
    size: order.size,
    address: order.address,
    payment_method: order.payment_method,
    total: order.total,
    date_completed: '',
  }
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
  const data_input = {
    product_id: order.product_id,
    account_id: user_id,
    image: order.image,
    color: order.color,
    size: order.size,
    address: order.address,
    payment_method: order.payment_method,
    total: order.total,
    date_completed: '',
  }
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
  downloadImage,
};
