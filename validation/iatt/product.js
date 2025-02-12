const Joi = require('joi');

const CreateProductSchema = Joi.object().keys({
  name: Joi.string().max(250).required(), 
  description: Joi.string().required(),
  introduction: Joi.string().optional(),
  price: Joi.string().required(),
  category: Joi.string().valid('Frame','Album','Plastic').required(),
  color: Joi.array().items(Joi.string().valid('black', 'gold', 'white', 'wood')).required(),
  thumbnail: Joi.string().uri().required(),
  images: Joi.array().items(Joi.string().uri()).required(),
});

const UpdateProductSchema = Joi.object().keys({
  name: Joi.string().max(250).optional(), 
  description: Joi.string(),
  introduction: Joi.string().optional(),
  price: Joi.string().optional(),
  category: Joi.string().valid('Frame','Album','Plastic').optional(),
  color: Joi.array().items(Joi.string().valid('black', 'gold', 'white', 'wood')).optional(),
  sold: Joi.number().optional(),
  thumbnail: Joi.string().uri().optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
});

module.exports = {
  CreateProductSchema,
  UpdateProductSchema,
};
