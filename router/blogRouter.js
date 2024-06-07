const express = require ('express')
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware')
const { createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog, likeBlog, dislikeBlog, uploadImages } = require('../controller/blogcntrl')
const router = express.Router()
const validateMongodbId = require('../utils/validateMongodbId')
const { blogImgResize, uploadPhoto } = require('../middleware/uploadImages')


router.post('/create', authMiddleware, isAdmin, createBlog)

router.put('/likes' , authMiddleware, likeBlog)

router.put('/dislikes' , authMiddleware, dislikeBlog)

router.put('/:id' , authMiddleware, isAdmin ,updateBlog)

router.put('/upload/:id', 
authMiddleware, 
isAdmin, 
uploadPhoto.array('images' , 10), 
blogImgResize, 
uploadImages)

router.get('/:id' ,  getBlog)

router.get('/' ,  getAllBlogs)

router.delete('/:id' , deleteBlog)



module.exports = router