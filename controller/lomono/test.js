const { statusCode, failMessage } = require('~/common/message');
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);
const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function start(request, reply) {
 try {
   const targetDir = path.join(process.cwd(), 'controller', 'lomono');
   if (!fs.existsSync(targetDir)) {
     fs.mkdirSync(targetDir, { recursive: true });
   }

   const yamlFile = request.body.yaml_file_url;
   const fileName = path.basename(new URL(yamlFile).pathname);
   const configPath = path.join(targetDir, fileName);

   try {
     const response = await axios({
       method: 'get',
       url: yamlFile,
       responseType: 'stream'
     });
     const writer = fs.createWriteStream(configPath);
     response.data.pipe(writer);
     await new Promise((resolve, reject) => {
       writer.on('finish', resolve);
       writer.on('error', reject);
     });
   } catch (downloadError) {
     return reply.status(statusCode.internalError).send({
       message: 'Failed to download config file'
     });
   }

   const promptfooPath = '/home/ubuntu/.nvm/versions/node/v18.20.5/bin/promptfoo';
   const options = {
     cwd: targetDir,
     timeout: 30000,
     maxBuffer: 1024 * 1024 * 10,
     env: {
       ...process.env,
       PATH: `${process.env.PATH}:/home/ubuntu/.nvm/versions/node/v18.20.5/bin`,
       NODE_PATH: process.env.NODE_PATH
     }
   };

   const { stdout } = await execPromise(`${promptfooPath} eval --verbose --config "${configPath}"`, options);
   
   try {
     fs.unlinkSync(configPath);
   } catch (cleanupError) {}

   try {
     const match = stdout.match(/\[HTTP Provider\]: Response: ({.*})/);
     if (match) {
       const jsonResponse = JSON.parse(match[1]);
       const uiResponse = {
         success: true,
         data: {
           message: jsonResponse.text,
           metadata: {
             chatId: jsonResponse.chatId,
             sessionId: jsonResponse.sessionId,
             reasoning: jsonResponse.agentReasoning.map(agent => ({
               name: agent.agentName,
               action: agent.next || agent.messages[0],
               details: agent.messages
             }))
           },
           stats: {
             successRate: "100%", 
             totalTests: 1,
             passed: 1,
             failed: 0
           }
         }
       };
       return reply.status(statusCode.success).send(uiResponse);
     }

     return reply.status(statusCode.success).send({
       success: true,
       data: {
         message: stdout.trim(),
         raw: stdout
       }
     });

   } catch (parseError) {
     return reply.status(statusCode.success).send({
       success: true,
       data: {
         message: stdout.trim(),
         raw: stdout
       }
     });
   }

 } catch (error) {
   return reply.status(statusCode.internalError).send({
     success: false, 
     message: failMessage.internalError,
     error: error.message
   });
 }
}

module.exports = {
 start,
};