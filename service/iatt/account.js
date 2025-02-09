const { iattModel } = require('~/model');
const { ObjectId } = require("mongodb");

async function getAllAccounts() {
  const accounts = await iattModel.account.find({});
  return accounts
    .filter(account => !account.deleted_at);
}

async function getAccountByEmail(data) {
    return iattModel.account.findOne({ email: data.email });
}

async function getAccountByPhone(data) {
    return iattModel.account.findOne({ phone: data.phone });
}

async function createAccount(data) {
    return await iattModel.account.insertOne(data);
}

async function getAccount(id) {
    return iattModel.account.findOne({ _id: new ObjectId(id) });
}

async function updateProfile(id, data) {
    return iattModel.account.updateOne({ _id: new ObjectId(id) }, data);
  }

module.exports = {
    getAllAccounts,
    getAccountByEmail,
    createAccount,
    getAccount,
    updateProfile,
    getAccountByPhone
};
