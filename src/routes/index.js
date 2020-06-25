const express = require("express");
const router = express.Router();

router.use("/banners", require("./banners"));
router.use("/microservices", require("./microservice"));
router.use("/counters", require("./counter"));
router.use("/buyselltools", require("./buySellTool"));
router.use("/browsecategory", require("./browseCategory"));
router.use("/browsecategoryitem", require("./browseCategoryItem"));
router.use("/articles", require("./articles"));
router.use("/category", require("./category"));

module.exports = router;
