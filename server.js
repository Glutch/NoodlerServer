const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 4000
const router = require('./router')

//bodyparser is used to simplify the request data (image and recipe data)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//cors is used to prevent bugs where the client sometimes dont have access rights from a different origin / location of server
app.use(cors())

// we use our "public" folder to store our images and make it public so a browser can access them
app.use(express.static('public'))

// root route, nothing interesting
app.get('/', (req, res) => {
  res.send({ message: 'Welcome to the RamenServer!' })
})

// this is where the magic happens. check router.js
app.use('/recipe', router)

app.listen(port, () => {
  console.log('Server is running on port', port)
})