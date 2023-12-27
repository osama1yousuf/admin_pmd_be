const Category = require("../models/category");

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const cloudinary = require("cloudinary");

// Create new genere   =>   /api/v1/admin/category/new
exports.newCategory = async (req, res) => {
  try {
    req.body.keys = JSON.parse(req.body.keys)
    const category = await Category.create(req.body);
    let keysList = [...category.keys , category._id] 
    const updateCategory = await Category.updateOne({_id : category._id} , {$set : {keys : keysList}})
  res.status(200).json({
    success: true,
    updateCategory,
  });
  } catch (error) {
    res.status(500).json({
      success: false,
      message :"server error"
    });
    console.log(error) 
  }
  
};

// Get all genres   =>   /api/v1/genres
exports.getCategory = catchAsyncErrors(async (req, res) => {
  const category = await Category.find();

  res.status(200).json({
    success: true,
    category,
  });
});

// Delete Category   =>   /api/v1/admin/category/:id
exports.deleteCategory = catchAsyncErrors(async (req, res, next) => {
  const category = await Category.findById(req.params.genreID);

  if (!category) {
    return next(new ErrorHandler("Product not found", 404));
  }

  await category.remove();

  res.status(200).json({
    success: true,
    message: "Product is deleted.",
  });
});


exports.getCategoryByLevel = async (req, res, next) => {
  let { level, parentId } = req.params;
  const categories = await Category.find({ level: level, parentId: parentId });

  res.status(200).json({
    success: true,
    record: { level, categories },
  });
};

exports.updateCategory = async (req, res) =>{
  try {
    let {Id} = req.params
    let {name} = req.body
    const updatedCategory = await Category.findOneAndUpdate(
      { _id: Id },
      { $set: { name: name } },
      { useFindAndModify: false, new: false } 
    );
    if (updatedCategory) {
      console.log('Document updated successfully:', updatedCategory);
    } else {
      console.log('No document found with the specified ID.');
    }
    res.status(200).json({
      success : true , 
      updatedCategory
    })
  } catch (error) {
     console.log(error);
     res.status(500).json({
      success : false,
      message  : 'server error'
     })
  }
}