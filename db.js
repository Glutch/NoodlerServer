const ninjadb = require('ninjadb')
const recipes = ninjadb.create('recipes')
//creates and exports a database named recipes
module.exports = recipes