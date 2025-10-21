const express = require('express')
const router = express.Router()
const jsonParser = require('body-parser').json()
const path = require('path')
const fs = require('fs')

console.log('API routes loaded')

// Load tiles data from JSON file
const tilesJsonPath = path.resolve(__dirname, '../../client/js/components/tiles.json')
console.log('Looking for tiles.json at:', tilesJsonPath)

let tilesData = null

try {
  tilesData = JSON.parse(fs.readFileSync(tilesJsonPath, 'utf8'))
  console.log('Tiles data loaded successfully')
} catch (err) {
  console.error('Error loading tiles.json:', err.message)
}

// Get all tiles grouped by column
router.get('/tiles', (req, res) => {
  console.log('GET /api/tiles called')
  if (!tilesData) {
    return res.status(500).json({ error: 'Tiles data not available' })
  }
  
  res.json(tilesData)
})

// Get tiles by column
router.get('/tiles/:column', (req, res) => {
  console.log('GET /api/tiles/:column called with:', req.params.column)
  const columnIndex = parseInt(req.params.column)
  
  if (isNaN(columnIndex) || columnIndex < 0 || columnIndex > 3) {
    return res.status(400).json({ error: 'Invalid column index. Must be 0-3.' })
  }

  if (!tilesData || !tilesData[columnIndex.toString()]) {
    return res.status(404).json({ error: 'Column not found' })
  }

  res.json(tilesData[columnIndex.toString()])
})

module.exports = router