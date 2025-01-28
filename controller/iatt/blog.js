const { iattService } = require("~/service");

async function getAllBlogs(request, reply) {
  try {
    const data = await iattService.blog.getAllBlogs()
    return reply.status(200).send({ data: data, message: 'Successfully' });
  } catch (err) {
    return reply.status(500).send({ message: 'Internal Server Error' });
  }
}

module.exports = {
  getAllBlogs,
};
