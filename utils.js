import { connect } from 'hyper-connect'
const hyper = connect(process.env.HYPER)

const increment = result => result.count ? result.count + 1 : 1
const decrement = result => result.count ? result.count - 1 : 0

const update = name => count => hyper.cache.set(name, { count })
const resolve = x => result => result.ok ? x : Promise.reject({ status: 500, error: 'Could not find cache' })

export function incrementCounter(type) {
  return function (x) {
    return hyper.cache.get(`${type}-counter`)
      .then(increment)
      .then(update(`${type}-counter`))
      .then(resolve(x))
  }

}

export function decrementCounter(type) {
  return function (x) {
    return hyper.cache.get(`${type}-counter`)
      .then(decrement)
      .then(update(`${type}-counter`))
      .then(resolve(x))
  }

}