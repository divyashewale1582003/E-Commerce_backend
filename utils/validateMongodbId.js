const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const validateMongodbId = (id) =>
{
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) 
    throw new Error("this is not valid or not found");
};

module.exports = {validateMongodbId}