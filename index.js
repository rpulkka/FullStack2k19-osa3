const express = require('express')
const app = express()

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

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  const text = 'Phonebook has info for ' + persons.length + ' people<br/><br/>' + new Date()
  res.send(text)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})