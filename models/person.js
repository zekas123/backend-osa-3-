const mongoose = require('mongoose')
const path = require('path')

require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

mongoose.set('strictQuery', false)


const url = process.env.MONGODB_URI

if (!url) {
  console.log('MONGODB_URI is not set. Check backend/.env file')
  process.exit(1)
}

console.log('connecting')

mongoose.connect(url, { family: 4 })
  .then(() => {
    console.log('connected')
  })
  .catch((error) => {
    console.log('error', error.message)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})


personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)