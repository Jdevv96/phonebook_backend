// import express lib
const express = require('express') 
const cors = require('cors')
const morgan = require('morgan')
const app = express()

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

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())

const generateID = () => {
    const maxID = persons.length > 0
    ? Math.max( ...persons.map( p => Number(p.id)))
    : 0

    return String(maxID + 1)
}

// routes
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find( p => p.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.get('/api/info', (request, response) => {
    let count = persons.length
    let timestamp = new Date()
    response.send(`
        <p>
        Phonebook has info for ${count} people.
        <br/>
        ${timestamp}
        </p>
    `)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

app.post('/api/persons/', (request, response) =>{
    const body = request.body
    if (!body.name || !body.number) { // if no valid body, return
        return response.status(400).json({
            error: 'Contact name or phone number missing. Please try again.'
        })
    } else if (persons.some( p => p.name.toLowerCase() === body.name.toLowerCase())) {
        return response.status(400).json({
            error: 'Duplicate contact name. Please try again.'
        })
    }
    const person = { // contact object to add
        id: generateID(),
        name: body.name,
        number: body.number
    }

    
    persons = persons.concat(person)
    response.json(person) // responds with the newly added contact
})

const PORT = 3001
app.listen(PORT)