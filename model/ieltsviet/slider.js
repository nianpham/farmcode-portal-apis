const database = require('~/database/connection');

async function find(query) {
  return database.ieltsvietSliderCol().find(query).toArray();
}
async function insertOne(data) {
  return database.ieltsvietSliderCol().insertOne({
    ...data,
    created_at: new Date(),
  });
}

async function findOne(query) {
  return database.ieltsvietSliderCol().findOne(query);
}

async function updateOne(query, data) {
  return database.ieltsvietSliderCol().updateOne(query, { $set: data });
}

async function findSliderWithPagination(
  query,
  paginate,
  { projection = { password: 0 } } = {}
) {
  const {
    sort = { created_at: -1 },
    skip = 0,
    parsedPageSize = 10,
  } = paginate;
  return await database
    .ieltsvietSliderCol()
    .find(query, { projection })
    .sort(sort)
    .skip(skip)
    .limit(parsedPageSize)
    .toArray();
}

async function countDocument(query) {
  return await database.ieltsvietSliderCol().count(query);
}

module.exports = {
  find,
  insertOne,
  findOne,
  updateOne,
  findSliderWithPagination,
  countDocument,
};
