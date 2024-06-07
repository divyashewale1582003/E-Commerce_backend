const User = require('../models/userModel')
const Product = require('../models/ProductModels')
const Cart = require('../models/cartModel')
const Coupon = require('../models/couponModel')
const uniqid = require('uniqid')
const {generateToken} = require('../config/jwtToken')
const asyncHandler = require('express-async-handler')
const {validateMongodbId} = require('../utils/validateMongodbId')
const { generateRefreshToken } = require('../config/refreshToken')
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('./emailCntrl')
const JWT_SECRET = process.env.JWT_SECRET;

// register User

const createUser = asyncHandler(async (req , res) => {
    const email = req.body.email
    const findUser = await User.findOne({email : email})
    if (!findUser) {
        //create a new User
        const newUser = await User.create(req.body);
        res.json(newUser)

    }
    else {
        throw new Error('User Already Exists')
    }
} )

//login User
const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password} = req.body
    //console.log(email, password)  
    //check if User exist or not
    const findUser = await User.findOne({email})
    if (findUser && (await findUser.isPasswordMatched(password))) {
        
        const refreshToken = await generateRefreshToken(findUser?._id)  //add after,,for refreshtoken
        const updateUser = await User.findByIdAndUpdate(findUser.id, {
            refreshToken : refreshToken
        },
        {new:true}
        );

        res.cookie("refreshToken", refreshToken, {
            httpOnly : true,
            maxAge : 72 * 60 * 60 * 1000
        })  //cookie-parser
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id),
        });
    } else {
        throw new Error("Invalid Credentials")
    }
}) 

// Admin login


const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password} = req.body
    //console.log(email, password)  
    //check if User exist or not
    const findAdmin = await User.findOne({email})
    if( findAdmin.role !== 'admin')
    throw new Error("Not Authorized") 
    if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
        
        const refreshToken = await generateRefreshToken(findAdmin?._id)  //add after,,for refreshtoken
        const updateAdmin = await User.findByIdAndUpdate(findAdmin.id, {
            refreshToken : refreshToken
        },
        {new:true}
        );

        res.cookie("refreshToken", refreshToken, {
            httpOnly : true,
            maxAge : 72 * 60 * 60 * 1000
        })  //cookie-parser
        res.json({
            _id: findAdmin?._id,
            firstname: findAdmin?.firstname,
            lastname: findAdmin?.lastname,
            email: findAdmin?.email,
            mobile: findAdmin?.mobile,
            token: generateToken(findAdmin?._id),
        });
    } else {
        throw new Error("Invalid Credentials")
    }
}) 


// handle refreshtOKEN

const handleRefreshToken = asyncHandler ( async( req, res) => {
    const cookie = req.cookies
    console.log(cookie)

    if(!cookie?.refreshToken) 
    throw new Error ( "there is no refreshToken in cookies.")

    const refreshToken = cookie.refreshToken
    console.log(refreshToken)

    const User = await User.findOne ( { refreshToken})
    if(!User)
    throw new Error( "not matched")
    //res.json(User)

    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || User.id !== decoded.id) {
            throw new Error ( "there is something wrong")
        }
       const accessToken = generateToken(User?._id) 
       res.json({accessToken})
    })
});

//Get all Users

const getallUsers = asyncHandler( async (req, res) =>{
    try {
        const getUsers = await User.find()
        res.json({getUsers})
    } catch (error) {
        throw new Error(error)
    }
});

//get a single User

const getUser = asyncHandler(async (req, res) => {
    //console.log(req.params)
    const {id} = req.params;
    //console.log(id)
    //validateMongodbId(id)
    try {
        const getUser = await User.findById(id)
        res.json({
        getUser,
        })
    } catch (error) {
        throw new Error(error)
    }

})

//delete a User

const deleteaUser = asyncHandler(async (req, res) => {
   // console.log(req.params)
    const {id} = req.params;
    //console.log(id)
    validateMongodbId(id)
    try {
        const deleteaUser = await User.findByIdAndDelete(id)
        res.json({
            deleteaUser
        })
    } catch (error) {
        throw new Error(error)
    }

})
// update a User

