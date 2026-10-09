
const express = require('express')
const morgan = require('morgan')
const path = require('path')
const Person = require('./models/person')
const errorHandler = require('./middleware/errorHandler')

const PORT = process.env.PORT || 3001
const app = express()

app.use(express.json())
app.use(express.static(path.join(__dirname, 'dist')))


morgan.token('body', (req) => {
  return req.method === 'POST' || req.method === 'PUT' ? JSON.stringify(req.body) : ''
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// GET все
app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => res.json(persons))
    .catch(error => next(error))
})

// GET по id
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

// DELETE
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch(error => next(error))
})

// POST
app.post('/api/persons', (req, res, next) => {
  const body = req.body
  const parts = body.number.split('-')

  if(body.name.length < 3 || body.number.length < 8 || parts.length !== 2 || (parts[0].length !== 2 && parts[0].length !== 3) ) {
    return res.status(400).json({ error: 'Name and number must be at least 3 characters long' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => res.json(savedPerson))
    .catch(error => next(error))
})



// PUT
app.put('/api/persons/:id', (req, res, next) => {
  const { number } = req.body

  Person.findByIdAndUpdate(
    req.params.id,
    { number },
    { new: true, runValidators: true }
  )
    .then(updatedPerson => {
      if (updatedPerson) {
        res.json(updatedPerson)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

// GET info
app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then(count => {
      res.send(
        `<p>Phonebook has info for ${count} people</p>` +
                `<p>${new Date()}</p>`
      )
    })
    .catch(error => next(error))
})

// Virheidenkäsittely (kaikki reitit tämän jälkeen)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})