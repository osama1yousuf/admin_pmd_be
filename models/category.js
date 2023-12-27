const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: "string",
    required: true,
  },
  
  level :{
    type : Number ,
    required : true,
  },
  parentId : {
    type : String,
    require : true,
  },
  url : {
   type : String ,
   require : true
  },
  keys : {
    type: Array,
    default: [],
  }
});

module.exports = mongoose.model("category", categorySchema);
