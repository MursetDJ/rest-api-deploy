const express = require('express')
const crypto = require('node:crypto')
const movies = require('./movies.json')
const cors = require('cors')
const { validable, validatePartial } = require('./schemas/movies')

const app = express()
app.use(express.json())
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = ['http://localhost:8080', 'http://localhost:8088']
    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }
    if (!origin) {
      return callback(null, true)
    }
    return callback(new Error('not allowed cors'))
  }
}))
app.disable('x-powered-by')
app.get('/', (req, res) => {
  res.json({ message: 'HOLA WAZAAA' })
})
app.get('/movies', (req, res) => {
  const { genre } = req.query
  if (genre) {
    const filteredMovies = movies.filter(movie => movie.genre.some(g => g.toLocaleLowerCase() === genre.toLowerCase()))
    return res.json(filteredMovies)
  }
  return res.json(movies)
})
app.post('/movies', (req, res) => {
  const result = validable(req.body)
  if (result.error) {
    return res.status(400).json({ message: result.error.message })
  }
  const newMovie = {
    id: crypto.randomUUID(), ...result.data
  }
  movies.push(newMovie)

  res.status(201).json(newMovie)
})
app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (movie) return res.json(movie)
  res.status(404).json({ message: 'NOT FOUND' })
})
app.delete('/movies/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)
  if (movieIndex === -1) {
    return res.status(400).json({ message: 'Movie not Found' })
  }
  movies.slice(movieIndex, 1)
  return res.json({ message: 'Movie Deleted' })
})
app.patch('/movies/:id', (req, res) => {
  const { id } = req.params
  const result = validatePartial(req.body)
  if (!result.success) {
    return res.status(400).json({ message: JSON.parse(result.error.message) })
  }
  const movieIndex = movies.findIndex(movie => movie.id === id)
  if (movieIndex === -1) {
    return res.status(400).json({ message: 'Movie not Found' })
  }
  const updateMovie = { ...movies[movieIndex], ...result.data }
  movies[movieIndex] = updateMovie
  return res.json(updateMovie)
})

const PORT = process.env.PORT ?? 3000
app.listen(PORT, (req, res) => {
  console.log(`Server listening on port http://localhost:${PORT}!`)
})
