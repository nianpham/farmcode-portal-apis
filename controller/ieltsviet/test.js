const {
  statusCode,
  successMessage,
  failMessage,
} = require('~/common/message');
const { ieltsvietService } = require('~/service');

async function getAllCollections(request, reply) {
  try {
    const data = await ieltsvietService.test.getAllCollections();
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function getCollection(request, reply) {
  try {
    const { id } = request.params;
    const data = await ieltsvietService.test.getCollection(id);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function createCollection(request, reply) {
  try {
    const body = request.body;
    const data = await ieltsvietService.test.createCollection(body);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function deleteCollection(request, reply) {
  try {
    const { id } = request.params;
    const data = await ieltsvietService.test.deleteCollection(id);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}
async function updateCollection(request, reply) {
  try {
    const { id } = request.params;
    const body = request.body;
    const data = await ieltsvietService.test.updateCollection(
      id,
      body
    );
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function getAllTests(request, reply) {
  try {
    const data = await ieltsvietService.test.getAllTests();
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function getTest(request, reply) {
  try {
    const { id } = request.params;
    const data = await ieltsvietService.test.getTest(id);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function getAllWritingAnswers(request, reply) {
  try {
    const data = await ieltsvietService.test.getAllWritingAnswer();
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function createTest(request, reply) {
  try {
    const body = request.body;
    const data = await ieltsvietService.test.createTest(body);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function deleteTest(request, reply) {
  try {
    const { id } = request.params;
    const data = await ieltsvietService.test.deleteTest(id);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}
async function updateTest(request, reply) {
  try {
    const { id } = request.params;
    const body = request.body;
    const data = await ieltsvietService.test.updateTest(id, body);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function getAllSkillTests(request, reply) {
  try {
    let type = '';
    if (request.query.type) {
      type = request.query.type;
    }
    const data = await ieltsvietService.test.getAllSkillTests(type);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    console.log('error', err);
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function getSkillTest(request, reply) {
  try {
    const { id } = request.params;
    const data = await ieltsvietService.test.getSkillTest(id);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function createSkillTest(request, reply) {
  try {
    const body = request.body;
    const data = await ieltsvietService.test.createSkillTest(body);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function deleteSkillTest(request, reply) {
  try {
    const { id } = request.params;
    const data = await ieltsvietService.test.deleteSkillTest(id);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    console.log('error', err);

    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}
async function updateSkillTest(request, reply) {
  try {
    const { id } = request.params;
    const body = request.body;
    const data = await ieltsvietService.test.updateSkillTest(
      id,
      body
    );
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function getPart(request, reply) {
  try {
    const { id } = request.params;
    const data = await ieltsvietService.test.getPart(id);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function getQuestion(request, reply) {
  try {
    const { id } = request.params;
    const data = await ieltsvietService.test.getQuestion(id);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function createSubmit(request, reply) {
  try {
    const body = request.body;
    const data = await ieltsvietService.test.createSubmit(body);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function askChatGPT(request, reply) {
  try {
    const { users_answers } = request.body;
    const data =
      await ieltsvietService.test.askChatGPT(users_answers);

    let parsedData = data;
    if (typeof data === 'string' && data.startsWith('```json\n')) {
      const jsonString = data.replace(/```json\n|```/g, '').trim();
      parsedData = JSON.parse(jsonString);
    }

    return reply
      .status(200)
      .send({ data: parsedData, message: 'Success' });
  } catch (err) {
    console.log('error', err);

    if (err.response && err.response.status === 429) {
      return reply.status(429).send({
        message:
          'OpenAI API quota exceeded. Please check your plan and billing details.',
        error: err.response.data.error,
      });
    }

    return reply
      .status(500) // Internal Server Error
      .send({ message: 'Internal Server Error' });
  }
}
module.exports = {
  getAllCollections,
  getCollection,
  createCollection,
  deleteCollection,
  updateCollection,
  getAllTests,
  getTest,
  getAllWritingAnswers,
  createTest,
  deleteTest,
  updateTest,
  getAllSkillTests,
  getSkillTest,
  createSkillTest,
  deleteSkillTest,
  updateSkillTest,
  getPart,
  getQuestion,
  createSubmit,
  askChatGPT,
};