const updatedUser = asyncHandler(async( req, res) => {
    const { _id} = req.params
    //console.log()
    
    //validateMongodbId(_id)   //used for validate function
    try {
        const updatedUser = await User.findByIdAndUpdate(_id,
            {
                firstname : req?.body?.firstname,
                lastname: req?.body?.lastname,
                email: req?.body?.email,
                mobile: req?.body?.email
            },
            {new : true})
      res.json(updatedUser)
    } catch (error) {
        throw new Error(error)
   }
})

const blockUser = asyncHandler(async (req, res) => {
    const {id} = req.params
    validateMongodbId(id)
    try {
        const block = await  User.findByIdAndUpdate(
            id,
            {
                isBlocked : true,
            },
            {
                new : true,
            }
        );
        res.json({
            message: "User Blocked"
        });
    } catch (error) {
        throw new Error(error);
    }
});


const unblockUser = asyncHandler(async (req, res) => {
    const {id} = req.params
    validateMongodbId(id)
    try {
        const unblock =  await User.findByIdAndUpdate(
            id,
            {
                isBlocked : false,
            },
            {
                new : true,
            }
        );
        res.json({
            message: "User unBlocked"
        });
    } catch (error) {
        throw new Error(error);
    }
});

//log out functioning
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    
    if(!cookie?.refreshToken) 
    throw new Error ( "there is no refreshToken in cookies.")

    const refreshToken = cookie.refreshToken
    

    const User = await User.findOne ( { refreshToken})
    if (!User) {
        res.clearCookie("refreshToken" , {
            httpOnly :true,
            secure : true
        })
         res.sendStatus(204) //forbidden(No content)
    } 

    const filter = {refreshToken: refreshToken}
    await User.findOneAndUpdate ( filter, {refreshToken:""})
    res.clearCookie("refreshToken" , {
        httpOnly :true,
        secure : true
    })
    res.sendStatus(204) //forbidden(No content)
})

// update password

const updatePassword = asyncHandler( async ( req, res) => {
    const { id }  = req.User
    const { password } =req.body
    validateMongodbId(id)
    const User = await User.findById(id)
    if ( password ) {
        User.password = password
        const updatedPassword = await User.save()
        res.json(updatedPassword)
    } else {
        res.json(User)
    }
})

//forgot password

const forgotPasswordToken = asyncHandler(async (req, res) => {
    const {email} = req.body
    const user = await User.findOne( { email})
    if(!user) throw new Error("User not found with this email")
    try {
        const token = await user.createPasswordResetToken()
        await user.save()
        const resetURL = 'hi, please follow this link to reset ur password/ this link is valid till 10 mins from now. <a href="http://localhost:4000/api/User/reset-password/${token}">Click Here</>'
        const data = {
            to : email,
            text : "Hey User!",
            subject: "Forgot Password Link",
            htm : resetURL,
        }
        sendEmail(data)
        res.json(token)
    } catch (error) {
        throw new Error(error)
    }
})

//reset password

const resetPassword = asyncHandler( async (req, res) => {
    const { password } = req.body
    const { token } = req.params
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")
    const user = await User.findOne ( {
        passwordResetToken : hashedToken,
        passwordResetExpires : { $gt : Date.now()}
    })
    if (!user) throw new Error("Token Expired, Please try again later")
    user.password = password
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()
    res.json(user) 

})

// adding product to wishlist

/*const addToWishlist = asyncHandler(async( req, res) => {
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
//plz do comments for all update functtions then wishlist and ratings are running
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
})*/

//save address

const saveAdd = asyncHandler(async (req, res) => {
    const {_id} = req.user
    console.log()
    //validateMongodbId(_id)   //used for validate function
    try {
        const updatedUser = await User.findByIdAndUpdate(_id,
            {
                address : req?.body?.address,
               
            },
            {new : true})
      res.json(updatedUser)
    } catch (error) {
        throw new Error(error)
   }
})

