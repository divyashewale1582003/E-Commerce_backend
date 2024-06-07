const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var ProductSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim : true
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase: true
    },
    description :{
        type:String,
        required:true,
     
    },
    price:{
        type:Number,
        required:true,
    },
    category : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Category"
    },
    brand : {
       type : String,
    //enum: ['Apple', 'Samsung', 'Lenovo']
        required: true

        
    },

    quantity : {
       /* type: Number,          ..it is not needed for filtering deleteion etc
        required: true*/

        type : String,
        required:true
    },
    sold : {
        type: Number,
        default: 0,
        select : false  //from this user site can't see the sold of  a  product
    },
    images : [],
    /*images : {
        type : Array
    },*/
    color : {
        type : String,
        //enum: ['Black', 'Brown', 'Red']
        required: true
    },
    ratings: [ 
         { 
        star : Number,
        comment : String,
        postedby :{type: mongoose.Schema.Types.ObjectId, ref : "User"}
    },
],
    wishlist: [
        {
            prodId : String
        }
    ]
    ,
    totalrating: {
        type: Number,  
        default: 0,    
    },
    
    },
   
    {
        timestamps : true,
    },
    
);

//Export the model
module.exports = mongoose.model('Product', ProductSchema);