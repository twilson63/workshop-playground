import { z } from 'zod'

const Game = z.object({
  _id: z.string(),
  type: z.literal('game'),
  name: z.string(),
  released: z.string().min(4).max(4).regex(/^([0-9]){4}$/)
})

/**
 * @param {Game} data
 */
export function validate(data) {
  return Game.parseAsync(data)
}