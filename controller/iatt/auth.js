async function login(request, reply) {
    try {
      const body = request.body
      return reply.status(200).send({ data: null, message: 'Successfully' });
    } catch (err) {
      return reply.status(500).send({ message: 'Internal Server Error' });
    }
  }
  
  async function loginWithGoogle(request, reply) {
    try {
      return reply.status(200).send({ data: null, message: 'Successfully' });
    } catch (err) {
      return reply.status(500).send({ message: 'Internal Server Error' });
    }
  }
  
  module.exports = {
    login,
    loginWithGoogle
  };