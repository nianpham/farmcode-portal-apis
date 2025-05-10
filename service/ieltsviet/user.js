const { ieltsvietModel } = require('~/model');
const { ObjectId } = require('mongodb');
const crypto = require('crypto');

async function getAllUsers() {
  const users = await ieltsvietModel.user.find({});
  return users.filter((user) => !user.deleted_at);
}

async function getUser(id) {
  const user = await ieltsvietModel.user.findOne({
    _id: new ObjectId(id),
  });
  return user;
}

async function updateUser(id, data) {
  return ieltsvietModel.user.updateOne(
    { _id: new ObjectId(id) },
    data
  );
}

async function loginUser(data) {
  const user = await ieltsvietModel.user.findOne({
    email: data.email,
  });
  if (!user) {
    return {
      message: 'User not found',
    };
  }
  if (user.password === data.password) {
    const user_return = {
      _id: user._id,
      user_name: user.user_name,
      email: user.email,
    };
    console.log(user_return);
    return {
      message: 'Login successfully',
      user: user_return,
    };
  }
  return {
    message: 'Wrong password',
  };
}

async function createUser(data) {
  const data_insert = {
    user_name: data.user_name,
    avatar: data.avatar,
    email: data.email,
    password: data.password,
  };
  return await ieltsvietModel.user.insertOne(data_insert);
}

async function deleteUser(id) {
  const dataUpdate = {
    deleted_at: new Date(),
  };
  return ieltsvietModel.user.updateOne(
    { _id: new ObjectId(id) },
    dataUpdate
  );
}

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  loginUser,
  createUser,
  deleteUser,
};
