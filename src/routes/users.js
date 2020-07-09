const express = require("express");
const router = express.Router();
const UserController = require("../controllers/Users");
const auth = require("../middleware/auth");

router.post("/", UserController.Register);
router.post("/login", UserController.Login);
router.get("/logout", auth, UserController.Logout);
router.post("/logoutAll", auth, UserController.LogoutAll);
router.get("/me", auth, UserController.Profile);
router.patch("/me", auth, UserController.UpdateProfile);
router.delete("/me", auth, UserController.DeleteUser);

module.exports = router;
