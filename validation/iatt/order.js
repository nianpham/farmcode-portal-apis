const Joi = require('joi');

const CreateBlogSchema = Joi.object().keys({
    product_id: Joi.string().length(24).required(), 
    account_email: Joi.string().email().required(),
    image: Joi.string().uri().required(),
    color: Joi.string().max(20).required(),
    size: Joi.string().max(10).required(),
    address: Joi.string().max(100).required(),
    payment_method: Joi.string().valid('bank', 'credit').required(),  
    status: Joi.string().valid('pending', 'waiting',' delivering', 'completed').required(),
    total: Joi.number().positive().required(),
    date_completed: Joi.string().allow('').optional(),
});

const UpdateBlogSchema = Joi.object().keys({
  title: Joi.string().max(255).optional(),
  content: Joi.string().optional(),
  tag: Joi.string().max(50).optional(),
  author: Joi.string().max(100).optional(),
  date: Joi.date().iso().optional(),
  thumbnail: Joi.string().uri().optional(),
});

module.exports = {
  CreateBlogSchema,
  UpdateBlogSchema,
};
