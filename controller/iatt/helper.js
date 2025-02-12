const { statusCode, successMessage, failMessage } = require('~/common/message');

async function upscalePPI(request, reply) {
  try {
    const data = await request.file();
    if (!data) {
      return reply.status(400).send({ message: 'NO FILE UPLOADED' });
    }

    const originalFilename = data.filename;
    const fileExtension = originalFilename.split('.').pop().toLowerCase();
    const fileBuffer = await data.toBuffer();

    console.log("====================================");
    console.log(originalFilename);
    console.log(fileExtension);
    console.log(fileBuffer);
    console.log("====================================");

    const myHeaders = new Headers();
    myHeaders.append("Apikey", "651cb124-2137-42c6-825d-3e1ada596fbe");

    // Convert Buffer to Blob
    const inputFile = Buffer.from(fileBuffer);
    
    const formdata = new FormData();
    formdata.append("inputFile", inputFile);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow"
    };

    const response = await fetch("https://api.cloudmersive.com/convert/image/set-dpi/300", requestOptions);
    const arrayBuffer = await response.arrayBuffer();
    // Chuyển thành Buffer
    const resultBuffer = Buffer.from(arrayBuffer);
    console.log(resultBuffer);
    

    console.log("====================================");
    reply.status(statusCode.success).send({ message: successMessage.index });
  } catch (err) {
    // console.log(err);
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

module.exports = {
  upscalePPI,
};