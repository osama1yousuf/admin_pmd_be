const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  name: {
    type: "string",
    required: true,
  },
  category: {
    type: String,
    required : false
  },
  metaTittle: {
    type: "string",
    required : false
  },
  categoryIdList : {
    type : Array,
    required : false
  },
  slug: {
    type: "string",
    required : false
  },
  metaDescription: {
    type: "string",
    required : false
  },
  image: {
    public_id: {
      type: String,
      // required: true,s
    },
    url: {
      type: String,
      // required: true,
    },
  },
  mainContent: {
    type: "string",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  status: {
    type : Number ,
    default : 1
  },
});

module.exports = mongoose.model("blog", blogSchema);
