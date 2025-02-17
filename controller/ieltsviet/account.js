const { statusCode, successMessage, failMessage } = require('~/common/message');
const { ieltsvietService } = require("~/service");

async function getAllAccounts(request, reply) {
  try {
    const data = await ieltsvietService.account.getAllAccounts();
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

async function getAccount(request, reply) {
  try {
    const { id } = request.params;
    const data = await ieltsvietService.account.getAccount(id);
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

async function login(request, reply) {
  try {
    const { id } = request.params;
    const body = request.body;
    const data = await ieltsvietService.account.login(id, body);
    if (!data) {
      return reply.status(statusCode.notFound).send({ message: failMessage.notFound });
    }
    if (data.status === 'late') {
      return reply.status(statusCode.userError).send({ data: data, message: failMessage.late });
    }
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

async function check(request, reply) {
  try {
    const { id } = request.params;
    const data = await ieltsvietService.account.check(id);
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

async function createAccount(request, reply) {
  try {
    const body = request.body;
    const data = await ieltsvietService.account.createAccount(body);
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

async function deleteAccount(request, reply) {
  try {
    const { id } = request.params;
    const data = await ieltsvietService.account.deleteAccount(id);
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

async function updateAccount(request, reply) {
    try {
      const { id } = request.params;
      const body = request.body;
      const data = await ieltsvietService.account.updateAccount(id, body);
      return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
    } catch (err) {
      reply.status(statusCode.internalError).send({ message: failMessage.internalError });
    }
  }

module.exports = {
    getAllAccounts,
    getAccount,
    createAccount,
    deleteAccount,
    updateAccount,
    login,
    check
};