const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

morgan.token('postdata', function (req, res) { 
  if(req.method!="POST") {
    return
  }
  const poststring = "{name:" + req.body.name + ",number:" + req.body.number + "}"
  return poststring
})

app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postdata'))

let persons = [  
  {
    name: "Hamlet",
    number: "044785673",
    id: 1
  },  
  {
    name: "Momo",
    number: "050894783",
    id: 2
  },
  {
    name: "Ramona",
    number: "090897687",
    id: 3
  }
]

const generateId = () => {
  min = Math.ceil(5);
  max = Math.floor(10000);
  return Math.floor(Math.random() * (max - min)) + min
}

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.post('/api/persons', (req, res) => {
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

  if (persons.find(person => person.name === body.name) != null) {
    return res.status(400).json({
      error: 'Name already exists in database.' 
    })
  }

  const newPerson = {
    name: body.name,
    number: body.number,
    id: generateId()
  }  

  persons.concat(newPerson)

  res.json(newPerson)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if(person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

app.get('/info', (req, res) => {
  const text = 'Phonebook has info for ' + persons.length + ' people<br/><br/>' + new Date()
  res.send(text)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})