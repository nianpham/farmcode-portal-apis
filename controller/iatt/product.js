const { iattService } = require("~/service");

async function getAllProducts(request, reply) {
  try {
    const data = await iattService.product.getAllProducts()
    return reply.status(200).send({ data: data, message: 'Successfully' });
  } catch (err) {
    return reply.status(500).send({ message: 'Internal Server Error' });
  }
}

module.exports = {
  getAllProducts,
};
