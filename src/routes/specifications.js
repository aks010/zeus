const express = require("express");
const router = express.Router();
const SpecificationController = require("../controllers/Specification");

const auth = require("../middleware/auth");
router.use(auth);

router.get("/list/:id/:model", SpecificationController.ListSpecification);
router.patch("/update/:id/:model", SpecificationController.UpdateSpecificaiton);
router.get("/:model", SpecificationController.ViewSpecification);

module.exports = router;
