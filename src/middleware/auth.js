const jwt = require("jsonwebtoken");
const Users = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY || "MakeItHappen"
    );
    // console.log("PRINT");
    // console.log(token);
    const user = await Users.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
    res.status(401).send({ error: "Please authorize!" });
  }
};

module.exports = auth;
