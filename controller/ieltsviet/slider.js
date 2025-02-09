const { statusCode, successMessage, failMessage } = require('~/common/message');
const { ieltsvietService } = require("~/service");

async function getAllSliders(request, reply) {
  try {
    const data = await ieltsvietService.slider.getAllSliders()
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
    console.log(err)
  }
}

async function updateSliders(request, reply) {
    try {
      body = request.body;
      const data = await ieltsvietService.slider.updateSlider(body)
      return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
    } catch (err) {
      reply.status(statusCode.internalError).send({ message: failMessage.internalError });
    }
  }

module.exports = {
    getAllSliders,
    updateSliders,
};