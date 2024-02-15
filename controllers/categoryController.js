const Category = require("../models/category");

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const cloudinary = require("cloudinary");

// Create new genere   =>   /api/v1/admin/category/new
exports.newCategory = async (req, res) => {
  try {
    const {name , url} = req.body
    if(!name || !url) {
      return res.status(400).json({
        success: false,
        message: "Please provide name and url"
      })
    }
    console.log(req.body)
      const category  = await Category.create(req.body)
      return res.status(200).json({
        success: true,
        category
      })
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "server error"
    })
  }
  // try {
  //   req.body.keys = JSON.parse(req.body.keys)
  //   const category = await Category.create(req.body);
  //   let keysList = [...category.keys , category._id] 
  //   const updateCategory = await Category.updateOne({_id : category._id} , {$set : {keys : keysList}})
  // res.status(200).json({
  //   success: true,
  //   updateCategory,
  // });
  // } catch (error) {
  //   res.status(500).json({
  //     success: false,
  //     message :"server error"
  //   });
  //   console.log(error) 
  // }
  
};

// Get all genres   =>   /api/v1/genres
exports.getCategory = catchAsyncErrors(async (req, res) => {
  const category = await Category.find({status : 1});

  res.status(200).json({
    success: true,
    category,
  });
});

// Delete Category   =>   /api/v1/admin/category/:id
exports.deleteCategory = async (req, res, next) => {
  try {
    let {id} = req.params;
    console.log(id)
    const category = await Category.findById(id);
    console.log(category)
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }
   
   category.status = 0;
   await category.save();
  
    res.status(200).json({
      success: true,
      message: "Category delete successfully",
    });
    
  } catch (error) {
    res.status(500).json({ 
      success : false,
      message  :'server error'
    })
  }
};


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
    let {name , url} = req.body
    const updatedCategory = await Category.findOneAndUpdate(
      { _id: Id },
      { $set: { name: name  , url : url} },
      { useFindAndModify: false, new: true } 
    );

    
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