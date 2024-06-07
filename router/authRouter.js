const express = require('express')
const { 
    createUser, 
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
    loginAdmin,
    addToWishlist,
    rating,
    saveAdd,
    userCart,
    getUserCart,
    emptyCart,
    applyCoupon,
    createOrder
} = require('../controller/userctrl');

//const authMiddleware = require('../middleware/authMiddleware');
const {isAdmin, authMiddleware} = require('../middleware/authMiddleware');

const router = express.Router()

router.post('/register', createUser);

router.post('/forgot-password-token' , forgotPasswordToken)

router.put('/reset-password/:token' , resetPassword)

router.post('/login', loginUserCtrl);

router.post('/login-Admin', loginAdmin);

router.post('/' , userCart)

router.post('/cart/applyCoupon' ,applyCoupon)

router.post('/cart/cash-order' , createOrder)

router.put('/refresh', handleRefreshToken)

router.get('/', getUserCart);

router.get('/:id', authMiddleware, isAdmin, getUser)

router.get('/all-users', getallUsers);

router.get('/cart' , getUserCart)

router.put('/logout' , logout)

router.delete('/:id', deleteaUser)

router.delete('/cart' , emptyCart)

router.put('/:id',  updatedUser)

router.put('/edit-user', authMiddleware, updatedUser)

router.put('/block-user/:id', authMiddleware,isAdmin,  blockUser)

router.put('/unblock-user/:id', authMiddleware, unblockUser)

router.put('/password' , authMiddleware,  updatePassword)

router.put('/add', authMiddleware,  saveAdd)

//router.put('/wishlist' , authMiddleware, addToWishlist)

//router.put('/ratings' , authMiddleware, rating)




module.exports = router;
