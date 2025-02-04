const { statusCode, successMessage, failMessage } = require('~/common/message');
const { ecokaService } = require("~/service");

async function getAllProducts(request, reply) {
  try {
    const data = await ecokaService.product.getAllProducts()
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

module.exports = {
  getAllProducts,
};
