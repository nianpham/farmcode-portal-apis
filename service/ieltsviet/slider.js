const { ieltsvietModel } = require('~/model');
const { ObjectId } = require("mongodb");

async function getAllSliders() {
  const slider = await ieltsvietModel.slider.findOne({ name: 'slider1' });
  return slider.data;
}

async function updateSlider(data) {
  console.log(data);
  return ieltsvietModel.slider.updateOne({ name: 'slider1' }, data);
}

module.exports = {
  getAllSliders,
  updateSlider,
};
