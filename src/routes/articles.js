const express = require("express");
const router = express.Router();
const ArticleController = require("../controllers/Article");

router.use(function timeLog(req, res, next) {
  next();
});

router.get("/item/:cID/:id", ArticleController.GetItem); // id = article_id
router.post("/create/:id", ArticleController.Create); // id = categoryid  type = article_type (null/type)
router.post("/create/:id/:type", ArticleController.Create); // id = categoryid  type = article_type (null/type)
router.get("/list/:id", ArticleController.List); // id = category_id
router.patch("/update_priority/:id", ArticleController.UpdatePriority); // id = categoryid
router.patch("/update_priority/:id/:type", ArticleController.UpdatePriority); // id = categoryid || type = null/type
router.patch("/update/:id", ArticleController.UpdateItem); // id = article_id
router.delete("/remove/:id", ArticleController.Remove); // id = article_id
router.delete("/remove/:cID/:type", ArticleController.RemoveType);

router.get("/specs/:id", ArticleController.ListSpecification); // id = category_id
router.patch("/specs/:id", ArticleController.UpdateSpecificaiton); // id = category_id

module.exports = router;