const { iattModel } = require('~/model');
const { ObjectId } = require("mongodb");

async function getAllBlogs() {
  return iattModel.blog.find({});
}

async function getBlogById(id) {
  return iattModel.blog.findOne({ _id: new ObjectId(id) });
}

async function updateBlog(id, data) {
  return iattModel.blog.updateOne({ _id: new ObjectId(id) }, data);
}

async function createBlog(data) {
  return await iattModel.blog.insertOne(data);
}

async function deleteBlog(_id) {
  const dataUpdate = {
    deleted_at: new Date(),
  };
  return iattModel.blog.updateOne({ _id: new ObjectId(_id) }, dataUpdate);
}

module.exports = {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog
};
