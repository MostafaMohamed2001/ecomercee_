const slugify = require("slugify");
const asyncHandler = require("express-async-handler");

const ApiError = require("./../utils/apiError");
const ApiFeatures = require("./../utils/apiFeatures");



exports.getAll = (Model)=>  asyncHandler(async (req, res, next) => {
  let filter = {};
  if (req.filterObj) {
    filter = req.filterObj;
    }
  const documnetCout = await Model.countDocuments();
  const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
    .filter()
    .pagination(documnetCout)
    .search()
    .limitFields()
    .sort();
  const { mongooseQuery, pagination } = apiFeatures;
  
  const documents = await mongooseQuery; 

  
  res.status(200).json({
    result: documents.length,
    pagination,
    data: documents,
  });
});

exports.createOne = (Model)=> asyncHandler(async (req, res, next) => {
 console.log("hello")
  const newDoc = await Model.create(req.body);
  
  delete newDoc._doc.password;
  res.status(201).json({
    data: newDoc,
  });
});



exports.getOne = (Model , populationOption)=>asyncHandler(async (req, res, next) => {
  
  const { id } = req.params;
  // false;
  let query = Model.findById(id);
  if (populationOption) {
   query = query.populate(populationOption)
  }

  const document = await query;
  if (!document) {
    return next(new ApiError(`No document found with this id => ${id}`, 404));  
  }
  delete document._doc.password;
  res.status(200).json({
    data: document,
  });
});

exports.updateOne = (Model)=>asyncHandler(async (req, res, next) => {
  const document = await Model.findByIdAndUpdate(
    {_id:req.params.id},
    req.body,
    { new: true }
  );
  if (!document) {
    return next(new ApiError(`No document found with this id => ${ req.params.id}`, 404));  
  }
  // Trigger "save" event when update document
  document.save();
  res.status(200).json({
    data: document,
  });
});
  



exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }

    // Trigger "remove" event when update document
    await document.remove();
    res.status(204).send();
  });
 

exports.deleteAll = (Model) =>asyncHandler(async(req, res) => {
  await Model.deleteMany();
  res.status(200).send();
});
 