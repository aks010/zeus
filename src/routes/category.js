const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/Category");

router.use(function timeLog(req, res, next) {
  next();
});

router.get("/read/:id", CategoryController.ReadCategory);
router.get("/list/:id", CategoryController.ListCategories); // id = banner_id
router.get("/items/:id", CategoryController.ListCategoryItems); // id = category_id
router.get("/listAll/:id", CategoryController.ListAll); // id = banner_id
router.patch(
  "/update_category_priority/:BID/:CID",
  CategoryController.UpdateCategoryPriority
); // id = banner_id
router.patch("/update_priority/:id", CategoryController.UpdatePriority); // id = banner_id
router.patch("/update/:id", CategoryController.UpdateCategory); // id = category_id
router.post("/create/:id", CategoryController.CreateCategory); // id = banner_id
router.delete("/remove/:id", CategoryController.RemoveCategory); // id = category_id

module.exports = router;
