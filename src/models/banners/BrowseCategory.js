const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const BrowseCategoryItem = require("./BrowseCategoryItem");
const BrowseCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    link: String,
    priority: Number,
  },
  {
    timestamps: true,
  }
);

BrowseCategorySchema.statics.sendData = async () => {
  try {
    const cn = await BrowseCategory.find({}, ["title", "link", "priority"], {
      sort: { priority: 1 },
    });

    let listData = [];
    for (const o of cn) {
      const items = await BrowseCategoryItem.find(
        { categoryID: o["_id"] },
        ["title", "imgLink", "link", "category", "priority"],
        { sort: { priority: 1 } }
      );
      // console.log(o);
      let obj = {};
      obj.items = items;
      obj.cID = o["_id"];
      obj.link = o["link"];
      obj.priority = o["priority"];
      obj.title = o["title"];
      listData.push(obj);
    }
    return listData;
  } catch (e) {
    console.log(e.message);
    return { message: e.message, code: e.code };
  }
};

BrowseCategorySchema.pre("remove", async function (next) {
  const category = this;
  await BrowseCategoryItem.deleteMany({ categoryID: category._id });
  next();
});

autoIncrement.initialize(mongoose.connection);
BrowseCategorySchema.plugin(autoIncrement.plugin, "BrowseCategory");

var BrowseCategory = mongoose.model("BrowseCategory", BrowseCategorySchema);
module.exports = BrowseCategory;
