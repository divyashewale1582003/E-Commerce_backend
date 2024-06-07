const Blog = require('../models/BlogModel')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const validateMongodbId = require('../utils/validateMongodbId')
const cloudinaryUploadImg = require('../utils/cloudinary')
const fs = require('fs')
//to create a blog

const createBlog = asyncHandler(async (req, res) => {
    try {
        const newBlog = await Blog.create(req.body)
        res.json (newBlog)
    } catch (error) {
        throw new Error(error)
    }
})

//to update a blog

const updateBlog = asyncHandler (async (req, res) => {
    const {id} = req.params
    try {
        const updated = await Blog.findById(id, req.body, { new : true})
        res.json(updated)
    } catch (error) {
        throw new Error(eroor)
    }

})

//get a blocg

const getBlog = asyncHandler( async (req, res) => {
    const {id} = req.params
    try {
        const get = await Blog.findById(id).populate('likes').populate('dislikes')
        await Blog.findByIdAndUpdate(id, {
            $inc : { numViews : 1}
        }, {
            new: true
        })
        res.json(get)
    } catch (error) {
        throw new Error(error)
    }
})

//get all blogs

const getAllBlogs = asyncHandler (async( req, res) => {
    try {
        const getblogs = await Blog.find()
        res.json(getblogs)
    } catch (error) {
        throw new Error (error)
    }
})

//delete blog

const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        const deleted = await Blog.findByIdAndDelete(id)
        res.json(deleted)
    } catch (error) {
        throw new Error (error)
    }
})
  
//blog is liked ?

const likeBlog = asyncHandler( async (req, res) => {
    const { blogId } = req.body
    //validateMongodbId(blogId)

    //Find the  blog which you want to be listed
    const blog = await Blog.findById(blogId)

    //find the login user 
    const loginUserId = req?.user?._id

    //find if user has liked the blog
    const isliked = blog?.isliked

    //find if the user has disliked the blog
    const alreadyDisliked  = blog?.dislikes?.find(
        (userId) => userId?.toString() === loginUserId?.toString())
    
    if(alreadyDisliked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull : {dislikes: loginUserId},
            isDisliked :false
        }, {new : true})
        res.json(blog)
    }
    if (isliked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull : {likes: loginUserId},
            isliked :false
        }, {new : true})
        res.json(blog)
    }
    else {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $push : {likes: loginUserId},
            isliked :true
        }, {new : true})
        res.json(blog)
    }
})

// blog disliked?

const dislikeBlog = asyncHandler( async (req, res) => {
    const { blogId } = req.body
    //validateMongodbId(blogId)

    //Find the  blog which you want to be listed
    const blog = await Blog.findById(blogId)

    //find the login user 
    const loginUserId = req?.user?._id

    //find if user has liked the blog
    const isDisLiked = blog?.isDisLiked

    //find if the user has disliked the blog
    const alreadyLiked  = blog?.likes?.find(
        (userId) => userId?.toString() === loginUserId?.toString())
    
    if(alreadyLiked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull : {likes: loginUserId},
            isLiked :false
        }, {new : true})
        res.json(blog)
    }
    if (isDisLiked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull : {isDislikedlikes: loginUserId},
            isDisliked :false
        }, {new : true})
        res.json(blog)
    }
    else {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $push : {dislikes: loginUserId},
            isDisliked :true
        }, {new : true})
        res.json(blog)
    }
})

// upload Images

const uploadImages =  asyncHandler(async(req, res) => {
   // console.log(req.files);
   const {id} = req. params
   try {
    const uploader = (path) => cloudinaryUploadImg(path, "images")
    const urls = [];
    const files = req.files
    for (const file  of files) {
        const {path} = file
        const newpath = await uploader(path)
        urls.push(newpath)
        fs.unlinkSync(path)
    }
    const findBlog = await Blog.findByIdAndUpdate(
        id,
        {
            images : urls.map((file) => {  
                  return file
            
            }
        
            )
        },
        {
            new:true
        }
    )
    res.json(findBlog)
   } catch (error) {
    throw new Error(error)
   }
})

module.exports = {
    createBlog,
    updateBlog,
    getBlog,
    getAllBlogs,
    deleteBlog,
    likeBlog, 
    dislikeBlog,
    uploadImages
}