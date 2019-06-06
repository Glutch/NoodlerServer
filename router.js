const express = require('express')
const app = express()
const path = require('path')
const router = express.Router()

const recipes = require('./db')
const upload = require('./uploadMiddleware')
const Resize = require('./Resize')

const addRecipe = (body, filename) => {
  recipes.push({
    _id: body._id,
    name: body.name,
    text: body.text,
    score: body.score,
    saves: 0,
    views: 0,
    image: filename,
    date: new Date()
  })
  console.log(body.name, 'added')
}

router.post('/upload', upload.single('image'), async (req, res) => {
  if (!recipes.find({ _id: req.body._id })) {
    const imagePath = path.join(__dirname, '/public/images')
    const fileUpload = new Resize(imagePath) // initialises Resize & Save image
    if (!req.file) { // if no file is attached in the post request, send error msg
      console.log('no file')
      res.status(401).json({ error: 'Please provide an image' })
    }
    const filename = await fileUpload.save(req.file.buffer) // saves the image and returns the filename
    addRecipe(req.body, filename) //adds recipe to database
    return res.status(200).json({ status: 'success' })
  } else {
    return res.status(200).json({ status: 'already uploaded' })
  }
})

router.get('/delete', (req, res) => {
  const { _id } = req.query
  recipes.remove({ _id })
  res.status(200).json({ message: 'delete' })
})

router.get('/get', (req, res) => {
  const { _id } = req.query
  const recipe = recipes.find({ _id })
  const result = recipe ? recipe : 'not found'
  res.send({ recipe: result })
  recipes.upsert({ _id }, {
    views: recipe.views + 1
  })
})

router.get('/top', (req, res) => {
  res.send({ recipes: recipes.filter().sort((a, b) => a.saves - b.saves).reverse() })
})

router.get('/update', (req, res) => {
  const { _id } = req.query
  const recipe = recipes.find({ _id })
  recipes.upsert({ _id }, {
    saves: recipe.saves + 1
  })
})

module.exports = router