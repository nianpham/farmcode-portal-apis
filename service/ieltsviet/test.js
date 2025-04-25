const { ieltsvietModel } = require('~/model');
const { ObjectId } = require('mongodb');
const crypto = require('crypto');
const { log } = require('console');

async function getAllCollections() {
  const collections = await ieltsvietModel.testcollection.find({});
  return collections.filter((collection) => !collection.deleted_at);
}

async function getCollection(id) {
  const collection = await ieltsvietModel.testcollection.findOne({
    _id: new ObjectId(id),
  });
  return collection;
}

async function updateCollection(id, data) {
  return ieltsvietModel.testcollection.updateOne(
    { _id: new ObjectId(id) },
    data
  );
}

async function createCollection(data) {
  let full_tests = [];
  for (const full_test of data.full_tests) {
    const full_test_insert = await createTest(full_test);
    full_tests.push(full_test_insert.data.test_id);
  }
  const data_insert = {
    name: data.name,
    full_tests: full_tests,
  };
  const insertedCollection =
    await ieltsvietModel.testcollection.insertOne(data_insert);
  return {
    message: 'Create collection successfully',
    data: {
      collection_id: insertedCollection.insertedId,
    },
  };
}

async function deleteCollection(id) {
  const dataUpdate = {
    deleted_at: new Date(),
  };
  return ieltsvietModel.testcollection.updateOne(
    { _id: new ObjectId(id) },
    dataUpdate
  );
}

async function getAllTests() {
  const tests = await ieltsvietModel.btest.find({});
  return tests.filter((test) => !test.deleted_at);
}

async function getTest(id) {
  const test = await ieltsvietModel.btest.findOne({
    _id: new ObjectId(id),
  });
  return test;
}

async function updateTest(id, data) {
  return ieltsvietModel.btest.updateOne(
    { _id: new ObjectId(id) },
    data
  );
}

async function createTest(data) {
  let r_id = '';
  let l_id = '';
  let w_id = '';
  for (const test of data.tests) {
    switch (test.skill) {
      case 'R':
        const result_r = await createSkillTest(test);
        r_id = result_r.data.test_id;
        break;
      case 'L':
        const result_l = await createSkillTest(test);
        l_id = result_l.data.test_id;
        break;
      case 'W':
        const result_w = await createSkillTest(test);
        w_id = result_w.data.test_id;
        break;
    }
  }
  const full_test_insert = {
    name: data.name,
    thumbnail: data.thumbnail,
    description: data.description,
    r_id: r_id,
    l_id: l_id,
    w_id: w_id,
  };
  const insertedFullTest =
    await ieltsvietModel.btest.insertOne(full_test_insert);
  return {
    message: 'Create test successfully',
    data: {
      test_id: insertedFullTest.insertedId,
    },
  };
}

async function deleteTest(id) {
  const dataUpdate = {
    deleted_at: new Date(),
  };
  return ieltsvietModel.btest.updateOne(
    { _id: new ObjectId(id) },
    dataUpdate
  );
}

async function getAllSkillTests(type) {
  if (type) {
    let skill = '';
    switch (type) {
      case 'reading':
        skill = 'R';
        break;
      case 'listening':
        skill = 'L';
        break;
      case 'writing':
        skill = 'W';
        break;
    }
    var tests = await ieltsvietModel.stest.find({
      type: skill,
    });
  } else {
    var tests = await ieltsvietModel.stest.find({});
  }
  return tests.filter((test) => !test.deleted_at);
}

async function getPart(id) {
  const part = await ieltsvietModel.testpart.findOne({
    _id: new ObjectId(id),
    deleted_at: { $exists: false },
  });
  let questions = [];
  for (const question of part.question) {
    const questionData = await ieltsvietModel.question.findOne({
      _id: new ObjectId(question),
      deleted_at: { $exists: false },
    });
    questions.push(questionData);
  }
  part.question = questions;
  return part;
}

async function getQuestion(id) {
  const question = await ieltsvietModel.question.findOne({
    _id: new ObjectId(id),
  });
  return question;
}

async function getSkillTest(id) {
  const test = await ieltsvietModel.stest.findOne({
    _id: new ObjectId(id),
  });
  return test;
}

async function updateSkillTest(id, data) {
  return ieltsvietModel.stest.updateOne(
    { _id: new ObjectId(id) },
    data
  );
}

