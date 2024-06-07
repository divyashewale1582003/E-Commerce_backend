
const express = require('express')


const { createProduct, getaProduct, getallProduct, updateProduct, deleteProduct, addToWishlist, rating, uploadImages } = require("../controller/productCntrl")
const { isAdmin ,  authMiddleware} = require('../middleware/authMiddleware')
const { uploadPhoto, productImgResize } = require('../middleware/uploadImages')

const router = express.Router()

router.post('/', createProduct)

router.get('/:id' , getaProduct)

router.get('/', getallProduct)

router.put('/:id' , updateProduct)



router.put('/upload/:id', authMiddleware, isAdmin, uploadPhoto.array('images' , 10), productImgResize, uploadImages)


router.delete('/:id' , authMiddleware, isAdmin, deleteProduct)

router.put('/wishlist' , authMiddleware, addToWishlist)

router.put('/ratings' , authMiddleware, rating)


module.exports = router