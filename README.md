
# E-CoBuy

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
    git clone https://github.com/alin00r/Node.js-Full-E-Commerce-RESTFul-App-with-Payment
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
    DB_URI=YOUR_DATABASE_URI
    JWT_SECRET_KEY=YOUR_JWT_ACCESS_TOKEN_SECRET
    JWT_EXPIRE_TIME=YOUR_JWT_EXPIRE_TIME
    MAILER_APP_EMAIL=SENDER_EMAIL
    MAILER_APP_PASSWORD=SENDER_PASSWORD
    STRIPE_SECRET=YOUR_STRIPE_SECRET_KEY
    STRIPE_WEBHOOK_SECRET=YOUR_STRIPE_WEBHOOK_SECRET_KEY
    ```

### Routes

#### Auth Routes (`@access Public`)
- `POST /api/v1/signup`: Create Account
- `POST /api/v1/login`: Login
- `POST /api/v1/forgotPassword`: Request password reset code
- `POST /api/v1/verifyResetCode`: Verify reset code
- `PUT /api/v1/resetPassword`: Reset password

#### Categories Routes (`@access Admin`)
- `POST /api/v1/categories`: Create Category
- `GET /api/v1/categories`: Get All Categories
- `GET /api/v1/categories/:id`: Get Category by ID
- `PATCH /api/v1/categories/:id`: Update Category by ID
- `DELETE /api/v1/categories/:id`: Delete Category by ID

#### SubCategories Routes (`@access Admin`)
- `POST /api/v1/Subcategories`: Create SubCategory
- `GET /api/v1/Subcategories`: Get All SubCategories
- `GET /api/v1/Subcategories/:id`: Get SubCategory by ID
- `PATCH /api/v1/Subcategories/:id`: Update SubCategory by ID
- `DELETE /api/v1/Subcategories/:id`: Delete SubCategory by ID

#### Brands Routes (`@access Admin`)
- `POST /api/v1/brands`: Create Brand
- `GET /api/v1/brands`: Get All Brands
- `GET /api/v1/brands/:id`: Get Brand by ID
- `PATCH /api/v1/brands/:id`: Update Brand by ID
- `DELETE /api/v1/brands/:id`: Delete Brand by ID

#### Categories/Subs (`@access Admin`)
- `GET /api/v1/categories/:categoryId/subcategories`: Get Subcategories for a Category
- `POST /api/v1/categories/:categoryId/subcategories`: Create Subcategory in a Category

#### Products Routes (`@access Admin`)
- `POST /api/v1/products`: Create Product
- `GET /api/v1/products/:id`: Get Product by ID
- `PATCH /api/v1/products/:id`: Update Product by ID
- `DELETE /api/v1/products/:id`: Delete Product by ID

### Enums
- `Role`: Represents user roles (`USER`, `ADMIN`, `MANAGER`)

### Swagger Docs
