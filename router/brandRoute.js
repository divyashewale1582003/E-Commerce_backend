const express = require('express')
const { createBrand, updateBrand, deleteBrand, getBrand, getAllBrand } = require('../controller/brandCntrl')
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware')
const router = express.Router()

router.post('/' , authMiddleware, isAdmin ,createBrand)

router.put('/:id' , updateBrand)

router.delete('/:id' ,deleteBrand)

router.get('/:id' ,getBrand)

router.get ( '/', getAllBrand)

module.exports= router