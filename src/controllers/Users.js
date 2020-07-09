const User = require("../models/User");

const Register = async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
};

const Login = async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
};

const Logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

const LogoutAll = async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
};

const Profile = async (req, res) => {
  res.send(req.user);
};

const UpdateProfile = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "age", "password"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    res.status(400).send();
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    req.user.save();

    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
};

const DeleteUser = async (req, res) => {
  try {
    const user = req.user;
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
};

module.exports = {
  Register,
  Login,
  Logout,
  LogoutAll,
  Profile,
  UpdateProfile,
  DeleteUser,
};
