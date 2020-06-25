const express = require("express");
const router = express.Router();
const CustomController = require("../controllers/Custom");

router.use(function timeLog(req, res, next) {
  next();
});

router.get("/item/:cID/:id", CustomController.GetItem); // id = article_id
router.post("/create/:id", CustomController.Create); // id = categoryid  type = article_type (null/type)
router.post("/create/:id/:type", CustomController.Create); // id = categoryid  type = article_type (null/type)
router.get("/list/:id", CustomController.List); // id = category_id
router.patch("/update_priority/:id", CustomController.UpdatePriority); // id = categoryid
router.patch("/update_priority/:id/:type", CustomController.UpdatePriority); // id = categoryid || type = null/type
router.patch("/update/:id", CustomController.UpdateItem); // id = article_id
router.delete("/remove/:id", CustomController.Remove); // id = article_id
router.delete("/remove/:cID/:type", CustomController.RemoveType);

router.get("/specs/:id", CustomController.ListSpecification); // id = category_id
router.patch("/specs/:id", CustomController.UpdateSpecificaiton); // id = category_id

module.exports = router;