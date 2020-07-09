const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const Spec = require("./Spec");

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
    eventDate: {
      type: Date,
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      lowercase: true,
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

ArticleSchema.statics.sendData = async (eID) => {
  /// UPDATE THIS USING SPECIFICATION
  try {
    let cn = await Spec.findOne({ eID }, ["-createdAt", "-updatedAt"], {
      lean: true,
    });
    if (!cn) throw new Error("Category Specification not found!!");
    let resSpecs = [];
    for (const [key, value] of Object.entries(cn)) {
      if (value === true) resSpecs.push(key);
    }

    const cns = await Article.find({ eID }, resSpecs, {
      sort: { priority: 1 },
    });
    let data;
    if (cn["type"] == true) {
      data = {};
      for (const o of cns) {
        if (!data[o["type"]]) {
          data[o["type"]] = [];
        }
        data[o["type"]].push(o);
      }
    } else {
      data = [];
      for (const o of cns) {
        data.push(o);
      }
    }
    return data;
  } catch (e) {
    console.log("Article Statics Error");
    throw new Error(e.message);
  }
};

ArticleSchema.pre("remove", async function (next) {
  const cn = this;
  try {
    let cns;
    const specs = await Spec.findOne({ eID: cn["eID"] }, ["type"], {
      lean: true,
    });
    console.log(specs);

    if (specs["type"] == true) {
      cns = await Article.find({
        eID: cn.eID,
        type: cn.type,
        priority: { $gte: cn.priority },
      });
    } else {
      cns = await Article.find({
        eID: cn.eID,
        priority: { $gte: cn.priority },
      });
    }
    for (const o of cns) {
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
