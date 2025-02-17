const { ieltsvietModel } = require('~/model');
const { ObjectId } = require("mongodb");

async function getAllTimekeepings() {
  const timekeepings = await ieltsvietModel.timekeeping.find({});
  return timekeepings
    .filter(timekeeping => !timekeeping.deleted_at);
}

async function getTimekeeping(id) {
  return ieltsvietModel.timekeeping.findOne({ _id: new ObjectId(id) });
}

async function createTimekeeping(id, data) {
  const data_insert = {
    ...data,
  };
  return await ieltsvietModel.timekeeping.insertOne(data_insert);
}


module.exports = {
    getAllTimekeepings,
    getTimekeeping,
    createTimekeeping,
};
