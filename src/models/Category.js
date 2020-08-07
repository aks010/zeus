const mongoose = require("mongoose");
const Utils = require("../shared/utils/helper");
const Spec = require("../models/Type/Spec");

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
    eID: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    priority: Number,
  },
  {
    timestamps: true,
  }
);

CategorySchema.statics.sendData = async (eID) => {
  try {
    const categoryList = await Category.find(
      { eID },
      ["childModel", "title", "priority", "link"],
      { sort: { priority: 1 } }
    );
    let res = [];

    for (const o of categoryList) {
      let { error, data } = await Utils.getDataFromModel(
        o["childModel"],
        o["_id"]
      ); /// TEST FOR ERROR THROW FROM FUNCTION
      if (error != null) throw new Error(error);
      let obj = {};
      obj.items = data; // array
      obj.categoryID = o["_id"];
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
    await Spec.deleteOne({ eID: category._id });
    if (!error) return next();
    else throw new Error(error);
  } catch (e) {
    console.log("Middleware Error!");
    /// todo: EXECUTE ERROR OR MESSAGE
    throw new Error(e.message);
  }
});

CategorySchema.statics.removeDataFromCategories = async (ID) => {
  /// ID = bannerID
  console.log("asfasf");
  try {
    const categoryList = await Category.find({ eID: ID }, ["childModel"]);

    for (const o of categoryList) {
      await o.remove();
    }

    await Spec.deleteOne({ eID: ID });

    return { error: null, message: "Successfully Removed Category!" };
  } catch (e) {
    console.log(e);
    return { error: e.message, message: null };
  }
};

// autoIncrement.initialize(mongoose.connection);
// CategorySchema.plugin(autoIncrement.plugin, "Category");

var Category = mongoose.model("Category", CategorySchema);
module.exports = Category;
