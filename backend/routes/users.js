var express = require('express');
var router = express.Router();
const uid2 = require('uid2');
const bcrypt = require('bcrypt');


require('../models/connection');
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');

router.post('/signup', (req, res) => {
  if (!checkBody(req.body, ['username', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  // Check if the user has not already been registered
  User.findOne({ username: req.body.username }).then(data => {
    if (data === null) {
      const token = uid2(32);
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        username: req.body.username,
        password: hash,
        token: token,

      });

      newUser.save().then((data) => {
        res.json({ result: true, token: data.token, canBookmark: true });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: 'User already exists', });
    }
  });
});

router.post('/signin', (req, res) => {
  if (!checkBody(req.body, ['username', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  User.findOne({ username: req.body.username }).then(data => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token, canBookmark: true });
    } else {
      res.json({ result: false, error: 'User not found' });
    }
  });
});

router.get('/canBookmark/:token', (req, res) => {
  User.findOne({ token: req.params.token })
    .then(userToken => {
      if (userToken) {
        res.json({ result: true, canBookmark: userToken.canBookmark });
      } else {
        res.json({ result: false, error: 'User not found' });
      }
    });
});




module.exports = router;
