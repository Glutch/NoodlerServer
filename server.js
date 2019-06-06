const express = require('express')
const bodyParser = require('body-parser')
const recipes = require('./db')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 4000
const router = require('./router')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.use(express.static('public'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.send({
    recipe: {
      get: 'fetch a single recipe',
      upload: 'upload a recipe'
    }
  })
})

app.use('/recipe', router)

app.listen(port, () => {
  console.log('Server is running on port', port)
})