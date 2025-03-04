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
let _helperAddressCol = null;
let _ecokaProductCol = null;
let _iattProductCol = null;
let _iattBlogCol = null;
let _iattOrderCol = null;
let _iattAccountCol = null;
let _iattDiscountCol = null;
let _ieltsvietSliderCol = null;
let _ieltsvietReviewCol = null;
let _ieltsvietBlogCol = null;
let _ieltsvietAccountCol = null;
let _ieltsvietTimekeepingCol = null;
let _ieltsvietAuthorCol = null;


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
    _iattProductCol = db.collection('iatt_products');
    _iattBlogCol = db.collection('iatt_blogs');
    _iattOrderCol = db.collection('iatt_orders');
    _iattAccountCol = db.collection('iatt_accounts');
    _iattDiscountCol = db.collection('iatt_discounts');
    _ieltsvietSliderCol = db.collection('ieltsviet_sliders');
    _ieltsvietReviewCol = db.collection('ieltsviet_reviews');
    _ieltsvietBlogCol = db.collection('ieltsviet_blogs');
    _ieltsvietAccountCol = db.collection('ieltsviet_accounts');
    _ieltsvietTimekeepingCol = db.collection('ieltsviet_timekeepings');
    _ieltsvietAuthorCol = db.collection('ieltsviet_authors');
    _helperAddressCol = db.collection('helper_address');


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
const iattProductCol = () => _iattProductCol;
const iattBlogCol = () => _iattBlogCol;
const iattOrderCol = () => _iattOrderCol;
const iattAccountCol = () => _iattAccountCol;
const ieltsvietSliderCol = () => _ieltsvietSliderCol;
const ieltsvietReviewCol = () => _ieltsvietReviewCol;
const ieltsvietBlogCol = () => _ieltsvietBlogCol;
const ieltsvietAccountCol = () => _ieltsvietAccountCol;
const ieltsvietTimekeepingCol = () => _ieltsvietTimekeepingCol;
const ieltsvietAuthorCol = () => _ieltsvietAuthorCol;
const helperAddressCol = () => _helperAddressCol;
const iattDiscountCol = () => _iattDiscountCol;

module.exports = {
  connection,
  ecokaProductCol,
  iattProductCol,
  iattBlogCol,
  iattOrderCol,
  iattAccountCol,
  ieltsvietSliderCol,
  ieltsvietReviewCol,
  ieltsvietBlogCol,
  ieltsvietAccountCol,
  ieltsvietTimekeepingCol,
  ieltsvietAuthorCol,
  helperAddressCol,
  iattDiscountCol,
};
