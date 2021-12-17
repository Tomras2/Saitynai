const Joi = require('joi');

function validateSport(sport) {
    const schema = {
        name: Joi.string().required(),
    };
    return Joi.validate(sport, schema);
};
function validateClub(club) {
    const schema = Joi.object().keys({
        name: Joi.string().required(),
        director: Joi.string(),
        budget: Joi.number(),
        sport_id_FK: Joi.number()
    }).unknown(true);
    return Joi.validate(club, schema);
};
function validateProduct(product) {
    const schema = Joi.object().keys({
        name: Joi.string().required(),
        price: Joi.number().required(),
        description: Joi.string(),
        club_id_FK: Joi.number()
    }).unknown(true);
    return Joi.validate(product, schema);
};
function validateUser(user) {
    const schema = {
        username: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
        role: Joi.number()
    };
    return Joi.validate(user, schema);
};
module.exports =  {validateClub, validateSport, validateProduct, validateUser}