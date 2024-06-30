
# E-CoBuy ( say hi and buy ) ©

## Node.js Full E-Commerce RESTful API

### Technologies
- JavaScript, NodeJS, Express.js, JWT, Nodemon, NPM
- MongoDB, Mongoose, Stripe, dotenv, Swagger, eslint, prettier

### Key Features
- User Authentication with JWT tokens
- Category, Subcategory, Brand, and Product Management
- User, Review, Wishlist, Address, Coupon, and Shopping Cart Management
- Order Processing and Payment Integration
- API Documentation with Swagger UI
- Middleware Mounting and Scalability

### Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/MostafaMohamed2001/ecomercee_
    ```
2. Initialize package.json (if not present):
    ```bash
    npm init
    # or
    yarn init
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Set up environment variables:
    ```env
    PORT=YOUR_PORT_HERE
    NODE_ENV=YOUR_ENVIROMENT
    DB_URI=YOUR_DATABASE_URI
    JWT_SECRET_KEY=YOUR_JWT_ACCESS_TOKEN_SECRET
    JWT_EXPIRE=YOUR_JWT_EXPIRE_TIME
    EMAIL_HOST=YOUR_HOST_IN_EMAIL_PROVIDER
    EMAIL_PORT=YOUR_HOST_IN_EMAIL_PROVIDER
    EMAIL_USER=YOUR_EMAIL_IN_EMAIL_PROVIDER
    EMAIL_PASSWORD=YOUR_PASSWORD_IN_EMAIL_PROVIDER


    STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET_KEY
    STRIPE_WEBHOOK_SECERT=YOUR_STRIPE_WEBHOOK_SECRET_KEY
    ``` 

### Routes

#### Auth Routes 
- `POST /api/v1/signup`: Create Account
- `POST /api/v1/login`: Login
- `POST /api/v1/forgotPassword`: Request password reset code
- `POST /api/v1/verifyResetCode`: Verify reset code
- `PUT /api/v1/resetPassword`: Reset password

#### Categories Routes 
- `POST /api/v1/categories`: Create Category
- `GET /api/v1/categories`: Get All Categories
- `GET /api/v1/categories/:id`: Get Category by ID
- `PUT /api/v1/categories/:id`: Update Category by ID
- `DELETE /api/v1/categories/:id`: Delete Category by ID

#### SubCategories Routes 
- `POST /api/v1/Subcategories`: Create SubCategory
- `GET /api/v1/Subcategories`: Get All SubCategories
- `GET /api/v1/Subcategories/:id`: Get SubCategory by ID
- `PUT /api/v1/Subcategories/:id`: Update SubCategory by ID
- `DELETE /api/v1/Subcategories/:id`: Delete SubCategory by ID

#### Brands Routes 
- `POST /api/v1/brands`: Create Brand
- `GET /api/v1/brands`: Get All Brands
- `GET /api/v1/brands/:id`: Get Brand by ID
- `PUT /api/v1/brands/:id`: Update Brand by ID
- `DELETE /api/v1/brands/:id`: Delete Brand by ID

#### Categories/Subs 
- `GET /api/v1/categories/:categoryId/subcategories`: Get Subcategories for a Category
- `POST /api/v1/categories/:categoryId/subcategories`: Create Subcategory in a Category

#### Products Routes 
- `GET /api/v1/products`: Get Products
- `POST /api/v1/products`: Create Product
- `GET /api/v1/products/:id`: Get Product by ID
- `PUT /api/v1/products/:id`: Update Product by ID
- `DELETE /api/v1/products/:id`: Delete Product by ID

#### Reviews Routes 
- `GET /api/v1/reviews`: Get Reviews
- `POST /api/v1/reviews`: Create Review
- `GET /api/v1/reviews/:id`: Get Review by ID
- `PUT /api/v1/reviews/:id`: Update Review by ID
- `DELETE /api/v1/reviews/:id`: Delete Review by ID

#### Products/Reviews 
- `GET /api/v1/products/:ProductId/reviews`: Get Reviews for a Product
- `POST /api/v1/categories/:ProductId/reviews`: Create Reviews in a Product

#### Wishlists Routes 
- `POST /api/v1/wishlist`: Add Product To Wishlist
- `DELETE /api/wishlist/:id`: Remove Product From Wishlist
- `GET /api/v1/wishlist`: Get Logged User Wishlist 

#### Address Routes 
- `POST /api/v1/address`: Add Address To User
- `DELETE /api/address/:id`: Remove Address From User
- `GET /api/v1/address`: Get Logged User Addresses 

#### Reviews Coupons 
- `GET /api/v1/coupons`: Get Coupons
- `POST /api/v1/coupons`: Create Coupon
- `GET /api/v1/coupons/:id`: Get Coupon by ID
- `PUT /api/v1/coupons/:id`: Update Coupon by ID
- `DELETE /api/v1/coupons/:id`: Delete Coupon by ID

#### Coupons Coupons 
- `POST /api/v1/cart`: Add Product To Cart
- `GET /api/v1/cart`: Get Logged User Cart
- `DELETE /api/v1/cart/:id`: Delete Item From Cart
- `PUT /api/v1/cart/:id`: Update Cart Item Quantity
- `DELETE /api/v1/cart`: Clear All Cart Items
- `PUT /api/v1/cart/applyCoupon`: Apply Coupon

### Enums
- `Role`: Represents user roles (`USER`, `ADMIN`, `MANAGER`)

### Swagger Docs
` Waiting for documentation 🔥`
