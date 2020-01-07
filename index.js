require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('postdata', function (req, res) { 
  if(req.method!="POST") {
    return
  }
  const poststring = "{name:" + req.body.name + ",number:" + req.body.number + "}"
  return poststring
})

app.use(express.static('build'))
app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postdata'))
app.use(cors())

const generateId = () => {
  min = Math.ceil(5);
  max = Math.floor(10000);
  return Math.floor(Math.random() * (max - min)) + min
}

//Routes

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
    console.log(persons.length)
  })
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body.name) {
    return res.status(400).json({
      error: 'Name missing.' 
    })
  }
  
  if (!body.number) {
    return res.status(400).json({
      error: 'Number missing.' 
    })
  }

  /*if (persons.find(person => person.name === body.name) != null) {
    return res.status(400).json({
      error: 'Name already exists in database.' 
    })
  }*/

  const newPerson = new Person({
    name: body.name,
    number: body.number,
    id: generateId()
  })  

  newPerson
    .save()
    .then(savedPerson => {
      res.json(savedPerson.toJSON())
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if(person) {
        res.json(person.toJSON())
      } else {
        response.status(204).end()
      }
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    res.send('Phonebook has info for ' + persons.length + ' people<br/><br/>' + new Date())
  })
})

//Error handling

//Default error
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

//Error handler
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {    
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})