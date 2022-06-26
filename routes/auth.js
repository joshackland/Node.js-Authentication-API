const router = require("express").Router();
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const { registerValidation, loginValidation } = require("../validation");

router.post("/register", async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Check if email exists in DB
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return res.status(409).send("Email already exists");

  //Hash and salt password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
    admin: false,
  });
  try {
    const savedUser = await user.save();
    res.status(201).send(`Successfully created user`);
  } catch (err) {
    console.log("Something went wrong creating user: " + err);
    res.status(500).send(err);
  }
});

router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res
      .status(401)
      .send("(email - delete this in prod) Email or password was incorrect");

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass)
    return res
      .status(401)
      .send("(password - delete this in prod) Email or password was incorrect");

  res.status(200).send("Successfully logged in!");
});

module.exports = router;
