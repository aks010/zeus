const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imgLink: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
    },
    rating: {
      type: Number,
    },
    publishDate: {
      type: Date,
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      //   enum: ["car", "scooter", "bike"]
      lowercase: true,
    },
    categoryID: {
      type: String,
      //   enum: ["news", "expertReview"],
      required: true,
    },
    priority: Number,
  },
  {
    timestamps: true,
  }
);

ArticleSchema.statics.sendData = async (categoryID) => {
  try {
    const cn = await Article.find(
      { categoryID },
      [
        "_id",
        "title",
        "imgLink",
        "link",
        "caption",
        "type",
        "publishDate",
        "priority",
        "price",
        "rating",
      ],
      { sort: { priority: 1 } }
    );

    let rs = [];
    if (
      cn.length() != 0 &&
      (cn[0].price === null || cn[0].price === undefined) // banner != news...
    ) {
      for (const o of cn) {
        rs[o["type"]].push({
          _id: o["_id"],
          title: o["title"],
          imgLink: o["imgLink"],
          link: o["link"],
          caption: o["caption"],
          type: o["type"],
          publishDate: o["publishDate"],
          priority: o["priority"],
        });
      }
    } else {
      for (const o of cn) {
        rs[o["type"]].push(o);
      }
    }

    return rs;
  } catch (e) {
    console.log("Article Statics Error!");
    throw new Error(e.message);
  }
};

ArticleSchema.pre("remove", async (next) => {
  const article = this;
  try {
    const cn = await Article.find(
      {
        categoryID: article["categoryID"],
        priority: { $gte: article.priority },
        type: article.type,
      },
      ["_id", "priority"]
    );
    for (const o of cn) {
      await Article.updateOne({ _id: o._id }, { priority: o.priority - 1 });
    }
    return next();
  } catch (e) {
    console.log("Middleware Error!");
    throw new Error(e.message);
  }
});

autoIncrement.initialize(mongoose.connection);
ArticleSchema.plugin(autoIncrement.plugin, "Article");

var Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;
