let router = require("express").Router();
let User = require("../db").import("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.post("/register", function (req, res) {
  User.create({
    username: req.body.user.username,
    passwordhash: bcrypt.hashSync(req.body.user.passwordhash, 13),
  }).then(function createSuccess(user) {
    let token = jwt.sign({ id: user.id }, "i_am_a_passcode", {
      expiresIn: 60 * 60 * 24,
    });
    const responeObj = {
      user: user,
      message: "It worked! User is now Registered.",
      sessionToken: token,
    };
    res.json(responeObj);
  });
});

router.post("/login", (req, res) => {
  User.findOne({ where: { username: req.body.user.username } })
    .then((user) => {
      if (user) {
        bcrypt.compare(
          req.body.user.passwordhash,
          user.passwordhash,
          (err, matches) => {
            if (matches) {
              const token = jwt.sign({ id: user.id }, "i_am_a_passcode", {
                expiresIn: 60 * 60 * 48,
              });
              res.status(200).json({
                user: user,
                message: `You have logged in successfully`,
                sessionToken: token,
              });
            } else {
              res.status(502).json({ error: "login failed" });
            }
          }
        );
      } else {
        res.status(500).json({ error: "login failed" });
      }
    })
    .catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;
