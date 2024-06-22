const categoryRoute = require('./categoruRoute.js');
const subCategoryRoute = require('./subCategoryRoute.js');
const BrandRoute = require('./brandRoute.js');
const ProductRoute = require('./productRoute.js');
const UserRoute = require('./userRoute.js')
const AuthRoute = require('./authRoute.js')
const reviewRoute = require('./reviewRoute.js')
const wishlistRoute = require('./wishlistRoute.js')
const addressRoute = require('./addressRoute.js')
const couponRoute = require('./couponRoute.js')
const cartRoute = require('./cartRoute.js')
const orderRoute = require('./orderRoute.js')

//Mount routes


const mountRoutes = (app) => {
app.use('/api/v1/categories' ,categoryRoute)
app.use('/api/v1/subcategories' ,subCategoryRoute)
app.use('/api/v1/brands' ,BrandRoute)
app.use('/api/v1/products' ,ProductRoute)
app.use('/api/v1/users' ,UserRoute)
app.use('/api/v1/auth' ,AuthRoute)
app.use('/api/v1/reviews' ,reviewRoute)
app.use('/api/v1/wishlist' ,wishlistRoute)
app.use('/api/v1/address' ,addressRoute)
app.use('/api/v1/coupons' ,couponRoute)
app.use('/api/v1/cart' ,cartRoute)
app.use('/api/v1/orders' ,orderRoute)
}
module.exports = mountRoutes;