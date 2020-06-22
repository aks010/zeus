const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const getDataFromModel = require("../shared/utils/helper");
const Utils = require("../shared/utils/helper");

const CategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide category title!"],
    },
    link: String,
    childModel: {
      type: String,
      required: true,
    },
    bannerID: {
      type: Number,
      required: true,
    },
    priority: Number,
  },
  {
    timestamps: true,
  }
);

CategorySchema.statics.sendData = async (bannerID) => {
  try {
    const categoryList = await Category.find({ bannerID }, [
      "childModel",
      "title",
    ]);
    let res = [];

    for (const o of categoryList) {
      let { error, data } = await getDataFromModel(o["childModel"], o["_id"]); /// TEST FOR ERROR THROW FROM FUNCTION
      if (error != null) throw new Error(error);
      let obj = {};
      obj.items = data; // array
      obj.cID = o["_id"];
      obj.link = o["link"];
      obj.title = o["title"];
      obj.priority = o["priority"];
      res.push(obj);
    }
    return res;
  } catch (e) {
    console.log(e);
    return { message: e.message, status: 500 };
  }
};

/// CASCADE DELETE

CategorySchema.pre("remove", async function (next) {
  const category = this;
  try {
    const { error, message } = await Utils.removeDataFromModel(
      category.childModel,
      category._id
    );
    if (!error) return next();
    else throw new Error(error);
  } catch (e) {
    console.log("Middleware Error!");
    /// todo: EXECUTE ERROR OR MESSAGE
    throw new Error(e.message);
  }
});

autoIncrement.initialize(mongoose.connection);
CategorySchema.plugin(autoIncrement.plugin, "Category");

var Category = mongoose.model("Category", CategorySchema);
module.exports = Category;
