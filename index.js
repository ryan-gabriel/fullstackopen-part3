
const express = require('express');
const morgan = require('morgan');
const app = express()
app.use(express.json())

morgan.token("response-time", (req, res) => res.getHeader("X-Response-Time") || "0");
morgan.token("req-body", (req) => JSON.stringify(req.body) || "{}");
morgan.token("custom", ":method :url :status :res[content-length] - :response-time ms :req-body")

app.use(morgan("custom"))

let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]



app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
  const date = new Date()
  const personCount = persons.length
  response.send(`
    <p>Phonebook has info for ${personCount} people</p>
    <p>${date}</p>
    `)
  })
  
  
  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })
  
  app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    
    const person = persons.find(p => p.id === id)
    if (person) {
      response.json(person)
    } else {
      response.status(404).end('404 Not Found')
    }
  })
  
  app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const index = persons.findIndex(p => p.id === id)
    
    if (index !== -1) {
      persons.splice(index, 1)
      response.status(204).end("Delete Succesfully")
    } else {
      response.status(404).send('404 Not Found')
  }
})

app.post('/api/persons', (request, response) =>{
  const body = request.body
  if(!body.name || !body.number){
    return response.status(400).json({
      error: 'name or number missing'
    })
  }
  
  if(persons.some(persons => persons.name === body.name)){
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: Math.floor(Math.random() * 10000).toString(),
    name: body.name,
    number: body.number
  }
  persons.push(person)
  response.status(200).json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})