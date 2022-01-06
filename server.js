import express from 'express'
import cors from 'cors'
import { connect } from 'hyper-connect'
import { validate } from './Game.js'
import { decrementCounter, incrementCounter } from './utils.js'
const app = express()
const hyper = connect(process.env.HYPER)

app.use(cors())

app.post('/games', express.json(), function (req, res) {
  validate(req.body)
    .then(hyper.data.add)
    .then(incrementCounter('game'))
    .then(result => res.send(result))
    .catch(error => res.status(500).send(error))
})

app.get('/games/count', function (req, res) {
  hyper.cache.get('game-counter')
    .then(result => res.send(result))
})

app.get('/games/:id', function (req, res) {
  hyper.data.get(req.params.id)
    .then(validate)
    .then(game => res.send(game))
    .catch(err => res.status(404).send({ error: 'Not Found' }))
})

app.put('/games/:id', express.json(), function (req, res) {
  validate(req.body)
    .then(body => hyper.data.update(req.params.id, body))
    .then(result => result.ok ? res.send(result) : Promise.reject(result))
    .catch(err => res.status(err.status || 500).send(err))
})

app.delete('/games/:id', function (req, res) {
  return hyper.data.get(req.params.id)
    .then(validate)
    .then(game => hyper.data.remove(game._id))
    .then(decrementCounter('game'))
    .then(result => result.ok ? res.send(result) : Promise.reject(result))
    .catch(err => res.status(err.status || 500).send(err))
})


app.get('/', function (req, res) {
  res.send('Video Game API')
})

app.listen(3000)
console.log('API Server Running on port 3000')