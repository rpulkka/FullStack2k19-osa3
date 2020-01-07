const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})
  
const Person = mongoose.model('Person', personSchema)

if ( process.argv[2] === undefined ) {
  console.log('give valid arguments')
  process.exit(1)
} else if ( process.argv[3] != undefined && process.argv[4] != undefined) {
  const password = process.argv[2]
  const url = "mongodb+srv://rpulkka:" + password + "@fullstack2020-uzswm.mongodb.net/phonebook?retryWrites=true&w=majority"

  mongoose.connect(url, { useNewUrlParser: true })

  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then(result => {
    console.log('Name and number saved!')
    mongoose.connection.close()
  })
} else {
  const password = process.argv[2]
  const url = "mongodb+srv://rpulkka:" + password + "@fullstack2020-uzswm.mongodb.net/phonebook?retryWrites=true&w=majority"

  mongoose.connect(url, { useNewUrlParser: true })

  Person.find({}).then(result => {
    console.log()
    console.log("PHONEBOOK:")
    result.forEach(person => {
      console.log("    " + person.name + " " + person.number)
    })
    mongoose.connection.close()
  })
}


