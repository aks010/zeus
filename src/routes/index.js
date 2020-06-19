const express = require("express");
const router = express.Router();

router.use("/banners", require("./banners"));
router.use("/microservices", require("./microservice"));

module.exports = router;
