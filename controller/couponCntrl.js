const Coupon = require('../models/couponModel')
const validateMongodbId = require('../utils/validateMongodbId')
const asyncHandler = require('express-async-handler')

//create coupon

const createCoupon = asyncHandler(async (req, res) => {
    try {
        const newcoupon = await Coupon.create(req.body)
        res.json(newcoupon)
    } catch (error) {
        throw new Error (error)
    }
})

//get all coupons

const getAllCoupons = asyncHandler( async (req, res) => {
    try {
        const getAll = await Coupon.find()
        res.json(getAll)
    } catch (error) {
        throw new Error(error)
    }
})

//get a single Coupon

const getCoupon = asyncHandler( async ( req, res) => {
    const {id} = req.params
    try {
        const gets = await Coupon.findById(id)
        res.json(gets)
    } catch (error) {
        throw new Error(error)
    }
})

//update a coupon 

const updateCoupon = asyncHandler( async( req, res) => {
    const { id} = req. params
    try {
        const updated = await Coupon.findByIdAndUpdate(id, req.body, {new: true})
        res.json(updated)
    } catch (error) {
        throw new Error(error)

    }
})

// delete a coupon 

const deleteCoupon = asyncHandler(async ( req, res) => {
    const {id} = req.params
    try {
        const deleted = await Coupon.findByIdAndDelete(id)
        res.json(deleted)
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = {
    createCoupon,
    getAllCoupons,
    getCoupon,
    updateCoupon,
    deleteCoupon
}