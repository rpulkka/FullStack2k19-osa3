require('dotenv').config()
const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');
const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    unique: true
  },
  number: {
    type: String,
    minlength: 8,
    unique: true
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

personSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Person', personSchema)