const category = require ('../models/blogCatModel')
const asyncHandler = require('express-async-handler')
const validateMongodbId = require('../utils/validateMongodbId')

//create category

const createCategory = asyncHandler (async( req, res) => {
   
    try {
        const newCategory = await category.create(req.body)
        res.json(newCategory)
    } catch (error) {
        throw new Error(error)
    }
})

// uppdate category

const updateCategory = asyncHandler (async (req, res) => {
    const {id} = req.params
  
    try {
        const updated = await category.findByIdAndUpdate(id, req.body , { new :true})
        res.json (updated)
    } catch (error) {
        throw new Error (error)
    }
    
})

//delete category 

const deleteCategory = asyncHandler(async (req, res) => {
    const { id} = req.params
   // validateMongodbId(id)
    try {
        const deleted = await category.findByIdAndDelete(id)
        res.json(deleted)
    } catch (error) {
        throw new Error (error)
    }
})

//get category

const getCategory = asyncHandler(async (req, res) => {
    const {id} = req.params
    try {
        const get = await category.findById(id)
        res.json(get)
    } catch (error) {
        throw new Error(error)
    }
})

//get all category 

const getAllCategory = asyncHandler( async (req, res) => {
   
   try {
    const gets = await category.find()
    res.json(gets)
   } catch (error) {
    throw new Error(error)
   } 
})

module .exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getAllCategory
}