const { statusCode, successMessage, failMessage } = require('~/common/message');
const { ieltsvietService } = require("~/service");

// async function loginWithEmail(request, reply) {
//   try {
//     const data = request.body
//     const user = await ieltsvietService.account.getAccountByEmail(data);
//     if (!user) {
//       reply.status(statusCode.badRequest).send({ message: failMessage.unvalidAccount });
//     }
//     if (user.password !== data.password) {
//       reply.status(statusCode.badRequest).send({ message: failMessage.unvalidPassword });
//     }
//     return reply.status(statusCode.success).send({ data: user._id, message: successMessage.index });
//   } catch (err) {
//     reply.status(statusCode.internalError).send({ message: failMessage.internalError });
//   }
// }


// async function loginWithPhone(request, reply) {
//   try {
//     const data = request.body
//     const user = await ieltsvietService.account.getAccountByPhone(data);
//     if (!user) {
//       reply.status(statusCode.badRequest).send({ message: failMessage.unvalidAccount });
//     }
//     if (user.password !== data.password) {
//       reply.status(statusCode.badRequest).send({ message: failMessage.unvalidPassword });
//     }
//     return reply.status(statusCode.success).send({ data: user._id, message: successMessage.index });
//   } catch (err) {
//     reply.status(statusCode.internalError).send({ message: failMessage.internalError });
//   }
// }

async function loginWithGoogle(request, reply) {
  try {
    console.log(request.user);
    const data = await ieltsvietService.user.getAccountByEmail({ "email": request.user?.emails[0]?.value?.toLowerCase() });
    if (data) {
      reply.redirect(
        `${process.env.CLIENT_URL}/sso?account_id=${data?._id}`
      );
    }
    else {
      const dataAccount = {
        email: request.user?.emails[0]?.value?.toLowerCase(),
        name: request.user?.displayName,
        status: true,
        phone: '',
        role: 'personal',
        avatar: request?.user?.picture,
      };
      const newUser = await ieltsvietService.user.createUser(dataAccount);
      reply.redirect(
        `${process.env.CLIENT_URL}/sso?account_id=${newUser?.insertedId}`
      );
    }
  } catch (error) {
    reply.redirect(`${process.env.CLIENT_URL}/sso?account_id=null`);
  }
}

module.exports = {
  // loginWithEmail,
  // loginWithPhone,
  loginWithGoogle
};