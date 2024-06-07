const mongoose = require('mongoose'); // Erase if already required
//(shortcut !mdbgum   :It creates schema for you)
// Declare the Schema of the Mongo model
const bcrypt = require('bcrypt')
const crypto = require('crypto')
var userSchema = new mongoose.Schema({
   
        _id: mongoose.Schema.Types.ObjectId,
      
     
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        
    },
    mobile:{
        type:Number,
        required:true,
        
    },
    password:{
        type:String,
        required:true,
    },
    role : {
        type: String,
        default: 'user',
    },
    isBlocked: {
        type: Boolean,
        default : false
    },
    cart : {
        type : Array,
        default : []
    },
    address : {
        type : String,
    },
    wishlist : [{ type: mongoose.Schema.Types.ObjectId, ref : "Product"}],
    refreshToken : {
        type: String,
    }
},

    {
        passwordChangeAt : Date,
        passwordResetToken : String,
        passwordResetExpires : Date,
    },
    
    {
        timestamps : true,
    }
);
ratings: [ 
    { 
   star : Number,
   comment : String,
   postedby :{type: mongoose.Schema.Types.ObjectId, ref : "User"}
},
];
/*wishlist: [
   {
     type: mongoose.Schema.Types.ObjectId, ref: "Product"
   }
]
,*/

userSchema.pre('save', async function (next){
    if(!this.isModified('password')) {
        next()
    }
    const salt = await bcrypt.genSaltSync(10)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.isPasswordMatched = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.createPasswordResetToken = async function () {
    const resetToken = crypto.randomBytes(32).toString("hex")
    this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')
    this.passwordResetExpires = Date.now() + 30 *60 * 1000  //10 mins
    return resetToken
}
//Export the model
module.exports = mongoose.model('User', userSchema);