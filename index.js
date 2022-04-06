require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json())
app.use(express.static('build'))

const cors = require('cors')
app.use(cors())

/* more debugging
const morgan = require('morgan')
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :body'))*/

const requestLogger = (request, response, next) => {
    console.log(`Method: ${request.method}`)
    console.log(`Path: ${request.path}`)
    console.log(`Body: ${request.body}`)
    console.log('---')
    next()
}
app.use(requestLogger)

const Person = require('./models/person')

app.get('/info', (request, response) => {
    let date = new Date()
    response.send(`Phonebook has info for ${persons.length} people<br>${date}`)
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

/* TODO: fix
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})*/

/* not used anymore
const generateId = () => {
    const id = Math.floor(Math.random() * 99999)

    return id
}*/

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    // TODO: fix later, its fine for now
    /*
    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }*/

    const person = new Person({
        name: body.name, 
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({
        error: 'unknown endpoint'
    })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`)
})