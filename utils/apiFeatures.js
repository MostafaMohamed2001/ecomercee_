class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }
  filter() {
    //Filtring
  const qeurySrtingObj = { ...this.queryString };
  const excludeFields = ['limit', 'sort', 'page', 'fields'];
  excludeFields.forEach(val => delete qeurySrtingObj[val]);
  // console.log(req.query)
  // console.log(qeurySrtingObj);

  // Apply Filter [gte , gt , lte lt]
  //{ price:$gte{50} , ratingsAverage:{$gte:4.3}}
  // {  price: { lt: '109.95' },ratingsAverage: { gte: '4.3' } }
  
  let querySrt = JSON.stringify(qeurySrtingObj);
  querySrt = querySrt.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  // console.log(qeurySrtingObj);
  // console.log(querySrt)
    // console.log(JSON.parse(querySrt));
    
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(querySrt));
    return this;
  }

  sort() {
        //Sorting
  if (this.queryString.sort) {
    // console.log(req.query.sort)
    const sortBy = this.queryString.sort.split(",").join(" ");
    // console.log(sortBy)
      this.mongooseQuery=this.mongooseQuery.sort(sortBy)
  } else {
    this.mongooseQuery = this.mongooseQuery.sort('-createdAt');
  }
    return this;
  }

  limitFields() {
     // Fields limiting
  if (this.queryString.fields) {
    let fields = this.queryString.fields.split(',').join(' ');
    const edit = fields.replace(/password/gi,null)
    fields = edit;
    this.mongooseQuery = this.mongooseQuery.select(fields);
  } else {
    this.mongooseQuery = this.mongooseQuery.select("-__v -password");
  }
    return this;
  }
  search() {
    //search 
  if (this.queryString.keyword) { 
    const query = {};
    query.$or = [
      {
        title: { $regex: this.queryString.keyword, $options: 'i' },
      },
      {
        description: { $regex: this.queryString.keyword, $options: 'i' },
      },

    ]
    this.mongooseQuery = this.mongooseQuery.find(query);
  }
    return this;
  }
  pagination(coutDocumnts) {
    const page = this.queryString.page * 1 || 1;
    const limit =  this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit; // (3-1)*5 = 10 skip for 10 doc
    const endIndx = page * limit; // 2 * 10 last index in this page

    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(coutDocumnts / limit); // 30 doc 10 limit = 3 page

    if (endIndx > coutDocumnts) {
      pagination.next = page + 1;
    }
    if (skip > 0) {
      pagination.prev = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.pagination = pagination;
    return this;
  
  }
};
module.exports = ApiFeatures;