const blog = require("../models/blog");
const cloudinary = require("cloudinary");
exports.newBlog = async (req, res) => {
  try {
    let imageLinkBanner;
    if (req.body.bannerImage) {
      const blogImage = await cloudinary.v2.uploader.upload(
        req.body.bannerImage,
        {
          folder: "blog",
        }
      );
      imageLinkBanner = {
        public_id: blogImage.public_id,
        url: blogImage.secure_url,
      };
      req.body.bannerImage = imageLinkBanner;
    }

    let imageLinkInner;
    if (req.body.innerImage) {
      const blogImage = await cloudinary.v2.uploader.upload(
        req.body.innerImage,
        {
          folder: "blog",
        }
      );
      imageLinkInner = {
        public_id: blogImage.public_id,
        url: blogImage.secure_url,
      };
      req.body.innerImage = imageLinkInner;
    }
    const blogCreate = await blog.create(req.body);
    res.status(200).json({
      success: true,
      blogCreate,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};

exports.getBlog = async (req, res) => {
  try {
    let blogs = await blog.find({ status: 1 }).populate("user");
    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({
      success: false,
      message: "server error",
    });
  }
};
exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    let blogs = await blog.findById({ _id: id }).populate("user");
    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({
      success: false,
      message: "server error",
    });
  }
};
exports.getBlogByslug = async (req, res) => {
  try {
    const { slug } = req.params;
    let blogs = await blog.find({ slug: slug }).populate("user");
    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({
      success: false,
      message: "server error",
    });
  }
};
exports.getBlogByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    let blogs = await blog
      .find({ categoryIdList: { $in: [id] } })
      .populate("user");
    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({
      success: false,
      message: "server error",
    });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    let { id } = req.params;
    let softDelete = await blog.updateOne({ _id: id }, { $set: { status: 0 } });
    res.status(200).json({
      success: true,
      message: "Blog Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};
exports.editBlog = async (req, res) => {
  try {
    let { id } = req.params;
    let blogFind = await blog.findById(id);
    console.log(req.body);
    if (!blogFind) {
      res.status(404).json({
        success: false,
        message: "Blog not found",
      });
      return;
    }
    // console.log("req.body?.categoryIdList" , req.body?.categoryIdList  === "undefined")
    // if (req.body?.categoryIdList !== undefined && req.body?.categoryIdList !== "undefined") {
    //   try {
    //     req.body.categoryIdList = JSON.parse(req.body.categoryIdList);
    //   } catch (error) {
    //     console.log('Error parsing JSON:', error);
    //   }
    // } else {
    //   req.body.categoryIdList = [];
    // }
    let imageLinkBanner;
    if (req.body.bannerImage) {
      const blogImage = await cloudinary.v2.uploader.upload(
        req.body.bannerImage,
        {
          folder: "blog",
        }
      );
      imageLinkBanner = {
        public_id: blogImage.public_id,
        url: blogImage.secure_url,
      };
      req.body.bannerImage = imageLinkBanner;
    }

    let imageLinkInner;
    if (req.body.innerImage) {
      const blogImage = await cloudinary.v2.uploader.upload(
        req.body.innerImage,
        {
          folder: "blog",
        }
      );
      imageLinkInner = {
        public_id: blogImage.public_id,
        url: blogImage.secure_url,
      };
      req.body.innerImage = imageLinkInner;
    }

    product = await blog.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({
      success: false,
      message: "server error",
    });
  }
};
