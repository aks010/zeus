const express = require("express");
const router = express.Router();
const SpecificationController = require("../controllers/Specification");

router.use(function timeLog(req, res, next) {
  next();
});

router.get("/list/:id/:model", SpecificationController.ListSpecification);
router.patch("/update/:id/:model", SpecificationController.UpdateSpecificaiton);
router.get("/:model", SpecificationController.ViewSpecification);

module.exports = router;
