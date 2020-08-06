const express = require("express");
const router = express.Router();
const TestimonialController = require("../controllers/Testimonial");
const auth = require("../middleware/auth");
router.use(auth);

router.get("/item/:cID/:id", TestimonialController.GetItem); // id = article_id
router.post("/create/:id", TestimonialController.Create); // id = categoryid  type = article_type (null/type)
router.post("/create/:id/:type", TestimonialController.Create); // id = categoryid  type = article_type (null/type)
router.get("/list/:id", TestimonialController.List); // id = category_id
router.patch(
  "/update_model_priority/:EID/:id/:type",
  TestimonialController.UpdateModelPriority
); // id = categoryid
router.patch(
  "/update_model_priority/:EID/:id",
  TestimonialController.UpdateModelPriority
); // id = categoryid
router.patch("/update_priority/:id", TestimonialController.UpdatePriority); // id = categoryid
router.patch(
  "/update_priority/:id/:type",
  TestimonialController.UpdatePriority
); // id = categoryid || type = null/type
router.patch("/update/:id", TestimonialController.UpdateItem); // id = article_id
router.delete("/remove/:id", TestimonialController.Remove); // id = article_id
router.delete("/remove/:cID/:type", TestimonialController.RemoveType);

module.exports = router;
