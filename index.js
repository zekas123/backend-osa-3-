const morgan = require('morgan');
const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express()

app.use(express.json());

morgan.token('body', (req) => {
    return req.method === 'POST' || req.method === 'PUT' ? JSON.stringify(req.body) : '';
});

app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens.body(req, res) 
    ].join(' ');
}));

let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": "1"
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": "2"
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": "3"
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": "4"
    },
    {
      "name": "1",
      "number": "1",
      "id": "FDhVN0E08LM"
    }
]

app.get('/persons', (req, res) => {
    res.json(persons);
});

app.get('/info', (req, res) => {
    const date = new Date();
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`);
});

app.get('/persons/:id', (req, res) => {
    const id = req.params.id; 
    const person = persons.find(p => p.id === id);
    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
});

app.delete('/persons/:id', (req, res) => {
    const id = req.params.id;
    persons = persons.filter(p => p.id !== id);
    res.status(204).end();
});

app.post('/persons', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({ error: 'name or number missing' });
    }

    if (persons.some(person => person.name === body.name)) {
        return response.status(400).json({ 
            error: 'name must be unique' 
        });
    }

    const randomId = Math.floor(Math.random() * 1000000).toString();

    const newPerson = {
        id: randomId,
        name: body.name,
        number: body.number,
    };

    persons = persons.concat(newPerson);
    response.json(newPerson);
});


app.put('/persons/:id', (request, response) => {
    const id = request.params.id;
    const body = request.body;

    const personIndex = persons.findIndex(p => p.id === id);
    if (personIndex === -1) {
        return response.status(404).json({ error: 'person not found' });
    }

    const updatedPerson = {
        ...persons[personIndex],
        number: body.number
    };

    persons = persons.map(p => p.id === id ? updatedPerson : p);
    response.json(updatedPerson);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});