async function createSkillTest(data) {
  let testId;
  try {
    switch (data.skill) {
      case 'R': {
        const data_insert_r = {
          type: 'R',
          parts: [],
          name: data.name,
          thumbnail: data.thumbnail,
          time: data.time,
        };
        const stest =
          await ieltsvietModel.stest.insertOne(data_insert_r);
        testId = stest.insertedId;

        for (const part of data.parts) {
          const part_insert_r = {
            stest_id: stest.insertedId,
            type: 'R',
            image: part.image,
            content: part.content,
            part_num: part.part_num,
            question: [],
          };
          const insertedPart =
            await ieltsvietModel.testpart.insertOne(part_insert_r);
          await ieltsvietModel.stest.updateOne(
            { _id: stest.insertedId },
            { $addToSet: { parts: insertedPart.insertedId } }
          );

          for (const question of part.questions) {
            let question_insert_r;
            switch (question.q_type) {
              case 'MP':
                question_insert_r = {
                  q_type: 'MP',
                  part_id: insertedPart.insertedId,
                  question: question.question,
                  choices: question.choices,
                  isMultiple: question.isMultiple,
                  answer: question.answer,
                };
                break;
              case 'FB':
                question_insert_r = {
                  q_type: 'FB',
                  part_id: insertedPart.insertedId,
                  image: question.image,
                  start_passage: question.start_passage,
                  end_passage: question.end_passage,
                  answer: question.answer,
                };
                break;
              case 'W':
                question_insert_r = {
                  q_type: 'W',
                  part_id: insertedPart.insertedId,
                  image: question.image,
                  content: question.topic,
                };
                break;
              default:
                throw new Error(
                  `Invalid question type: ${question.q_type}`
                );
            }
            const insertedQuestion =
              await ieltsvietModel.question.insertOne(
                question_insert_r
              );
            await ieltsvietModel.testpart.updateOne(
              { _id: insertedPart.insertedId },
              { $addToSet: { question: insertedQuestion.insertedId } }
            );
          }
        }
        break;
      }
      case 'L': {
        const data_insert_l = {
          type: 'L',
          parts: [],
          name: data.name,
          thumbnail: data.thumbnail,
          time: data.time,
        };
        const stest_l =
          await ieltsvietModel.stest.insertOne(data_insert_l);
        testId = stest_l.insertedId;

        for (const part of data.parts) {
          const part_insert_l = {
            stest_id: stest_l.insertedId,
            type: 'L',
            audio: part.audio,
            part_num: part.part_num,
            question: [],
          };
          const insertedPart =
            await ieltsvietModel.testpart.insertOne(part_insert_l);
          await ieltsvietModel.stest.updateOne(
            { _id: stest_l.insertedId },
            { $addToSet: { parts: insertedPart.insertedId } }
          );

          for (const question of part.questions) {
            let question_insert_l;
            switch (question.q_type) {
              case 'MP':
                question_insert_l = {
                  q_type: 'MP',
                  part_id: insertedPart.insertedId,
                  question: question.question,
                  choices: question.choices,
                  isMultiple: question.isMultiple,
                  answer: question.answer,
                };
                break;
              case 'FB':
                question_insert_l = {
                  q_type: 'FB',
                  part_id: insertedPart.insertedId,
                  image: question.image,
                  start_passage: question.start_passage,
                  end_passage: question.end_passage,
                  answer: question.answer,
                };
                break;
              case 'W':
                question_insert_l = {
                  q_type: 'W',
                  part_id: insertedPart.insertedId,
                  image: question.image,
                  content: question.topic,
                };
                break;
              default:
                throw new Error(
                  `Invalid question type: ${question.q_type}`
                );
            }
            const insertedQuestion =
              await ieltsvietModel.question.insertOne(
                question_insert_l
              );
            await ieltsvietModel.testpart.updateOne(
              { _id: insertedPart.insertedId },
              { $addToSet: { question: insertedQuestion.insertedId } }
            );
          }
        }
        break;
      }
      case 'W': {
        const data_insert_w = {
          type: 'W',
          parts: [],
          name: data.name,
          thumbnail: data.thumbnail,
          time: data.time,
        };
        const stest_w =
          await ieltsvietModel.stest.insertOne(data_insert_w);
        testId = stest_w.insertedId;

        for (const part of data.parts) {
          const part_insert_w = {
            stest_id: stest_w.insertedId,
            type: 'W',
            part_num: part.part_num,
            question: [],
          };
          const insertedPart =
            await ieltsvietModel.testpart.insertOne(part_insert_w);
          await ieltsvietModel.stest.updateOne(
            { _id: stest_w.insertedId },
            { $addToSet: { parts: insertedPart.insertedId } }
          );

          for (const question of part.questions) {
            let question_insert_w;
            switch (question.q_type) {
              case 'MP':
                question_insert_w = {
                  q_type: 'MP',
                  part_id: insertedPart.insertedId,
                  choices: question.choices,
                  isMultiple: question.isMultiple,
                  answer: question.answer,
                };
                break;
              case 'FB':
                question_insert_w = {
                  q_type: 'FB',
                  part_id: insertedPart.insertedId,
                  image: question.image,
                  start_passage: question.start_passage,
                  end_passage: question.end_passage,
                  answer: question.answer,
                };
                break;
              case 'W':
                question_insert_w = {
                  q_type: 'W',
                  part_id: insertedPart.insertedId,
                  image: question.image,
                  content: question.topic,
                };
                break;
              default:
                throw new Error(
                  `Invalid question type: ${question.q_type}`
                );
            }
            const insertedQuestion =
              await ieltsvietModel.question.insertOne(
                question_insert_w
              );
            await ieltsvietModel.testpart.updateOne(
              { _id: insertedPart.insertedId },
              { $addToSet: { question: insertedQuestion.insertedId } }
            );
          }
        }
        break;
      }
      default:
        throw new Error(`Invalid skill type: ${data.skill}`);
    }

    return {
      message: 'Create skill test successfully',
      data: {
        test_id: testId,
      },
    };
  } catch (error) {
    throw new Error(`Failed to create skill test: ${error.message}`);
  }
}

