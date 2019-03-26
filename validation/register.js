const validator = require('validator');
const isEmpty = require('./is-empty')
// validator.isEmail('foo@bar.com'); //=> true

module.exports = function validateRegisterInput(data) {
    let errors = {};

    if(!validator.isLength(data.name,{min: 2, max:30})){
        errors.name = "名字的长度不小于2位且不大于30位"
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}