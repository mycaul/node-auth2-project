const router = require("express").Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 


const Users = require("../users/users-model.js");
const secrets = require('../config/secrets.js');

// posting for register
router.post('/register', (req, res) => {
 const user = req.body; // username, password

  // hash the creds.password
const rounds = process.env.HASH_ROUNDS || 14
const hash = bcrypt.hashSync(user.password, rounds);
user.password = hash;


  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ errorMessage: error.message });
    });
});

// posting for login
router.post('/login', (req, res) => {
let {username, password} = req.body; 

  // search for the user by the username
    Users.findBy({username})
      .then(([user]) => {
          console.log('user', user);
          //if we find the user, then also check that passwords match
          if(user && bcrypt.compareSync(password, user.password)) {
              //produce a token
              const token = generateToken(user);
              //send the token to the client
              res.status(200).json({successMessage: "Yes! You're In!", token})
          } else {
            res.status(401).json({errorMessage: 'Nope! Not happening!'})
          }
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ errorMessage: error.message });
      });
  });
  
// getting user to logout
router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(error => {
            if(error) {
                res.status(500).json({errorMessage: "Failed to logout"})
            } else {
                res.status(200).json({successMessage: "Yippie!! You're FREEE!!!"})
            }
        });
    }
})

function generateToken(user) {
  const payload = {
    userId: user.id,
    username: user.username
  }
  const secret = secrets.jwtSecret
  const options = {
    expiresIn: "1d"
  }
  return jwt.sign(payload, secret, options);
}

module.exports = router;