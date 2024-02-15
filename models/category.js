const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: "string",
    required: true,
  },
  
  // level :{
  //   type : Number ,
  //   required : true,
  // },
  // parentId : {
  //   type : String,
  //   require : true,
  // },
  url : {
   type : String ,
   require : true
  },
  status :{
    type : Number,
    default : 1,
  }
  // keys : {
  //   type: Array,
  //   default: [],
  // }
});

module.exports = mongoose.model("category", categorySchema);
