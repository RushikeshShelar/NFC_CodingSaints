const Joi = require('joi');

module.exports.postschema = Joi.object({
    post: Joi.object({
        title: Joi.string().required(),
        desc: Joi.string().required(),
        author: Joi.string().required(),
        time: Joi.string().required(),
    }).required()
});