// cart

const userCart = asyncHandler( async (req, res) => {
    //res.send("hello! from cart")
    const { cart } =  req.body
    const {_id} = req.user
    try {
        let products = []
        const user = await User.findOne(_id)
        //check if user already have product or not
        const alreadyExistCart = await Cart.findOne({orderby: User._id})
        if(alreadyExistCart) {
            alreadyExistCart.remove()
        }
        for( let i = 0; i<cart.length ; i++) {
            let object = {}
            object.product = cart[i]._id
            object.count = cart[i].count
            object.color = cart[i].color
            let getPrice = await Product.findById(cart[i]._id.select("price").exec())
            object.price = getPrice.price
            products.push(object)
        }
       
        let cartTotal = 0;
        for(let i = 0; i<products.length; i++) {
            cartTotal = cartTotal + products[i].price * products[i].count
        }
       // console.log(products , cartTotal)
       let newCart = await new Cart( {
        products,
        cartTotal,
        orderby : user?._id,
       }).save()
       res.json(newCart)
    } catch (error) {
        throw new Error(error)
    }

})

// get carts

const getUserCart = asyncHandler (async (req, res) => {
    const {_id} = req.user
    try {
        const cart = await Cart.findOne({ orderby : _id}).populate("products.product")
        res.json(cart)
    } catch (error) {
        throw new Error(error)
    }
})

// empty cart

const emptyCart = asyncHandler(async (req, res) => {
    const {_id} = req.user
    try {
        const user = req.user
        const cart = await Cart.findOneAndRemove({ orderby :user._id})
        res.json(cart)
    } catch (error) {
        throw new Error(error)
    }
})

// coupon

const applyCoupon =asyncHandler(async(req, res) => {
    const {coupon } = req.body
    const {_id} = req.user
    const validCoupon = await Coupon.findOne({name : coupon})
    if(validCoupon === null) {
        throw new Error("Invalid Coupon")
    }
    const user  = await User.findOne({_id})
    let {cartTotal} = await Cart.findOne({orderby : user._id}).populate("products.product")
    let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount)/100 ).toFixed(2)
    await Cart.findOneAndUpdate({orderby:user._id}, {totalAfterDiscount}, {new :  true})
    res.json(totalAfterDiscount)

})

// order

const createOrder = asyncHandler(async (req, res) => {
    const {COD, couponApplied} = req.body
    const {_id} = req.user
    try {
        if(!COD) throw new Error("Create Cash order failed")
        const user = await User.findById(_id)
    let userCart =  await Cart.findOne({orderby: user._id})
    let finalAmount = 0
    if(couponApplied && userCart.totalAfterDiscount) {
        finalAmount = userCart.totalAfterDiscount * 100
    }
    else {
        finalAmount = userCart.cartTotal * 100
    }
    let newOrder = await new Order({
        products:userCart.products,
        paymentIntent : {
            id : uniqid(),
            method : "COD",
            amount : finalAmount,
            status : "Cash on Delivery",
            created : Date.now() ,
            currency : "usd"
        },
        orderby : user._id,
        orderStatus : "Cash on Delivery"

    }).save()
    let update = userCart.products.map((item) => {
        return {
            updateOne : {
                filter : {id : item.product._id},
                update : {$inc : {quantity: -item.count, sold : +item.count}}
            }
        }
    })
    const updated = await Product.bulkWrite(update, {})
    res,json({message:"success"})
    } catch (error) {
        throw new Error(error)
    }
})

module.exports =  { 
    createUser , 
    loginUserCtrl, 
    getallUsers,
    getUser,
    deleteaUser,
    updatedUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logout,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    loginAdmin ,
    //addToWishlist,
    //rating,
    saveAdd,
    userCart,
    getUserCart,
    emptyCart,
    applyCoupon,
    createOrder
    
}
