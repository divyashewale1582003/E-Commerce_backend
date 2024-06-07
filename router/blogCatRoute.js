const express = require('express')
const { createCategory, updateCategory, deleteCategory, getCategory, getAllCategory } = require('../controller/blogCatcntrl')
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware')
const router = express.Router()

router.post('/' , authMiddleware, isAdmin ,createCategory)

router.put('/:id' , updateCategory)

router.delete('/:id' ,deleteCategory)

router.get('/:id' ,getCategory)

router.get ( '/', getAllCategory)

module.exports= router