const express = require('express')
const app = express()
const path = require('path')
const router = express.Router()

const recipes = require('./db')
const upload = require('./uploadMiddleware')
const Resize = require('./Resize')

// function to handle the saving of recipes to ninjadb
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

// function to handle deletion of recipes
router.get('/delete', (req, res) => {
  const { _id } = req.query // grabs _id from request
  recipes.remove({ _id }) // removes recipe from db
  res.status(200).json({ message: 'delete' }) // sends response msg to client
})

// fetches a specific recipe from db
router.get('/get', (req, res) => {
  const { _id } = req.query // grabs _id from request
  const recipe = recipes.find({ _id }) // grabs recipe from db
  const result = recipe ? recipe : 'not found'
  res.send({ recipe: result })
  recipe && recipes.upsert({ _id }, { // updates the viewcount everytime a recipe is fetched
    views: recipe.views + 1
  })
})

// sends the toplist of public recipes from the server. Sorted by saves
router.get('/top', (req, res) => {
  res.send({ recipes: recipes.filter().sort((a, b) => a.saves - b.saves).reverse() })
})

// updates a recipes save count
router.get('/update', (req, res) => {
  const { _id } = req.query
  const recipe = recipes.find({ _id })
  recipes.upsert({ _id }, {
    saves: recipe.saves + 1
  })
})

module.exports = router