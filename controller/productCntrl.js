const Product = require('../models/ProductModels')

const Cart = require ('../models/cartModel')

const User = require('../models/userModel')

const asyncHandler = require('express-async-handler')

const slugify = require('slugify')

const cloudinaryUploadImg =  require('../utils/cloudinary')

const fs = require( 'fs')



//create product

const createProduct = asyncHandler(async ( req, res) => {

    try {

        if( req.body.title) {
            req.body.slug = slugify(req.body.title)     //added ..Replacing Spaces,Removing Special Characters,Lowercasing 
        }
        const newProduct = await Product.create(req.body)
        res.json ({newProduct}) 
    } catch (error) {
        throw new Error(error)
    }
    /*res.json ({
        message: "hey!!, it's product post route"     //for just cheking api is created or not
    }) */
})



// get a product

const getaProduct = asyncHandler(async (req, res) =>{
    const{id} = req.params
    try {
        const findProduct = await Product.findById(id)
        res.json(findProduct)
    } catch (error) {
        throw new Error(error)
    }
})

// get all products

const getallProduct = asyncHandler(async (req, res) => {
    //console.log(req.query)   //becoz of this we can add parameters in query section and print it on console
    try { 
        //filtering: but not working
        const queryObj = {...req.query}
        const excludeFields = [ "page", "sort", "limit", " fields"]
        excludeFields.forEach((el) => delete queryObj[el])
        console.log(queryObj)
        

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => '$${match}')
       // console.log(JSON.parse(queryStr));
        let query = Product.find(JSON.parse(queryStr))

        //sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ")
            query = query.sort(sortBy)
        } else {
            query=query.sort("-createdAt")
        }

//limiting the fields

        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ")
            query = query.select(fields)
        } else {
            query = query.select('-__v')  //removing so -  is used 
        }

        // pagination

        const page = req.query.page
        const limit = req.query.limit
        const skip = (page -1) * limit

        query = query.skip(skip).limit(limit)
        if(req.query.page) {
            const productCount = await Product.countDocuments()
            if (skip >= productCount)
            throw new Error('this page is not exists')
        }

        console.log(page, limit, skip);

        const product = await query
        //const findallProduct = await Product.find(//req.query  //also we can use req,query here to get products by the queries. it is basic filtering
        //2nd method for filtering:
        
        /*{
            brand : req.query.brand,
            category:req.query.category
        
        }*/
        //)
        
        //res.json(findallProduct)
        res.json(product)
    } 
    
    //3rd method of filtering
    /*try {
        const queryObj = {...req.query}
        console.log(queryObj)

        const findallProduct = await Product.where('category').equals(
            req.query.category
        )
    } */
    catch (error) {
       throw new Error(error) 
    }
})

//updation of a product


const updateProduct = asyncHandler(async( req, res) => {
    const id =  req.params
    try {
        if( req.body.title) {
            req.body.slug = slugify(req.body.title)     //added ..Replacing Spaces,Removing Special Characters,Lowercasing 
        }

        const update = await Product.findOneAndUpdate( {id}, req.body, 
            {
                new: true
        })
        res.json(update)
    } catch (error) {
        throw new Error ( error)
    }
})

//deletion of a product


const deleteProduct = asyncHandler(async( req, res) => {
    const {id} =  req.params
    try {
        const deleteP =  await Product.findOneAndDelete(id)
        res.json(deleteP)
    } catch (error) {
        throw new Error ( error)
    }
})

// adding product to wishlist

const addToWishlist = asyncHandler(async( req, res) => {
    const {_id} = req.user
    const {prodId} = req.body
    try {
        const user = await User.findById(_id)
        const alreadyadded = user.wishlist.find( (id) => id.toString() === prodId)
        if (alreadyadded) {
            let user = await User.findByIdAndUpdate(_id, {
                $pull : {wishlist : prodId}
            }, 
            {new : true}
            )
            res.json(user)
        } else {
            let user = await User.findByIdAndUpdate(_id, {
                $push : {wishlist : prodId}
            }, 
            {new : true})
            res.json(user)
    } 
}catch (error) {
        throw new Error(error)
    }
})

// ratings

 const rating = asyncHandler( async (req, res) => {
    const {_id} = req.user
    const { star , prodId, comment} = req.body
    try {
        const product =  await Product.findById(prodId)
        let alreadyRated = product.ratings.find(
                        (userId) => userId.postedby.toString() === _id.toString()
        )
        if (alreadyRated) {
           const updateRating = await Product.updateOne(
               {
                    ratings : {$eleMatch: alreadyRated}
                },
               {
                   $set: {"ratings.$.star" : star , "ratings.$.comment" : comment}
               },
               {
                   new : true
                },
           )
          // res.json(updateRating)
               } else {
            const rateProduct = await Product.findByIdAndUpdate(prodId, {
                $push : {
                    ratings : {
                        star : star,
                        comment : comment,
                        postedby : _id
                    }
                }
            },
            {
                new:true
          })
           // res.json(rateProduct)
         }
         const getallratings = await Product.findById(prodId)
         let totalRating = getallratings.ratings.length
         let ratingsum = getallratings.ratings
        .map((item) => prev_curr, 0)
         .reduce ( (prev, curr) => prev + curr, 0)
         let actualRating = Math.round(ratingsum / totalRating)
         let finalproduct = await Product.findByIdAndUpdate(
           prodId, {
               totalrating : actualRating,
            },
            {
                new :true
             }
        )
         res.json(finalproduct)
    } catch (error) {
        throw new Error (error)
    }
})



/*const rating = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, prodId, comment } = req.body;

    try {
        // Find the product
        const product = await Product.findById(prodId);
        console.log('Product:', product);

        // Check if the user has already rated the product
        const alreadyRatedIndex = product.ratings.findIndex(
            (rating) => rating.postedby.toString() === _id.toString()
        );
        console.log('Already Rated Index:', alreadyRatedIndex);

        if (alreadyRatedIndex !== -1) {
            // Update the existing rating
            product.ratings[alreadyRatedIndex].star = star;
            product.ratings[alreadyRatedIndex].comment = comment;
        } else {
            // Add a new rating
            product.ratings.push({
                star,
                comment,
                postedby: _id,
            });
        }

        // Calculate the average rating
        const totalRating = product.ratings.length;
        const ratingsum = product.ratings.reduce((sum, rating) => sum + rating.star, 0);
        const actualRating = totalRating === 0 ? 0 : Math.round(ratingsum / totalRating);

        // Update the product with the new total rating
        product.totalrating = actualRating;

        // Save the updated product in the database
        const finalProduct = await product.save();
        console.log('Updated Product:', finalProduct);

        res.json(finalProduct);
    } catch (error) {
        console.error('Error in rating:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
chatgpt thaa
*/



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
    const findProduct = await Product.findByIdAndUpdate(
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
    res.json(findProduct)
   } catch (error) {
    throw new Error(error)
   }
})

const getUserCart = asyncHandler(async (req, res) => {
    const {_id} = req.user
    try {
        const cart = await Cart.findOne({orderby : _id}).populate(
            "products.product"
    )
    res.json(cart)}
     catch (error) {
        throw new Error(Error)
    }
})

module.exports = 
{
    createProduct,
    getaProduct,
    getallProduct,
    updateProduct,
    deleteProduct,
    addToWishlist,
    rating,
    uploadImages,
    getUserCart
}