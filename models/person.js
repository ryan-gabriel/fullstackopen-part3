const mongoose = require('mongoose')

const password = process.env.MONGODB_PASSWORD

const url = process.env.MONGODB_URI.replace('<password>', password)

mongoose.set('strictQuery', false)

mongoose.connect(url)
  .then( () => {
    console.log('connected to MongoDB')
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message)
    process.exit(1)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /\d{2,3}-\d+/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    minLength: 8
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', personSchema)