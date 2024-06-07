const express = require('express')

const dbConnect = require('./config/db');
const app = express()
const dotenv = require('dotenv').config()

const bodyParser = require("body-parser")
require('dotenv').config();

const authRouter = require('./router/authRouter');
const productRouter = require('./router/productRouter')
const blogRouter = require('./router/blogRouter')
const prodcategoryRouter = require('./router/prodcategoryRoute')
const blogcategoryRouter = require('./router/blogCatRoute')
const brandRouter = require('./router/brandRoute')
const couponRouter = require('./router/couponRoute')
const { notFound ,errorHandler} = require('./middleware/errorHandler');
const port = process.env.PORT || 6000;

const cookieParser = require('cookie-parser');
const morgan = require('morgan')        //used for logging HTTP requests. It helps you keep track of details like request method, status code, response time, 

dbConnect()

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : false}))
app.use(cookieParser())


app.get("/", (req, res) => {
    res.send("<h1><marquee>Hello from server side<marquee><h1>")
});

app.use('/api/user', authRouter)
app.use('/api/product', productRouter)
app.use('/api/blog' , blogRouter)
app.use('/api/category', prodcategoryRouter )
app.use('/api/blogCategory' , blogcategoryRouter)
app.use('/api/brand' , brandRouter)
app.use('/api/coupon' ,couponRouter)

app.use(notFound);
app.use(errorHandler );

app.listen(port, () => {
    console.log(`Server is running at port: ${port}`)
});

