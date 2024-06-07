const express = require('express')
const { createCoupon, getAllCoupons, getCoupon, updateCoupon, deleteCoupon } = require('../controller/couponCntrl')
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware')
const router = express.Router()

router.post('/' ,authMiddleware, isAdmin,  createCoupon)

router.get('/all' ,authMiddleware, isAdmin,  getAllCoupons)

router.get('/:id' ,authMiddleware, isAdmin,  getCoupon)

router.put('/:id' , authMiddleware, isAdmin,  updateCoupon)

router.delete('/:id' , authMiddleware, isAdmin,  deleteCoupon)

module.exports = router