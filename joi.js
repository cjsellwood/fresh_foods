const Joi = require("joi");

module.exports.productSchema = Joi.object({
  product: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    quantity: Joi.number().required().min(0),
    category: Joi.string().required(),
    image: Joi.any()
  }).required(),
});

module.exports.categorySchema = Joi.object({
  category: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
  }).required(),
});
