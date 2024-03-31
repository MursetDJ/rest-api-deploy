const z = require('zod')
const movieSchema = z.object({
  title: z.string({ invalid_type_error: 'Movie title must be a String', required_error: 'Please check URL' }),
  year: z.number().int().positive().min(1900).max(2024),
  director: z.string(),
  duration: z.number().int().positive(),
  poster: z.string().url(),
  genre: z.array(z.enum(['Drama', 'Comedia', 'Biography', 'Adventure', 'Fantasy', 'Action', 'Sci-Fi', 'Romance']), { required_error: 'Movie genre is required' }),
  rate: z.number().min(0).max(10)
})

function validable (object) {
  return movieSchema.safeParse(object)
}
function validatePartial (object) {
  return movieSchema.partial().safeParse(object)
}

module.exports = { validable, validatePartial }
