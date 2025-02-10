const { iattModel } = require('~/model');
const { ObjectId } = require("mongodb");
const crypto = require('crypto');
const axios = require('axios');

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

async function downloadImage( data ) {
  const imageSrc = data.Image_URL;
  const file = await transferImage(imageSrc);
  const formData = new FormData(); 
  formData.append('file', file);
  formData.append('fileName', file.name);
  formData.append('toolId', 'Change the DPI of my Image');
  formData.append('0', '300');
  const response = await axios.post('https://convert.town/UploadFile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data ;
}

async function transferImage(imageSrc) {
  try {
    // Parse the image URL to extract query parameters
    const urlObj = new URL(imageSrc);
    const queryParams = new URLSearchParams(urlObj.search);
    const realImageUrl = queryParams.get('url') || imageSrc; // Extract real image URL

    // Fetch the image
    const response = await axios.get(realImageUrl, {
      responseType: 'arraybuffer',
      timeout: 10000, // 10 seconds timeout
    });

    const contentType = response.headers['content-type'] || 'application/octet-stream';
    const realUrlObj = new URL(realImageUrl);
    let fileName = realUrlObj.pathname.split('/').pop() || 'downloaded-image';

    if (!fileName.includes('.')) {
      // Guess extension if missing
      const ext = contentType.split('/')[1] || 'jpg';
      fileName += `.${ext}`;
    }

    return new File([new Blob([response.data], { type: contentType })], fileName, { type: contentType });
  } catch (error) {
    console.error('Error downloading image:', error);
    throw error;
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
  return await iattModel.order.insertOne(data_input);
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
  createOrderWithoutLogin,
  downloadImage,
};
