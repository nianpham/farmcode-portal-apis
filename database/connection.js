require('dotenv').config();
const { MongoClient } = require('mongodb');

const mongoDBUrl = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

const connectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let marketWarehouse = null;
let client = null;
let db = null;
let _ecokaProductCol = null;

async function connection(cb) {
  if (db) {
    console.log('>>>>>> Reusing existing DB connection <<<<<<');
    cb();
    return;
  }
  client = new MongoClient(mongoDBUrl, connectOptions);
  try {
    await client.connect();
    db = client.db(dbName);
    marketWarehouse = db.collection('market_warehouses');
    _ecokaProductCol = db.collection('ecoka_products');
    await marketWarehouse.createIndex({
      created_at: 1,
      updated_at: 1,
      created_by: 1,
      updated_by: 1,
    });
    console.log('>>>>>>>> Connected to DB Successfully <<<<<<<<');
    cb();
  } catch (e) {
    console.error('Connection error:', e);
  }
}

const ecokaProductCol = () => _ecokaProductCol;

module.exports = {
  connection,
  ecokaProductCol,
};