async function deleteSkillTest(id) {
  const dataUpdate = {
    deleted_at: new Date(),
  };
  return ieltsvietModel.stest.updateOne(
    { _id: new ObjectId(id) },
    dataUpdate
  );
}

async function createSubmit(data) {
  let parts = [];
  for (const part of data.parts) {
    const testpart = await ieltsvietModel.testpart.findOne({
      _id: new ObjectId(part.part_id),
      deleted_at: { $exists: false },
    });
    if (testpart.type === 'R' || testpart.type === 'L') {
      let correct_count = 0;
      let incorrect_count = 0;
      let pass_count = 0;
      let user_answers = [];
      for (const user_answer of part.user_answers) {
        let is_correct = false;
        let is_incorrect = false;
        let is_pass = false;
        const question = await ieltsvietModel.question.findOne({
          _id: new ObjectId(user_answer.question_id),
          deleted_at: { $exists: false },
        });
        if (question) {
          if (question.q_type === 'MP' || question.q_type === 'FB') {
            if (
              question.answer.length === user_answer.answer.length &&
              question.answer.every(
                (val, index) => val === user_answer.answer[index]
              )
            ) {
              correct_count++;
              console.log('correct_count', correct_count);
              is_correct = true;
            } else if (
              user_answer.answer.length === 0 &&
              question.answer.length !== user_answer.answer.length
            ) {
              pass_count++;
              is_pass = true;
            } else if (
              user_answer.answer.length !== 0 &&
              question.answer !== user_answer.answer
            ) {
              incorrect_count++;
              is_incorrect = true;
            }
            user_answers.push({
              question_id: user_answer.question_id,
              answer: user_answer.answer,
              correct_answer: question.answer,
              is_correct,
              is_pass,
            });
          }
        }
      }
      parts.push({
        type: testpart.type,
        part_id: part.part_id,
        user_answers: user_answers,
        correct_count: correct_count,
        incorrect_count: incorrect_count,
        pass_count: pass_count,
        is_complete: part.is_complete,
      });
    } else if (part.type === 'W') {
      let user_answers = [];
      for (const user_answer of part.user_answers) {
        const question = await ieltsvietModel.question.findOne({
          _id: new ObjectId(user_answer.question_id),
          deleted_at: { $exists: false },
        });
        if (question) {
          if (question.q_type === 'W') {
            user_answers.push({
              question_id: user_answer.question_id,
              answer: user_answer.answer,
              topic: question.content,
            });
          }
        }
      }
      parts.push({
        type: testpart.type,
        part_id: part.part_id,
        user_answers: user_answers,
        is_complete: part.is_complete,
      });
    }
  }
  const data_insert = {
    user_id: data.user_id,
    parts: parts,
  };
  const insertedSubmit =
    await ieltsvietModel.completepart.insertOne(data_insert);
  return {
    message: 'Create submit successfully',
    data: {
      submit_id: insertedSubmit.insertedId,
      result: parts,
    },
  };
}

module.exports = {
  getAllCollections,
  getCollection,
  updateCollection,
  createCollection,
  deleteCollection,
  getAllTests,
  getTest,
  updateTest,
  createTest,
  deleteTest,
  getAllSkillTests,
  getSkillTest,
  updateSkillTest,
  createSkillTest,
  deleteSkillTest,
  getPart,
  getQuestion,
  createSubmit,
};
