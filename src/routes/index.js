const express = require("express");
const router = express.Router();

router.use("/banners", require("./banners"));
router.use("/microservices", require("./microservice"));
router.use("/counters", require("./counter"));

module.exports = router;
