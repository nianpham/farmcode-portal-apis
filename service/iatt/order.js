const { iattModel } = require('~/model');
const payment = require('~/service/iatt/payment');
const { ObjectId } = require("mongodb");
const crypto = require('crypto');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const CloudmersiveConvertApiClient = require('cloudmersive-convert-api-client');


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
  try {
    const imageSrc = data.Image_URL;
    const defaultClient = CloudmersiveConvertApiClient.ApiClient.instance;
    const Apikey = defaultClient.authentications['Apikey'];
    Apikey.apiKey = process.env.CLOUDMERSIVE_API_KEY;
    const apiInstance = new CloudmersiveConvertApiClient.ConvertImageApi();
    const dpi = 300;
    // Download the image
    const response = await axios.get(imageSrc, {
      responseType: 'arraybuffer',
    });

    const inputFile = Buffer.from(response.data);

    // Convert image DPI
    const convertedImage = await new Promise((resolve, reject) => {
      apiInstance.convertImageImageSetDPI(dpi, inputFile, (error, data) => {
        if (error) return reject(error);
        resolve(data);
      });
    });

    // Save the converted image
    fs.writeFileSync(outputFilePath, convertedImage);
    console.log('✅ Converted image saved:', outputFilePath);

    return outputFilePath;
  } catch (error) {
    console.error(error);
  }
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
