/*multer is a middleware for handling multipart/form-data, primarily used for file uploads.
sharp is an image processing library that allows you to resize, crop, and perform other operations on images.
cloudinary is a third-party service for managing and delivering images and videos.
*/


const multer =  require('multer')   
const sharp = require('sharp')

const path = require('path')

const fs =require('fs')

//mult storage

const multerStorage = multer.diskStorage({
    destination : function (req, file, cb) {
        cb( null, path.join(__dirname, "../public/images"))
    },
    filename: function( req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
        cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg") 
    }
})

//mult filter

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true)
    } else {
        cb (
            {
                message : "Unsupported file format"
            },
            false
        )
    }
}


//upload
const uploadPhoto = multer({
    storage : multerStorage,
    fileFilter : multerFilter,
    limits : { fieldSize: 2000000}
})

// product resize

const productImgResize = async( req, res, next) => {
    if (!req.files)  {
        return next()
        await Promise.all(req.files.map(async(file) => {
            await sharp(file.path).
            resize(300, 300)
            .toFormat('jpeg')
            .jpeg({quality : 90})
            .toFile(`public/images/products/${file.filename}`)
            fs.unlinkSync(`public/images/products/${file.filename}`)  //used to delete images selfly after showing 
        })
         
        )
    } ;next();
}

// Blog resize

const blogImgResize = async( req, res, next) => {
    if (!req.files)  {
        return next()
        await Promise.all(req.files.map(async(file) => {
            await sharp(file.path).
            resize(300, 300)
            .toFormat('jpeg')
            .jpeg({quality : 90})
            .toFile(`public/images/blogs/${file.filename}`)
        })
            
        )
    } next();
}

module.exports = { 
    uploadPhoto,
    productImgResize,
    blogImgResize
}