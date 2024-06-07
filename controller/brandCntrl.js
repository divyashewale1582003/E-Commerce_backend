const Brand = require ('../models/brandModel')
const asyncHandler = require('express-async-handler')
const validateMongodbId = require('../utils/validateMongodbId')

//create Brand

const createBrand = asyncHandler (async( req, res) => {
   
    try {
        const newBrand = await Brand.create(req.body)
        res.json(newBrand)
    } catch (error) {
        throw new Error(error)
    }
})

// uppdate Brand

const updateBrand = asyncHandler (async (req, res) => {
    const {id} = req.params
  
    try {
        const updated = await Brand.findByIdAndUpdate(id, req.body , { new :true})
        res.json (updated)
    } catch (error) {
        throw new Error (error)
    }
    
})

//delete Brand 

const deleteBrand = asyncHandler(async (req, res) => {
    const { id} = req.params
   // validateMongodbId(id)
    try {
        const deleted = await Brand.findByIdAndDelete(id)
        res.json(deleted)
    } catch (error) {
        throw new Error (error)
    }
})

//get Brand

const getBrand = asyncHandler(async (req, res) => {
    const {id} = req.params
    try {
        const get = await Brand.findById(id)
        res.json(get)
    } catch (error) {
        throw new Error(error)
    }
})

//get all Brand 

const getAllBrand = asyncHandler( async (req, res) => {
   
   try {
    const gets = await Brand.find()
    res.json(gets)
   } catch (error) {
    throw new Error(error)
   } 
})

module .exports = {
    createBrand,
    updateBrand,
    deleteBrand,
    getBrand,
    getAllBrand
}